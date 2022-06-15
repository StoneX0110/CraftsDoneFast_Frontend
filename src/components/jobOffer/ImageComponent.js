import "./JobOffer.css"
import React from "react";


var Router = require('react-router-dom');
var Link = Router.Link;

export default class ImageComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="image border-success mb-3">
                <div className="photo border border-1 mb-3"><img className="image" key={this.props.imageSrc} src={this.props.imageSrc} /></div>
            </div>
        );
    }
}