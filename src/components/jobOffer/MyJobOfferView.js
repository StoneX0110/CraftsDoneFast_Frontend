import React, {Component} from "react";
import axios from "axios";
import JobOfferOverviewComponent from "./JobOfferOverviewComponent";

/**
 * Display all job offers of the respective author in this component
 */
export default class MyJobOfferView extends Component {

    constructor(props) {
        super(props);
        this.jobs = "";
        this.renderJobs = "";
    }

    componentDidMount() {
        console.log("Get user rating")
        console.log("fetch job offers");
        axios.get('/api/jobOffer/myJobOffers').then(res => {
            this.jobs = res.data;
            console.log(this.jobs);
            this.renderJobs = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e} ownOverview={true}/>)
            this.forceUpdate();
        })
    }

    render() {
        return (
            <div>
                <div className="search-wrapper category-wrapper border-4 border rounded">
                    <h3 style={{marginTop: "5px"}}>My Job Offers</h3>
                    <div className="gapLeft gapRight">
                        {this.renderJobs}
                    </div>
                </div>
            </div>
        );
    }
}