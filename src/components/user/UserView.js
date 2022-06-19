import React, {Component} from "react";
import axios from "axios";

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
            edit: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
        }
    }

    componentDidMount() {
        console.log("fetch user");
        axios.get('/api/user/' + this.username).then(res => {
            this.setState(res.data.settings);
            console.log(this.state);
        })
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
                //console.log(res.data);
            })
    }

    render() {
        return (
            <div>
                <p className="h1">Profile</p>
                {this.user === this.username && !this.state.edit &&
                <button type="button" className="btn btn-primary" onClick={(e) => this.setState({edit: true})}>Edit
                    Profile</button>}
                {this.user === this.username && this.state.edit &&
                <button type="button" className="btn btn-info" onClick={this.updateUser}>Save Profile</button>}

                <div className="form-group">
                    <div className="form-row row">
                        <label>Short Description</label>
                        <input name="shortDescription" type="text" readOnly={this.state.edit ? false : true}
                               className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2"
                               value={this.state.shortDescription} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row row">
                        <label>Name</label>
                        <input name="name" type="text" readOnly={this.state.edit ? false : true}
                               className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2"
                               value={this.state.name} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row row">
                        <label>Postal Code</label>
                        <input name="postalCode" type="text" readOnly={this.state.edit ? false : true}
                               className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2"
                               value={this.state.postalCode} onChange={this.handleChange}/>
                    </div>
                    <div className="form-row row">
                        <label>Full Description</label>
                        <input name="description" type="text" readOnly={this.state.edit ? false : true}
                               className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2"
                               value={this.state.description} onChange={this.handleChange}/>
                    </div>
                </div>
            </div>

        );
    }
}