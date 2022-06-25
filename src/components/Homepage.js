import React, {Component} from 'react';
import JobOfferOverviewComponent from "./jobOffer/JobOfferOverviewComponent";
import UserOverviewComponent from "./user/UserOverviewComponent";
import Category from "./Categories"
import axios from "axios";
import './Homepage.css'

export default class Homepage extends Component {

    constructor(props) {
        super(props);
        this.jobs = [];
        this.renderResults = "";
        this.state = {
            searchJobs: true,
            searchCraftsmen: false,
            category: "",
            postalCode: "",
            range: "",
            zips_in_range: [],
            zips_with_distance: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createResults = this.createResults.bind(this);
    }

    componentDidMount() {
        console.log("Fetching 10 most recent job offers...");
        axios.get('/api/jobOffer/recentJobOffers').then(res => {
            this.jobs = res.data;
            let jobComponents = this.jobs.map((e) => <JobOfferOverviewComponent key={e._id} job={e}/>);
            this.renderResults = <div><h4>Recent Jobs:</h4>{jobComponents}</div>;
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
        event.preventDefault();
        const dist = this.state.range.match(/\d+/);
        const inRange = this.state.postalCode !== "" && this.state.range !== "" && this.state.range !== "Any";
        // postal code and range entered
        if (inRange) {
            console.log("Fetching zip codes within range...")
            axios.get(`https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/ow5HhsCp3yPQIYqVA1IKEiGHjWLsF2TlFKhHkjdR3SIAO9QpNFwDYyVxXVoVlcIQ/radius.json/${this.state.postalCode}/${dist}/km`)
                .then(res => {
                    this.state.zips_with_distance = res.data.zip_codes;
                    this.state.zips_in_range = this.state.zips_with_distance.map((e) => {
                        return e.zip_code;
                    });
                    this.createResults(inRange);
                });
        }
        // no postal code or range
        else {
            this.createResults(inRange);
        }
    }

    createResults(inRange) {
        if (this.state.searchJobs) {
            console.log("Fetching matching job offers...");
            axios.get(inRange ? '/api/jobOffer/matchingJobOffersInRange' : '/api/jobOffer/matchingJobOffers', {
                params: {
                    zips: this.state.zips_in_range,
                    category: this.state.category
                }
            }).then(res => {
                this.jobs = res.data;
                let jobComponents = this.jobs.map((e) => {
                    var cityAndDist = inRange ?
                        this.state.zips_with_distance.find(elem => parseInt(elem.zip_code) === e.postalCode) : {
                            city: undefined,
                            distance: undefined
                        };
                    return <JobOfferOverviewComponent key={e._id} job={e} city={cityAndDist.city}
                                                      dist={cityAndDist.distance}/>
                });
                this.renderResults = <div><h4>Results:</h4>{jobComponents}</div>;
                this.forceUpdate();
            })
        } else {
            console.log("Fetching matching craftsmen profiles...");
            axios.get(inRange ? '/api/user/matchingProfilesInRange' : '/api/user/matchingProfiles', {
                params: {
                    zips: this.state.zips_in_range,
                    category: this.state.category
                }
            }).then(res => {
                this.jobs = res.data;
                let jobComponents = this.jobs.map((user) => {
                    var cityAndDist = inRange ?
                        this.state.zips_with_distance.find(elem => parseInt(elem.zip_code) === user.settings.postalCode) : {
                            city: undefined,
                            distance: undefined
                        };
                    return <UserOverviewComponent key={user._id} user={user} city={cityAndDist.city}
                                                  dist={cityAndDist.distance}/>
                });
                this.renderResults = <div><h4>Results:</h4>{jobComponents}</div>;
                this.forceUpdate();
            })
        }
    }

    /*
    TODO
    - implement sorting (by date (only jobs), rating)
     */

    render() {
        return (
            <div>
                <div className="search-wrapper border border-4 rounded">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row row container">
                            <div className="form-group col">
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
                            <div className="form-group col">
                                <label>Category</label>
                                <select required name="category" className="form-control" id="category"
                                        value={this.state.category} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>Any</option>
                                    {Category.returnSelection()}
                                </select>
                            </div>
                            <div className="form-group col">
                                <label>Postal Code</label>
                                <input name="postalCode" type="number" className="form-control zipField"
                                       id="postalCode" value={this.state.postalCode}
                                       onChange={this.handleChange} placeholder="Insert ZIP"/>
                            </div>
                            <div className="form-group col">
                                <label>Range</label>
                                <select name="range" className="form-control" id="range"
                                        value={this.state.range} onChange={this.handleChange}>
                                    <option defaultValue disabled value="">Choose...</option>
                                    <option>Any</option>
                                    <option>5 km</option>
                                    <option>10 km</option>
                                    <option>25 km</option>
                                    <option>50 km</option>
                                    <option>100 km</option>
                                    {/*
                                    Temporarily disabled due to database not returning results for too many zip codes (1000+ ?)
                                    <option>200 km</option>
                                    */}
                                </select>
                            </div>
                            <div className="form-group col">
                                <div className="form-row row">
                                    <label>Submit Search</label>
                                </div>
                                <button type="submit" className="btn btn-success submission submitButton">Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <br/>
                {this.renderResults}
            </div>
        );
    }
}
