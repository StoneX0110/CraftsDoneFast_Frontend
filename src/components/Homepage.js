import React, {Component} from 'react';
import JobOfferOverviewComponent from "./jobOffer/JobOfferOverviewComponent";
import UserOverviewComponent from "./user/UserOverviewComponent";
import Category from "./Categories"
import axios from "axios";
import './Homepage.css'
import {DropdownButton} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

export default class Homepage extends Component {

    constructor(props) {
        super(props);
        this.results = [];
        this.renderedResults = "";
        this.renderedResultsBoost = "";
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
        this.handleSort = this.handleSort.bind(this);
        this.getAverageCustomerRatings = this.getAverageCustomerRatings.bind(this);
        this.categorySelection = this.categorySelection.bind(this);
        this.getBoostedItems = this.getBoostedItems.bind(this);
    }

    componentDidMount() {
        axios.get('/api/jobOffer/recentJobOffers').then(res => {
            const __ret = this.getAverageCustomerRatings(res);
            var averageCustomerRatings = __ret.averageCustomerRatings;
            const requests = __ret.requests;
            return Promise.all(requests).then(() => {
                var rR = [];
                this.results.map((e, index) => {
                    return rR.push(<JobOfferOverviewComponent key={e._id + index} job={e} rating={averageCustomerRatings.find(crating => crating.author === e.author).rating}/>);
                })
                var rRB = this.getBoostedItems(rR);
                this.renderedResultsBoost = rRB;
                this.renderedResults = rR;
                this.forceUpdate();
            })
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
            axios.get(inRange ? '/api/jobOffer/matchingJobOffersInRange' : '/api/jobOffer/matchingJobOffers', {
                params: {
                    zips: this.state.zips_in_range,
                    category: this.state.category
                }
            }).then(res => {
                const __ret = this.getAverageCustomerRatings(res);
                var averageCustomerRatings = __ret.averageCustomerRatings;
                const requests = __ret.requests;
                return Promise.all(requests).then(() => {
                    var rR = [];
                    this.results.map((e, index) => {
                        var cityAndDist = inRange
                            ? this.state.zips_with_distance.find(elem => parseInt(elem.zip_code) === e.postalCode)
                            : {city: undefined, distance: undefined};
                        return rR.push(<JobOfferOverviewComponent key={e._id + index} job={e}
                                                                  city={cityAndDist.city}
                                                                  dist={cityAndDist.distance}
                                                                  rating={averageCustomerRatings.find(crating => crating.author === e.author).rating}/>)
                    })
                    var rRB = this.getBoostedItems(rR);
                    this.renderedResultsBoost = rRB;
                    this.renderedResults = rR;
                    this.forceUpdate();
                })
            })
        } else {
            axios.get(inRange ? '/api/user/matchingProfilesInRange' : '/api/user/matchingProfiles', {
                params: {
                    zips: this.state.zips_in_range,
                    category: this.state.category
                }
            }).then(res => {
                this.results = res.data;
                var rR = this.results.map((user, index) => {
                    var cityAndDist = inRange
                        ? this.state.zips_with_distance.find(elem => parseInt(elem.zip_code) === user.settings.postalCode)
                        : {city: undefined, distance: undefined};
                    return <UserOverviewComponent key={user._id + index} user={user} city={cityAndDist.city} dist={cityAndDist.distance}
                                                  rating={user.averageCraftsmanRating}/>
                });
                var rRB = this.getBoostedItems(rR);
                this.renderedResultsBoost = rRB;
                this.renderedResults = rR;
                this.forceUpdate();

            })
        }
    }

    getAverageCustomerRatings(res) {
        this.results = res.data;
        var averageCustomerRatings = [];

        const requests = this.results.map(async (e) => {
            return await axios.get('/api/user/getAverageCustomerRating', {params: {id: e.author}}).then(res => {
                averageCustomerRatings.push({rating: res.data.averageCustomerRating, author: e.author});
            })
        });
        return {averageCustomerRatings, requests};
    }

    handleSort = (type) => {
        if (type === "distance" && (this.state.postalCode === "" || this.state.range === "" || this.state.range === "Any"))
            return; // sort by distance not possible if no postalCode and range is specified

        switch (type) {
            case "insertionDate":
                if (this.state.searchCraftsmen)
                    return; // search by date not possible for craftsmen
                this.renderedResults = this.renderedResults.sort((a, b) => {
                    return b.props.job.insertionDate.localeCompare(a.props.job.insertionDate);
                });
                break;
            case "distance":
                this.renderedResults = this.renderedResults.sort((a, b) => {
                    return a.props.dist > b.props.dist ? 1 : -1;
                })
                break;
            case "rating":
                this.renderedResults = this.renderedResults.sort((a, b) => {
                    return a.props.rating > b.props.rating ? -1 : 1;
                })
                break;
        }
        this.forceUpdate();
    }

    categorySelection(event) {
        if (event.target.value !== undefined) {
            this.state.category = event.target.value;
            const inRange = this.state.postalCode !== "" && this.state.range !== "" && this.state.range !== "Any";
            this.createResults(inRange);
        }
    }

    getBoostedItems(rR) {
        var rRB = [];
        if (this.state.searchJobs) {
            for (let i = 0; i < rR.length && i < 3; i++) {
                if (rR[i].props.job.boost) {
                    rRB.push(rR.shift());
                }
            }
        }
        if (this.state.searchCraftsmen) {
            for (let i = 0; i < rR.length && i < 3; i++) {
                if (rR[i].props.user.boost) {
                    rRB.push(rR.shift());
                }
            }
        }
        return rRB;
    }

    render() {
        return (
            <div>
                <div className="search-wrapper border border-4 col rounded " style={{marginTop: "10px"}}>
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
                                <input name="postalCode" type="number" className="form-control"
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
                                <button type="submit" className="btn btn-success submission submitButton">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row" style={{width: "70%", margin: "0 auto"}}>
                    <div className="col-auto category-wrapper border border-4 rounded" style={{marginBottom: "16px"}}>
                        <h3>Categories</h3>
                        <div style={{marginTop: "15px"}}>
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
                            <form onClick={this.categorySelection} style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                <div className="form-check">
                                    <label>
                                        <input className="form-check-input" type="radio" name="categorySelection" value="Any"/>
                                        Any
                                    </label>
                                </div>
                                {Category.returnRadioButtons()}
                            </form>
                        </div>
                    </div>
                    <div className="col">
                        <div className=" text-start" id="sortDropdown">
                            <h3 className="col" style={{color: "rgb(41, 118, 74)"}}>Results</h3>
                            <div className="col">
                                <DropdownButton title="Sort by" className="float-end" id="sortButton">
                                    <DropdownItem onClick={() => this.handleSort("insertionDate")}>Date</DropdownItem>
                                    <DropdownItem onClick={() => this.handleSort("distance")}>Distance</DropdownItem>
                                    <DropdownItem onClick={() => this.handleSort("rating")}>Rating</DropdownItem>
                                </DropdownButton>
                            </div>
                        </div>
                        <div>
                            {this.renderedResultsBoost}
                        </div>
                        <div>
                            {this.renderedResults}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
