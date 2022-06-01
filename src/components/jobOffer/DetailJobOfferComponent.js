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
            },
        };
        this.details = "";
        //this.formatDate = Moment(this.props.job.insertionDate).format('hh:mm DD.MM.YYYY');
    }

    componentDidMount() {
        // console.log('/api/jobOffer/' + this.id);

        axios.get('/api/jobOffer/' + this.id).then(res => {
            const foo = res.data;
            // this.setState(res.data);
            this.setState({job: res.data});
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
                    <label>Title</label>
                    <input type="text" readOnly className="form-control-plaintext border-2 border-success m-4 p-2" defaultValue={this.state.job.title} />
                    {/* <input type="text" name="title" className="form-control" id="exampleFormControlInput1" readOnly placeholder={this.state.title} /> */}
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
            </div>
        );
    }
}