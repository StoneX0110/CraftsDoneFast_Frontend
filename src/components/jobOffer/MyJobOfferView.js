import React, {Component} from "react";
import axios from "axios";
import JobOfferOverviewComponent from "./JobOfferOverviewComponent";

export default class MyJobOfferView extends Component {

    constructor(props) {
        super(props);
        this.jobs = "";
        this.renderJobs = "";
    }

    // getMyJobOffers() {
    //     console.log("fetch job offers");
    //     axios.get('/api/jobOffer/myJobOffers').then(res => {
    //         console.log(res);
    //         // console.log(res.data);
    //     })
    //     // axios({
    //     //     url:
    //     //         "/api/jobOffer/myJobOffers",
    //     //     method: "GET",
    //     // })
    //     //     .then(response => {
    //     //         console.log(response)
    //     //         this.jobs = response;
    //     //     })y
    //     //     .catch(err => {
    //     //         console.log(err);
    //     //     });
    // }

    componentDidMount() {
        console.log("fetch job offers");
        axios.get('/api/jobOffer/myJobOffers').then(res => {
            this.jobs = res.data;
            console.log(this.jobs);
            // this.renderJobs = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id}>{e.title} - {e.category}</JobOfferOverviewComponent>)
            this.renderJobs = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>)
            // console.log(this.renderJobs);
            this.forceUpdate();
        })
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor: "rgb(41, 118, 74)", color: "rgb(240,245,215)"}}>
                    <p className="h1">My Job Offers</p>
                    {this.renderJobs}
                </div>
            </div>
        );
    }
}