import React, {Component} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";


export default class PopupCreateChat extends Component {
    noJobOffer = "No Job Offer";

    constructor(props) {
        super(props);
        this.username = window.location.pathname.split("/").pop();
        this.state = {
            open: false,
            job: "",
            jobs: [],
            jobNames: [],
            jobSelection: "",
            title: "",
            name: props.username,
        }

        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClose() {
        this.setState({open: false});
    }

    handleOpen() {
        this.setState({open: true});
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

    handleSubmit(event) {
        event.preventDefault();
        let chatToCreate = {};
        //create chat
        //define title & set connected job offer if present
        if (this.state.title !== '') {
            chatToCreate.title = this.state.title;
        } else {
            chatToCreate.title = this.state.job;
            chatToCreate.jobOffer = this.state.jobs.find(oneJob => oneJob.title === this.state.job)._id;
        }

        chatToCreate.users = {craftsman: this.username, client: this.user};

        //post to db
        axios.post('/api/chat/create', chatToCreate).then(res => {
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
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={this.handleClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <Modal.Header>
                        <Modal.Title>Contact {this.state.name}</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body className="popupMainContainer">
                            <div className="form-group popupInputContainer">
                                <label>Select Job Offer or</label>
                                <select required type="select" name="job" className="form-control" id="job"
                                        value={this.state.job} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>{this.noJobOffer}</option>
                                    {this.state.jobSelection}
                                </select>
                                <label>Title</label>
                                <input required type="text" name="title" className="form-control"
                                       id="exampleFormControlInput1"
                                       value={this.state.title} onChange={this.handleChange}
                                       placeholder="Insert Title..."
                                       disabled={this.state.job !== this.noJobOffer}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="form-group">
                                <button type="button" className="btn popupButtonCancel"
                                        onClick={this.handleClose}>Cancel
                                </button>
                                <button type="submit" id="submit" className="btn popupButton">Contact</button>
                            </div>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }
};

