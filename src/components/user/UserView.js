import React, {Component, useState} from "react";
import Select from 'react-select'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from "axios";
import "./UserView.css"
import Category from "../Categories";
import {Button} from "react-bootstrap";

export default class UserView extends Component {

    constructor(props) {
        super(props);
        this.username = window.location.pathname.split("/").pop();
        this.state = {
            profileBoost: false,
            name: '',
            address: '',
            birthday: null,
            postalCode: null,
            shortDescription: '',
            description: '',
            edit: false,
            skills: [],
        }
        this.options = [];
        this.jobs = [];
        this.jobNames = [];
        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleChatCreation = this.handleChatCreation.bind(this)
        this.render = this.render.bind(this);
        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
        }
    }

    componentDidMount() {
        console.log("fetch user");
        axios.get('/api/user/profile/' + this.username).then(res => {
            this.setState(res.data.settings);
        })

        //fill options
        this.options = Category.returnOptions();
        axios.get('/api/jobOffer/myJobOffers').then(res => {
            this.jobs =  res.data;
            console.log(this.jobs)
            this.jobNames = this.jobs.map((e) => e.title);
            this.forceUpdate();
        }).then()
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    updateUser() {
        this.setState({edit: false});
        const userState = this.state;
        delete userState.edit;
        const user = {state: userState, id: JSON.parse(sessionStorage.getItem('userData')).id}

        //console.log(user);
        axios.post('/api/user/update', user)
            .then(res => {
                const id = res.data;
            })
    }

    handleSelectionChange = skills => {
        this.setState({skills});
    };

    displaySelected(skills) {
        return skills.map(choice => {
            return choice.value + ", ";
        });
    }

    handleChatCreation() {
        console.log("test chat creation")
        console.log(this.state)
        console.log("Title: " + this.state.title)
        console.log("Job: " + this.state.job)
    }

    returnSelected() {
        return this.jobNames.map((e) => <option>{e}</option>)
    }

    render() {
        const def = this.state.skills;
        return (
            <div className="profile">
                <p className="h1">Profile</p>
                {this.user === this.username && !this.state.edit &&
                    <button type="button" className="btn btn-primary" onClick={(e) => this.setState({edit: true})}>
                        Edit Profile
                    </button>}
                {this.user === this.username && this.state.edit &&
                    <button type="button" className="btn btn-info" onClick={this.updateUser}>Save Profile</button>}
                {/*TODO: CSS für Schönheit noch definieren*/}
                {this.user !== this.username && (this.state.skills.length > 0) &&
                <Popup
                    trigger={<button type="button" className="btn btn-primary"> Contact </button>}
                    modal
                >
                    {close => (
                        <div>
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                            <div className="header"> Contact {this.state.name} </div>
                            <label>Select Job Offer</label>
                            <select required name="job" className="form-control" id="job"
                                    value={this.state.job} onChange={this.handleChange}>
                                <option defaultValue disabled value="">Choose...</option>
                                <option>Any</option>
                                {this.returnSelected()}
                            </select>
                            <div className="form-group">
                                <label>Title</label>
                                <input required type="text" name="title" className="form-control" id="exampleFormControlInput1"
                                       value={this.state.title} onChange={this.handleChange}
                                       placeholder="Insert Title..."/>
                            </div>
                            <div>
                                <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                                    console.log('modal closed ');
                                    close();
                                    this.handleChatCreation();
                                }}>Contact</button>
                            </div>
                        </div>
                    )}
                </Popup>
                }
                <div className="form-group settings">
                    <div className="form-row row">
                        <label>Short Description</label>
                        <input name="shortDescription" type="text" readOnly={!this.state.edit}
                               className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2"
                               value={this.state.shortDescription} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row row">
                        <div className="form-group col-md-6">
                            <label>Name</label>
                            <input name="name" type="text" readOnly={!this.state.edit}
                                   className="form-control-plaintext border-2 border-success m-3 p-2"
                                   value={this.state.name} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Postal Code</label>
                            <input type="number" name="postalCode" readOnly={!this.state.edit}
                                   className="form-control-plaintext col-md-3 border-2 border-success m-3 p-2"
                                   value={this.state.postalCode} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-row row">
                        <label>Full Description</label>
                        <textarea name="description" type="text" readOnly={!this.state.edit}
                                  className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2"
                                  value={this.state.description} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row row">
                        Skills : {this.displaySelected(this.state.skills)}
                        {this.user === this.username && this.state.edit &&
                            <Select className="basic-multi-select"
                                    closeMenuOnSelect={false}
                                    classNamePrefix="select"
                                    value={this.state.skills}
                                    options={this.options}
                                    isMulti={true}
                                    onChange={this.handleSelectionChange}
                            />
                        }
                    </div>
                </div>
            </div>

        );
    }

}