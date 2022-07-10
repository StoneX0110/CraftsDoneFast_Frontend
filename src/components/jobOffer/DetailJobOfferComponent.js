import React, {Component} from "react";
import Moment from 'moment';
import {useParams} from "react-router-dom";
import axios from "axios";
import ImageComponent from "./ImageComponent";
import './JobOffer.css'
import BackButtonComponent from "../BackButtonComponent";
import {isLoggedIn} from "../logic/authentication";
import PopupCreateChatJobOffer from "./PopupCreateChatJobOffer";
import Categories from "../Categories";


export default class DetailJobOfferComponent extends React.Component {

    constructor(props) {
        super(props);
        this.id = window.location.pathname.split("/").pop();
        this.state = {
            title: "",
            category: "",
            description: "",
            priceExpectation: "",
            author: {
                username: "",
            },
            insertionDate: "",
            postalCode: "",
            images: [],
            imageurl: "",
            urls: "",
            edit: false, //edit mode
            popup: "", //popup for contacting, has to be created after the data of the jobOffer is received from the backend
        };
        this.details = "";
        this.skills = [];
        this.handleChange = this.handleChange.bind(this);
        this.updateJobOffer = this.updateJobOffer.bind(this);
        this.deleteJobOffer = this.deleteJobOffer.bind(this);
        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
            this.skills = JSON.parse(sessionStorage.getItem('userData')).settings.skills;
        }
    }

    componentDidMount() {
        axios.get('/api/jobOffer/' + this.id).then(res => {
            const foo = res.data;
            this.setState(res.data);
            const imageResult = [];
            //convert buffer data to image
            res.data.images.forEach(element => {
                imageResult.push("data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(element.data.data))).substring(20));
            });
            //create a list of images based on the converted images
            this.setState({urls: imageResult.map(imageSrc => <ImageComponent imageSrc={imageSrc} key={imageSrc}/>)});
            this.setState({
                popup: <PopupCreateChatJobOffer username={res.data.author.username} id={this.id}
                                                title={res.data.title}/>
            });
        });
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    updateJobOffer() {
        this.setState({edit: false});
        const jobOffer = Object.create(this.state);
        delete jobOffer.urls;
        delete jobOffer.edit;
        delete jobOffer.images;
        delete jobOffer.imageurl;
        axios.post('/api/jobOffer/update', this.state)
            .then(res => {
                const id = res.data;
                console.log(res.data);
                alert("Your Job Offer was updated Successfully!")
            })
    }

    deleteJobOffer() {
        axios.delete('/api/jobOffer/delete/' + this.state._id)
            .then(res => {
                window.location = "/";
            })
    }


    render() {
        return (
            <div className="search-wrapper category-wrapper border-4 border rounded">
                <BackButtonComponent text="Overview Page" to="/"/>
                <h3 className="padBottom">Job Offer Details</h3>
                <div className="flex-row justify-content-center padBottom">
                    {this.user === this.state.author.username && !this.state.edit &&
                        <button type="button" className="btn btn-primary btn-sm" id="editButton"
                                onClick={(e) => this.setState({edit: true})}>
                            Edit Job Offer
                        </button>}
                    {this.user === this.state.author.username && this.state.edit &&
                        <button type="button" className="btn btn-primary btn-sm" id="saveButton"
                                onClick={this.updateJobOffer}>
                            Save Job Offer
                        </button>}
                    {this.user === this.state.author.username &&
                        <button type="button" className="btn btn-danger btn-sm" onClick={this.deleteJobOffer}
                                style={{marginLeft: "10px"}}>
                            Delete Job Offer
                        </button>}
                    {this.user !== this.state.author.username && this.skills.length > 0 && this.state.popup}
                </div>
                <div className="form-group gapLeft gapRight">
                    <div className="form-row row padBottom" style={{marginLeft:"0px", marginRight: "0px"}}>
                            <label>Title</label>
                            <textarea name="title" type="text" readOnly={!this.state.edit}
                                   className="form-control-plaintext border-2 border rounded p-2"
                                   value={this.state.title} onChange={this.handleChange}/>
                        </div>
                    <div className="form-row row padBottom">
                        <div className="col">
                            <label>Author</label>
                            <input type="text" readOnly
                                   className="form-control-plaintext border-2 border rounded p-2"
                                   value={this.state.author.username}/>
                        </div>
                        <div className="form-group col">
                            <label>Postal Code</label>
                            <input name="postalCode" type="text" readOnly={!this.state.edit}
                                   className="form-control-plaintext border-2 border rounded p-2"
                                   value={this.state.postalCode} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group col">
                            <label>Category</label>
                            {!this.state.edit && <input name="category" type="text" readOnly
                                                        className="form-control-plaintext border-2 border rounded p-2"
                                                        value={this.state.category}/>}
                            {this.state.edit && <select required name="category" readOnly={!this.state.edit}
                                                        className="form-control border-2 border rounded p-2"
                                                        id="exampleFormControlSelect1" value={this.state.category}
                                                        onChange={this.handleChange}>
                                <option defaultValue disabled value="">Choose...</option>
                                {Categories.returnSelection()}
                            </select>}
                        </div>
                        <div className="form-group col">
                            <label>Price expectation (in USD)</label>
                            <input name="priceExpectation" type="text" readOnly={!this.state.edit}
                                   className="form-control-plaintext border-2 border rounded p-2"
                                   value={this.state.priceExpectation} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" type="text" readOnly={!this.state.edit}
                                  className="form-control-plaintext border-2 border rounded p-2" rows="5"
                                  value={this.state.description} onChange={this.handleChange}></textarea>
                    </div>
                    <div className="from-group col-md-3">
                        <div>
                            {this.state.urls}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}