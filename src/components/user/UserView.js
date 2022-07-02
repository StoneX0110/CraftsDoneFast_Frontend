import React, {Component} from "react";
import Select from 'react-select'
import PopupCreateChat from './PopupCreateChat';
import 'reactjs-popup/dist/index.css';
import axios from "axios";
import "./UserView.css"
import Category from "../Categories";
import {Button} from "react-bootstrap";
import Resizer from "react-image-file-resizer";
import ImageComponent from "../jobOffer/ImageComponent";
import defaultProfilePicture from "./defaultProfilePicture.png";

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
            profilePicture: '',
        }
        this.options = [];
        this.jobs = [];
        this.jobNames = [];
        this.profilePictureURL = "";
        this.handleChange = this.handleChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.render = this.render.bind(this);
        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
        }
    }

    componentDidMount() {
        console.log("fetch user");
        axios.get('/api/user/profile/' + this.username).then(res => {
            this.setState(res.data.settings);
            this.state.profilePicture = ("data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(res.data.profilePicture.data.data))).substring(20));
            const pictureSplitArray = this.state.profilePicture.split(",");
            console.log(pictureSplitArray)
            if (pictureSplitArray[1] === '') {
                this.state.profilePicture = defaultProfilePicture;
            }
            const transformedPictureURL = <ImageComponent imageSrc={this.state.profilePicture} key={this.state.profilePicture} />
            this.setState({ profilePictureURL: transformedPictureURL });
        })

        //fill options
        this.options = Category.returnOptions();
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    updateUser() {
        this.setState({edit: false});
        const userState = this.state;
        const profilePicture = this.state.profilePicture;
        console.log("this.state.profilePicture: " + this.state.profilePicture);
        delete userState.edit;
        const user = {state: userState, id: JSON.parse(sessionStorage.getItem('userData')).id, profilePicture: profilePicture}
        console.log("profilePicture: " + profilePicture);
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

    onImageChange(e) {
        try {
            Resizer.imageFileResizer(
                e.target.files[0],
                300,
                300,
                "JPEG",
                70,
                0,
                (uri) => {
                    this.state.profilePicture = uri;
                    this.profilePictureURL = <ImageComponent imageSrc={this.state.profilePicture} key={this.state.profilePicture}/>;
                    // <span><div className="photo border border-1 mb-3"><img className="image" key={imageSrc} src={imageSrc} /></div></span>);
                    this.setState({profilePictureURL: this.profilePictureURL});
                },
                "base64",
                10,
                10
            );
        } catch (err) {
            console.log(err);
        }
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
                    <PopupCreateChat username={this.state.name}/>
                }
                <div className="form-group settings">
                    <div className="from-group col-md-4">
                        {this.user === this.username && this.state.edit &&
                        <label>Insert Pictures*</label> &&
                            <input className="form-control" type="file" multiple accept="image/*" readOnly={!this.state.edit}
                            onChange={this.onImageChange}/>
                        }
                        <div>
                            <label>Profile Picture</label>
                            {this.state.profilePictureURL}
                        </div>
                    </div>
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