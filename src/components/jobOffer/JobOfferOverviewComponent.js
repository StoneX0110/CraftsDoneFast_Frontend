import React from "react";
import Moment from 'moment';
import "./JobOfferOverviewComponent.css"

var Router = require('react-router-dom');
var Link = Router.Link;

export default class JobOfferOverviewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.formatDate = Moment(this.props.job.insertionDate).format('DD.MM.YYYY hh:mm');
    }

    render() {
        return (
            <div>
                <div className="card border-success mb-3">
                    <Link to={"/jobOffer/" + this.props.job._id} style={{textDecoration: 'none', color: "rgb(41, 118, 74)"}}>
                        <div className="card-body">
                            <p className="card-title">{this.props.job.title}</p>
                            <p className="card-text">
                                Zip {this.props.job.postalCode} - {this.props.job.priceExpectation === "" ?
                                ("No price expectation") : (`Price expectation: ${this.props.job.priceExpectation} €`)}
                            </p>
                            <p className="card-text">Job offer created at {this.formatDate}</p>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}