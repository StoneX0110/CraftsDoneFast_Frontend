import React, { Component } from "react";
import Moment from 'moment';
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageComponent from "./ImageComponent";
import './JobOffer.css'




export default class DetailJobOfferComponent extends React.Component {

    constructor(props) {
        super(props);
        this.id = window.location.pathname.split("/").pop();
        this.state = {
            job: {
                title: "",
                category: "",
                description: "",
                priceExpectation: "",
                author: {
                    username: "",
                },
                insertionDate: "",
                postalCode: "",
                images: [],
                imageurl: "",
            },
            urls: "",
        };
        this.details = "";
    }

    componentDidMount() {
        axios.get('/api/jobOffer/' + this.id).then(res => {
            const foo = res.data;
            this.setState({ job: res.data });
            const imageResult = [];
            res.data.images.forEach(element => {
                imageResult.push("data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(element.data.data))).substring(20));
            });
            this.setState({ urls: imageResult.map(imageSrc => <ImageComponent imageSrc={imageSrc}/>) });
        })
    }


    render() {
        return (
            <div className="col-md-9 m-3">
                <p className="h1">Detail Job Offer</p>
                <div className="form-group">
                    <div className="form-row row">
                        <div className="form-group col-md-6">
                            <label>Title</label>
                            <input type="text" readOnly className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2" defaultValue={this.state.job.title} />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Author</label>
                            <input type="text" readOnly className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2" defaultValue={this.state.job.author.username} />
                        </div>
                    </div>
                </div>
                <div className="form-row row">
                    <div className="form-group col-md-4">
                        <label>Category</label>
                        <input type="text" readOnly className="form-control-plaintext border-2 border-success m-4 p-2" defaultValue={this.state.job.category} />
                    </div>
                    <div className="form-group col-md-4">
                        <label>Postal Code</label>
                        <input type="text" readOnly className="form-control-plaintext border-2 border-success m-4 p-2" defaultValue={this.state.job.postalCode} />
                    </div>
                    <div className="form-group col-md-4">
                        <label>Price expectation*</label>
                        <input type="text" readOnly className="form-control-plaintext border-2 border-success m-4 p-2" defaultValue={this.state.job.priceExpectation} />

                    </div>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" readOnly className="form-control-plaintext border-2 border-success m-4 p-2" rows="5" value={this.state.job.description}></textarea>
                </div>
                <div  className="from-group col-md-3">
                        <div>
                            {this.state.urls}
                        </div>
                    </div>
            </div>

        );
    }
}