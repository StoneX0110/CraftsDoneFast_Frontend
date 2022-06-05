import React, { Component } from "react";
import axios from "axios";
export default class Registration extends Component {


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
                                        <form>

                                            <div className="row">
                                                <div className="col-md-12 mb-4">

                                                    <div className="form-outline">
                                                        <input type="text" id="firstName" className="form-control form-control-lg" />
                                                        <label className="form-label">Enter Username</label>
                                                    </div>

                                                </div>
                                                <div className="col-md-12 mb-4">

                                                    <div className="form-outline">
                                                        <input type="password" id="lastName" className="form-control form-control-lg" />
                                                        <label className="form-label">Enter Password</label>
                                                    </div>
                                                    <div className="form-outline">
                                                        <input type="password" id="lastName" className="form-control form-control-lg" />
                                                        <label className="form-label">Re-enter Password</label>
                                                    </div>


                                                </div>
                                            </div>                                                                           
                                            <div className="mt-0 pt-2">
                                                <input className="btn btn-success btn-lg" type="submit" value="Register" />
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

