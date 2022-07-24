import React, {Component} from "react";
import axios from "axios";
import JobOfferOverviewComponent from "./JobOfferOverviewComponent";

/**
 * Display all job offer requests of the respective author in this component
 * Adapted from MyJobOfferView.js
 */
export default class MyJobOfferRequestsView extends Component {

    constructor(props) {
        super(props);
        this.jobs = "";
        this.renderJobs = "";
    }

    componentDidMount() {
        console.log("fetch job offers");
        axios.get('/api/jobOffer/getMyJobOfferRequests').then(res => {
            this.jobs = res.data;
            console.log(this.jobs);
            this.renderJobs = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>)
            this.forceUpdate();
        })
    }

    render() {
        return (
            <div className="search-wrapper category-wrapper border border-4 rounded">
                <h3 style={{marginTop: "5px"}}>My Job Offer Requests</h3>
                {this.renderJobs}
            </div>
        );
    }
}