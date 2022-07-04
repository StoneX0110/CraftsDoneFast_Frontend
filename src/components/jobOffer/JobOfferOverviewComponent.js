import React from "react";
import Moment from 'moment';
import "./OverviewComponent.css"

var Router = require('react-router-dom');
var Link = Router.Link;

export default class JobOfferOverviewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.formatDate = Moment(this.props.job.insertionDate).format('DD.MM.YYYY hh:mm');
        this.cityAndDist = this.cityAndDist.bind(this);
    }

    cityAndDist() {
        if (this.props.city === undefined) {
            return "";
        } else {
            return `${this.props.city} (${this.props.dist} km)`;
        }
    }

    render() {
        return (
            <div>
                <div className="card border border-4 rounded mb-3">
                    <Link to={"/jobOffer/" + this.props.job._id}
                          style={{textDecoration: 'none', color: "rgb(41, 118, 74)"}}>
                        <div className="card-body">
                            <div className="row">
                                <div className="card-text col-auto">{this.props.job.postalCode} {this.cityAndDist()}</div>
                            <div className="card-text col" style={{textAlign: "right"}}>{this.formatDate}</div>
                            </div>
                            <p className="card-title">{this.props.job.title}</p>
                            <div className="row">
                                <div className="card-text col-auto">{this.props.job.priceExpectation === "" ?
                                    ("No price expectation") : (`${this.props.job.priceExpectation} €`)}</div>
                                <div className="card-text col" style={{textAlign: "right"}}>User Rating: {this.props.rating}&#9733;</div>
                        </div>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}