import React, { Component } from "react";
import Moment from 'moment';
import { useParams } from "react-router-dom";
import axios from "axios";



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
                author: "",
                insertionDate: "",
                postalCode: "",
                images: [],
                imageurl: "",
            },
            urls: "",
        };
        this.details = "";
        //this.formatDate = Moment(this.props.job.insertionDate).format('hh:mm DD.MM.YYYY');
    }

    componentDidMount() {
        // console.log('/api/jobOffer/' + this.id);
        axios.get('/api/jobOffer/' + this.id).then(res => {
            const foo = res.data;
            // this.setState(res.data);
            this.setState({ job: res.data });
            // console.log(res.data);
            // console.log(res.data.images[0].data.data);
            const imageResult = [];
            res.data.images.forEach(element => {
                imageResult.push("data:image/jpeg;base64," + btoa(String.fromCharCode(...new Uint8Array(element.data.data))).substring(20));
            });
            // const base64String = btoa(String.fromCharCode(...new Uint8Array(res.data.images[0].data.data)));
            // console.log(base64String);
            // console.log(this.state.job.imageurl);
            // const test = "data:image/jpeg;base64," + base64String.substring(20);
            // this.state.urls = imageResult.map(imageSrc => <img className="border mb-3" key={imageSrc} src={imageSrc} />);
            // console.log(test);
            this.setState({ urls: imageResult.map(imageSrc => <img className="border mb-3" key={imageSrc} src={imageSrc} />) });
            // console.log(this.state.urls);
            // this.forceUpdate();
            // console.log(this.state.urls);
            // console.log(this.state.title);
            // this.renderJobs = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id}>{e.title} - {e.category}</JobOfferOverviewComponent>)
            // console.log(this.renderJobs);
            // this.details = "<label>{this.state.title}</>";
            // this.forceUpdate();
        })
    }


    render() {
        return (
            <div className="col-md-9 m-3">
                <p className="h1">Detail Job Offer</p>
                {/* <label>{this.state.job.title}</label>
                <label>{this.state.job.category}</label> */}
                <div className="form-group">
                    {/* <label>Title</label> */}
                    <div className="form-row row">
                        <div className="form-group col-md-6">
                            <label>Title</label>
                            <input type="text" readOnly className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2" defaultValue={this.state.job.title} />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Author</label>
                            <input type="text" readOnly className="form-control-plaintext col-md-3 border-2 border-success m-4 p-2" defaultValue={this.state.job.author} />
                            {/* <input type="text" name="title" className="form-control" id="exampleFormControlInput1" readOnly placeholder={this.state.title} /> */}
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