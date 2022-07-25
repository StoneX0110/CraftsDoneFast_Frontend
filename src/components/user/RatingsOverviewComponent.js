import React from "react";
import Moment from 'moment';

var Router = require('react-router-dom');
var Link = Router.Link;

export default class RatingsOverviewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.formatDate = Moment(this.props.date).format('DD.MM.YYYY hh:mm');
    }

    render() {
        return (
            <div>
                <div className="border border-2 rounded m-3" style={{textDecoration: 'none', color: "black"}}>
                    <div className="card-body text-start">
                        <div className="row">
                            <div className="card-text col-auto">
                                Rating: {this.props.stars}&#9733;
                            </div>
                            <div className="card-text col" style={{textAlign: "right"}}>{this.formatDate}</div>
                        </div>
                        {this.props.description}
                    </div>
                </div>
            </div>
        );
    }
}