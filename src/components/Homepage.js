import React, {Component} from 'react';
import JobOfferOverviewComponent from "./jobOffer/JobOfferOverviewComponent";
import Category from "./Categories"
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
            zips_in_range: [],
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
            const dist = this.state.range.match(/\d+/);

            axios.get(`https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/ow5HhsCp3yPQIYqVA1IKEiGHjWLsF2TlFKhHkjdR3SIAO9QpNFwDYyVxXVoVlcIQ/radius.json/${this.state.postalCode}/${dist}/km?minimal`)
                .then(res => {
                    this.state.zips_in_range = res.data.zip_codes;
                    axios.get('/api/jobOffer/matchingJobOffers', {params: {state: this.state}}).then(res => {
                        this.jobs = res.data;
                        let jobComponents = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>);
                        this.renderJobs = <div><h4>Results:</h4>{jobComponents}</div>;
                        this.forceUpdate();
                    })
                });
        } else {

        }
    }

    /*
    TODO
    - implement sorting (by date (only jobs), rating, distance)
    - implement searching for craftsmen profiles
     */

    render() {
        return (
            <div>
                <div className="search-wrapper border border-4 rounded">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row row justify-content-center">
                            <div className="form-group col-md-2">
                                <div className="form-row row">
                                    <label>Search for</label>
                                </div>
                                <div className="form-row row">
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
                            </div>
                            <div className="form-group col-md-2">
                                <label>Category</label>
                                <select required name="category" className="form-control" id="category"
                                        value={this.state.category} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>Any</option>
                                    {Category.returnSelection()}
                                </select>
                            </div>
                            <div className="form-group col-md-2">
                                <label>Postal Code</label>
                                <input required name="postalCode" type="number" className="form-control zipField"
                                       id="postalCode" value={this.state.postalCode}
                                       onChange={this.handleChange} placeholder="Insert ZIP"/>
                            </div>
                            <div className="form-group col-md-2">
                                <label>Range</label>
                                <select required name="range" className="form-control" id="range"
                                        value={this.state.range} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>5 km</option>
                                    <option>10 km</option>
                                    <option>25 km</option>
                                    <option>50 km</option>
                                    <option>100 km</option>
                                    <option>200 km</option>
                                </select>
                            </div>
                            <div className="form-group col-md-2">
                                <div className="form-row row">
                                    <label>Submit Search</label>
                                </div>
                                <div className="form-row row">
                                    <button type="submit" className="btn btn-success submission">Submit</button>
                                </div>
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
