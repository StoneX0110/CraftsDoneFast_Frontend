import React from "react";
import Moment from 'moment';
import "../jobOffer/OverviewComponent.css"

var Router = require('react-router-dom');
var Link = Router.Link;

export default class UserOverviewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.cityAndDist = this.cityAndDist.bind(this);
        this.imageLink = "data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(props.user.profilePicture.data.data))).substring(20);
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
                    <Link to={"/user/profile/" + this.props.user.username}
                          style={{textDecoration: 'none', color: "rgb(41, 118, 74)"}}>

                        <div className="card-body">
                            <img className="rounded float-left img img-fluid" src={this.imageLink} alt="ProfilePicture" />
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
                                    Craftsman Rating: {this.props.rating}&#9733;
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}