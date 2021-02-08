import { Component } from 'react';
import CustomModal from './components/ModalComponent'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false
      },
      viewCompleted: false,
      modal: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.deleteTask = this.deleteTask.bind(this);


    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  componentDidMount() {
    this.fetchTasks();
    console.log(this.state.todoList);
  }

  fetchTasks() {
    fetch('http://127.0.0.1:8000/api/todo-list/')
      .then(response => response.json())
      .then(data => this.setState({
        todoList: data,
      }))
      .catch(() => console.log("Can’t access  response. Blocked by browser?"))
  }

  deleteTask(task) {
    var csrftoken = this.getCookie('csrftoken')
    fetch(`http://127.0.0.1:8000/api/todo-delete/${task.id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'applitcation/json',
        'X-CSRFToken': csrftoken,
      }
    }
    )
      .then((response) => {
        this.fetchTasks();
      })
      .catch(() => console.log("ERROR DELETING"))
  }

  createTask = () =>{
    const item = {title:"", completed:false};
    this.setState({activeItem:item, modal: !this.state.modal});
  }
  editTask = (item) => {
    this.setState({activeItem:item, modal: !this.state.modal});
  }
  toggleModal(){
    this.setState({ modal: !this.state.modal });
  };
  handleSubmit = task => {
    this.toggleModal();
    var csrftoken = this.getCookie('csrftoken')
    if (task.id) {
      var url = `http://127.0.0.1:8000/api/todo-update/${task.id}`
      fetch(url,{
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body: JSON.stringify(task)
      })
      .then(()=>{this.fetchTasks()})
      .catch(()=>{console.log("ERROR Updation")})
      return;
    }
    else{
      fetch('http://127.0.0.1:8000/api/todo-create/',{
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body: JSON.stringify(task)
      })
      .then(()=>{this.fetchTasks()})
      .catch(()=>{console.log("ERROR CREATION")})
    }

  };
  toggleCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    else
      return this.setState({ viewCompleted: false });
  };
  renderTabs = () => {
    return (
      <div className="row mt-2 mb-2">
        <button onClick={() => this.toggleCompleted(true)} className="btn btn-primary mr-2 mb-2">
          Completed Tasks
        </button>
        <button onClick={() => this.toggleCompleted(false)} className="btn btn-primary mb-2">
          Incompleted Tasks
        </button>
      </div>
    );
  };
  renderTasks = () => {
    const newList = this.state.todoList.filter((task) => task.completed === this.state.viewCompleted);
    var self = this
    return (
      <div className="">
        {newList.map((task, index) => {
          return (
            <div key={index} className="row row-content mb-2">
              <div className="mr-2">
                {task.title}
              </div>
              <div>
                <button onClick={()=>this.editTask(task)} className="btn btn-warning mr-2">Edit</button>
              </div>
              <div>
                <button onClick={() => self.deleteTask(task)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    )
  };

  render() {
    return (<div className="main-body">
      <div className="content-center">
        <div className="row row-content">
          <button onClick={() => this.createTask()} className="btn btn-primary">Add Task</button>
        </div>
        <div className="">
          {this.renderTabs()}
          {this.renderTasks()}
          {this.state.modal ?
            (<CustomModal
              activeItem={this.state.activeItem}
              toggle={this.toggleModal}
              onSave={this.handleSubmit}
            />) : null}
        </div>
      </div>
    </div>
    );
  }
}



export default App;
