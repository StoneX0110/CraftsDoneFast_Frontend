import React, {Component} from "react";
import axios from "axios";

export default class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            repeatPassword: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }


    handleSubmit= event => {
        event.preventDefault();
        console.log("Test");
        axios.post('/api/auth/signup', this.state)
            .then(res => {
                if (res) {
                    window.location = "/login";
                }
            }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <section className="gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row justify-content-center align-items-center h-100">
                            <div className="col-12 col-lg-9 col-xl-7">
                                <div className="card shadow-2-strong card-registration">
                                    <div className="card-body p-4 p-md-5">
                                        <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
                                        <form onSubmit={this.handleSubmit}
                                              style={{marginRight: "20px", marginLeft: "20px"}}>
                                            <div className="row">
                                                <div className="col-md-12 mb-4">

                                                    <div className="form-outline">
                                                        <input type="text" name="username" value={this.state.username}
                                                               onChange={this.handleChange}
                                                               className="form-control form-control-lg" required/>
                                                        <label className="form-label">Enter Username</label>
                                                    </div>

                                                </div>
                                                <div className="col-md-12 mb-4">

                                                    <div className="form-outline">
                                                        <input type="password" name="password"
                                                               value={this.state.password} onChange={this.handleChange}
                                                               className="form-control form-control-lg" required/>
                                                        <label className="form-label">Enter Password</label>
                                                    </div>
                                                    <div className="form-outline">
                                                        <input type="password" name="repeatPassword"
                                                               value={this.state.repeatPassword}
                                                               onChange={this.handleChange}
                                                               className="form-control form-control-lg" required/>
                                                        <label className="form-label">Re-enter Password</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-0 pt-2">
                                                <button type="submit" className="btn btn-success btn-lg">Register</button>
                                            </div>
                                        </form>
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

