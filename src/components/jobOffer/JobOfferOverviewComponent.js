import React, { Component } from "react";
import Moment from 'moment';
var Router = require('react-router-dom');
var Link = Router.Link;


export default class JobOfferOverviewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.formatDate = Moment(this.props.job.insertionDate).format('hh:mm DD.MM.YYYY');
    }

    render() {
        return (
            <div>
                <Link to={"/jobOffer/" + this.props.job._id} style={{ textDecoration: 'none', color: 'black' }}>

                    <div className="card border-success mb-3">
                        {/* <h5 className="card-header">Job Offer created at {this.props.job.insertionDate}</h5> */}
                        <div className="card-body">
                            <p className="card-text">Job Offer created at {this.formatDate}</p>
                            <h5 className="card-title">{this.props.job.title}</h5>
                            <p className="card-text">{this.props.job.postalCode} - {this.props.job.priceExpectation}</p>
                            {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
                            {/* <a href="/jobOffer/${this.props.job._id}" className="btn btn-success stretched-link">View Offer</a> */}
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}