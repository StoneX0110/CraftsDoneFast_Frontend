import React from "react";
import Moment from 'moment';
import "../jobOffer/JobOfferOverviewComponent.css"

var Router = require('react-router-dom');
var Link = Router.Link;

export default class UserOverviewComponent extends React.Component {

    constructor(props) {
        super(props);
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
                <div className="card border-success mb-3">
                    <Link to={"/user/profile/" + this.props.user.username}
                          style={{textDecoration: 'none', color: "rgb(41, 118, 74)"}}>

                        {/* TODO show picture left of information text (see ebay kleinanzeigen for reference) */}
                        <div className="card-body">
                            <div className="row">
                                <div className="card-text col-auto">
                                    {this.props.user.settings.postalCode} {this.cityAndDist()}
                                </div>
                            </div>
                            <p className="card-title">{this.props.user.settings.shortDescription}</p>
                            <div className="row">
                                <div className="card-text col-auto">
                                    {this.props.user.settings.name}
                                </div>
                                <div className="card-text col" style={{textAlign: "right"}}>
                                    User Rating: {this.props.rating}&#9733;
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}