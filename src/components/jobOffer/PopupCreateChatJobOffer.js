import React, {Component} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";


export default class PopupCreateChatJobOffer extends Component {
    noJobOffer = "No Job Offer";

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: props.title,
            username: props.username,
            id: props.id
        }

        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChatCreation = this.handleChatCreation.bind(this);
    }

    handleClose() {
        this.state.open = false;
        this.forceUpdate();
    }

    handleOpen() {
        this.state.open = true;
        axios.get("/api/jobOffer/myJobOffers").then(res => {
            this.state.jobs = res.data;
            this.state.jobNames = this.state.jobs.map((e) => e.title);
            this.state.jobSelection = this.state.jobNames.map((e) => <option>{e}</option>);
            this.state.open = true;
            this.forceUpdate();
        });
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    async handleChatCreation() {
        console.log("test chat creation")

        let chatToCreate = {};
        //create chat
        //define title & set connected job offer if present
        chatToCreate.title = this.state.title;
        chatToCreate.jobOffer = this.state.id;


        chatToCreate.users = {craftsman: this.user, client: this.state.username};

        //post to db
        let createdChatId = '';
        await axios.post('/api/chat/create', chatToCreate).then(res => {
            createdChatId = res.data;
            window.location = "/messages";
        });
    }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" id="contactButton" onClick={this.handleOpen}>
                    Contact
                </button>
                <Modal show={this.state.open} onHide={this.handleClose}>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body className="popupMainContainer">
                        <Modal.Title>Contact {this.state.username}</Modal.Title>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="cancel" className="btn popupButtonCancel" onClick={this.handleClose}>Cancel</button>
                        <button type="button" className="btn" id="contactButton" onClick={() => {
                            console.log('modal closed');
                            this.handleChatCreation().then(this.handleClose());
                        }}>Contact
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};

