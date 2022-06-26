import React, {Component} from "react";
import Popup from 'reactjs-popup';
import axios from "axios";


export default class PopupCreateChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            job: "",
            jobs: [],
            jobNames: [],
            jobSelection: "",
            title: "",
            name: props.username,
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
            console.log(this.state.jobSelection);
            this.forceUpdate();
        });
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    handleChatCreation() {
        console.log("test chat creation")
        console.log(this.state.title)
        console.log(this.state)
        console.log(this.state.job)
    }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.handleOpen}> Contact</button>
                <Popup open={this.state.open} closeOnDocumentClick onClose={this.handleClose}>
                    <div>
                        <button className="close" onClick={this.handleClose}>
                            &times;
                        </button>
                        <div className="header">Contact {this.state.name}</div>
                        <label>Select Job Offer</label>
                        <select required name="job" className="form-control" id="job"
                                value={this.state.job} onChange={this.handleChange}>
                            /*
                            <option defaultValue disabled value="">Choose...</option>
                            */
                            <option>Any</option>
                            {this.state.jobSelection}
                        </select>
                        <div className="form-group">
                            <label>Title</label>
                            <input required type="text" name="title" className="form-control"
                                   id="exampleFormControlInput1"
                                   value={this.state.title} onChange={this.handleChange}
                                   placeholder="Insert Title..."/>
                        </div>
                        <div>
                            <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                                console.log('modal closed');
                                this.handleChatCreation();
                                this.handleClose();
                            }}>Contact
                            </button>
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
};

