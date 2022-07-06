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

const profilePictureDefaultString = "data:image/jpeg;base64,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3HyIePc0AXdLsPs0fmyL+9Yd/wCEelaFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVTULJbyHgASL90/0q3RQByLKVYqwIIOCD2pK2NZs/wDl6Qez/wBDWPQAUUUUAFFFFABRRRQAUUUUAFFFFADo42lkWNBlmOBXUW8K28CxJ0UfmaydEt98zTkcIMD6mtugAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAGuiyIyOMqwwRXL3UDW1w8Tfwng+o7V1VZOt2+US4A5U7W+nagDGooooAKKKKACiiigAooooAKKKkgj82eOP8AvMBQB0OnQ+RYxgjBYbj+NWqQDAxS0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVFcQie3eI/xDFS0UAciQQcEYIpKs6jH5V/KvYncPx5qtQAUUUUAFFFFABRRRQAVd0lN+oIeyAt+mP61SrT0Nc3MjeiY/WgDcooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAw9cTF1G/8AeTH5H/69ZlbOur8kL+hIrGoAKKKKACiiigAooooAK1tC/wBZN9BRRQBs0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAZmuf8e0f+//AErDoooAKKKKACiiigD/2Q=="

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
            if (res.data.profilePicture !== undefined) {
                this.state.profilePicture = ("data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(res.data.profilePicture.data.data))).substring(20));
                const myPictureArray = this.state.profilePicture.split(",");
                if (myPictureArray[1] === '') {
                    this.state.profilePicture = profilePictureDefaultString;
                }
            } else {
                this.state.profilePicture = profilePictureDefaultString;
                console.log("default loaded")
            }
            const transformedPictureURL = <ImageComponent imageSrc={this.state.profilePicture} key={this.state.profilePicture}/>
            this.setState({profilePictureURL: transformedPictureURL});
            console.log("Picture URL: ")
            console.log(this.state.profilePictureURL)
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
        const user = {
            state: userState,
            id: JSON.parse(sessionStorage.getItem('userData')).id,
            profilePicture: profilePicture
        }
        console.log("profilePicture: " + profilePicture);
        //console.log(user);
        axios.post('/api/user/update', user)
            .then(res => {
                const id = res.data;
                //sessionStorage.setItem('userData', JSON.stringify(res.data));
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
        console.log("changes to image")
        this.profileDefault = false;
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
                    this.profilePictureURL =
                        <ImageComponent imageSrc={this.state.profilePicture} key={this.state.profilePicture}/>;
                    // <span><div className="photo border border-1 mb-3"><img className="image" key={imageSrc} src={imageSrc} /></div></span>);
                    this.setState({profilePictureURL: this.profilePictureURL});
                    console.log(this.state.profilePicture)
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
                <button type="button" className="btn btn-primary" id="editButton" onClick={(e) => this.setState({edit: true})}>
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
                        <input className="form-control" type="file" multiple accept="image/*"
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