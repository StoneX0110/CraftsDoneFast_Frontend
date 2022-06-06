import React, { Component } from "react";
import axios from "axios";
var Router = require('react-router-dom');
var Link = Router.Link;


/**
 * adapted from https://mdbootstrap.com/docs/standard/extended/registration/, accessed at 05.06.2022
 */
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({ [name]: event.target.value });
    }

    login(){
        axios.post('/api/auth/signin', this.state)
        .then(res => {
            console.log(res.data);
            localStorage.setItem('userData', JSON.stringify(res.data));
            // console.log(res.data);
            window.location = "/";
        })
    }

    render() {
        return (
            <div>
                <section className="gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row justify-content-center align-items-center h-100">
                            <div className="col-12 col-lg-9 col-xl-7">
                                <div className="card shadow-2-strong card-login">
                                    <div className="card-body p-4 p-md-5">
                                        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Login Form</h3>
                                        {/* <form> */}

                                            <div className="row">
                                                <div className="col-md-12 mb-4">

                                                    <div className="form-outline">
                                                    <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="form-control form-control-lg" />
                                                        <label className="form-label">Username</label>
                                                    </div>

                                                </div>
                                                <div className="col-md-12 mb-4">

                                                    <div className="form-outline">
                                                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control form-control-lg" />
                                                        <label className="form-label">Password</label>
                                                    </div>

                                                </div>
                                            </div>                  
                                

                                            <div className="mt-4 pt-2">
                                            <button className="btn btn-success btn-lg" onClick={() => this.login()}>Login</button>
                                            </div>

                                            <div>
                                            <label>Not a member? <Link to="/registration">Sign Up</Link></label>
                                            </div>
                                        {/* </form> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}