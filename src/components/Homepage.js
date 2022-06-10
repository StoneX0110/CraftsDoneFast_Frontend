import React, {Component} from 'react';
import JobOfferOverviewComponent from "./jobOffer/JobOfferOverviewComponent";
import axios from "axios";

export default class Homepage extends Component {

    constructor(props) {
        super(props);
        this.jobs = "";
        this.renderJobs = "";
    }


    componentDidMount() {
        console.log("fetch job offers");
        axios.get('/api/jobOffer/recentJobOffers').then(res => {
            this.jobs = res.data;
            this.renderJobs = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>)
            this.forceUpdate();
        })
    }

    render() {
        return (
            <div>
                <h1>Insert searchbar here</h1>
                <h2>Recent Jobs:</h2>
                {this.renderJobs}
            </div>
        );
    }
}
