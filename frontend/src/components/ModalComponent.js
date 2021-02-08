import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";

export default class CustomModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: this.props.activeItem
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    render() {
        const { toggle, onSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>Todo Task</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup htmlFor="title">
                            <Label>Title</Label>
                            <Input type="text" name="title" 
                                value={this.state.activeItem.title}
                                onChange={this.handleChange}
                                placeholder="Enter Todo Title" />
                        </FormGroup>
                        <FormGroup check>
                            <Label>
                                <Input type="checkbox" 
                                    checked={this.state.activeItem.completed}
                                    onChange={this.handleChange}
                                    name="completed" />
                                Completed
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                        Submit
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}