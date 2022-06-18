import React, {Component} from 'react';
import JobOfferOverviewComponent from "./jobOffer/JobOfferOverviewComponent";
import axios from "axios";
import './Homepage.css'

export default class Homepage extends Component {

    constructor(props) {
        super(props);
        this.jobs = "";
        this.renderJobs = "";
        this.state = {
            searchJobs: true,
            searchCraftsmen: false,
            category: "",
            postalCode: "",
            range: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log("Fetching 10 most recent job offers...");
        axios.get('/api/jobOffer/recentJobOffers').then(res => {
            this.jobs = res.data;
            let jobComponents = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>);
            this.renderJobs = <div><h4>Recent Jobs:</h4>{jobComponents}</div>;
            this.forceUpdate();
        })
    }

    handleClick = (type) => {
        if (type === "Jobs") {
            this.setState({
                searchJobs: true,
                searchCraftsmen: false,
            })
        } else if (type === "Craftsmen") {
            this.setState({
                searchJobs: false,
                searchCraftsmen: true,
            })
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        if (this.state.searchJobs) {
            event.preventDefault();
            console.log("Fetching matching job offers...");
            axios.get('/api/jobOffer/matchingJobOffers', {params: {state: this.state}}).then(res => {
                this.jobs = res.data;
                let jobComponents = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>);
                this.renderJobs = <div><h4>Results:</h4>{jobComponents}</div>;
                this.forceUpdate();
            })
        } else {

        }
    }

    render() {
        return (
            <div>
                <div className="search-wrapper border border-4 rounded">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row row justify-content-center">
                            <div className="form-group col-md-2">
                                <label>Search for</label>
                                <div className="btn-group btn-toggle">
                                    <button type="button" onClick={() => this.handleClick("Jobs")}
                                            className={`btn ${this.state.searchJobs ? 'btn-enabled' : 'btn-outline-success'}`}>
                                        Jobs
                                    </button>
                                    <button type="button" onClick={() => this.handleClick("Craftsmen")}
                                            className={`btn ${this.state.searchCraftsmen ? 'btn-enabled' : 'btn-outline-success'}`}>
                                        Craftsmen
                                    </button>
                                </div>
                            </div>
                            <div className="form-group col-md-2">
                                <label>Category</label>
                                <select name="category" className="form-control" id="category"
                                        value={this.state.category} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>Electrics</option>
                                    <option>Gardening</option>
                                    <option>Painting</option>
                                    <option>Plumbing</option>
                                    <option>Woodworking</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group col-md-2">
                                <label>Postal Code</label>
                                <input name="postalCode" type="text" className="form-control"
                                       id="postalCode" value={this.state.postalCode}
                                       onChange={this.handleChange} placeholder="Insert ZIP"/>
                            </div>
                            <div className="form-group col-md-2">
                                <label>Range</label>
                                <select name="range" className="form-control" id="range"
                                        value={this.state.range} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>5 km</option>
                                    <option>10 km</option>
                                    <option>25 km</option>
                                    <option>50 km</option>
                                    <option>100 km</option>
                                    <option>Any</option>
                                </select>
                            </div>
                            <div className="form-group col-md-2">
                                <label>Submit Search</label>
                                <button type="submit" className="btn btn-success submission">Submit</button>
                            </div>
                        </div>

                    </form>
                </div>
                <br/>
                {this.renderJobs}
            </div>
        );
    }
}
