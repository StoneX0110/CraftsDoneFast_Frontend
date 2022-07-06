import React, {Component} from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import './JobOffer.css'
import ImageComponent from "./ImageComponent";
import Category from "../Categories";

export default class InsertJobOfferView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category: "",
            postalCode: "",
            priceExpectation: "",
            description: "",
            images: [],
        };
        this.imageURLs = [];

        this.handleChange = this.handleChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();
        delete this.state.imageURLs;
        axios.post('/api/jobOffer/insert', this.state)
            .then(res => {
                const id = res.data;
                console.log(res.data);
                window.location = "/jobOffer/" + id;
            })
    }

    onImageChange(e) {
        try {
            Resizer.imageFileResizer(
                e.target.files[0],
                300,
                300,
                "JPEG",
                70,
                0,
                (uri) => {
                    this.state.images.push(uri);
                    this.imageURLs = this.state.images.map(imageSrc => <ImageComponent imageSrc={imageSrc} key={imageSrc} />);
                    // <span><div className="photo border border-1 mb-3"><img className="image" key={imageSrc} src={imageSrc} /></div></span>);
                    this.setState({imageURLs: this.imageURLs});
                },
                "base64",
                10,
                10
            );
        } catch (err) {
            console.log(err);
        }
    }


    render() {
        return (
            <div className="col-md-9 m-3">
                <p className="h1">Insert a Job Offer</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input required type="text" name="title" className="form-control" id="exampleFormControlInput1"
                               value={this.state.title} onChange={this.handleChange}
                               placeholder="Insert Title..."/>
                    </div>
                    <div className="form-row row">
                        <div className="form-group col-md-4">
                            <label>Category</label>
                            <select required name="category" className="form-control" id="exampleFormControlSelect1"
                                    value={this.state.category} onChange={this.handleChange}>
                                <option defaultValue disabled value="">Choose...</option>
                                {Category.returnSelection()}
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label>Postal Code</label>
                            <input required name="postalCode" type="text" className="form-control"
                                   id="exampleFormControlInput1" value={this.state.postalCode}
                                   onChange={this.handleChange} placeholder="Insert Postal Code"/>
                        </div>
                        <div className="form-group col-md-4">
                            <label>Price expectation* (in USD)</label>
                            <input name="priceExpectation" type="text" className="form-control"
                                   id="exampleFormControlInput1" value={this.state.priceExpectation}
                                   onChange={this.handleChange} placeholder="Price expectation"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea required name="description" className="form-control" id="exampleFormControlTextarea1"
                                  rows="5" value={this.state.description}
                                  onChange={this.handleChange}></textarea>
                    </div>
                    <div className="form-row row">
                        <div className="form-group col-md-4">
                            <label>Insert Pictures*</label>
                            <input className="form-control" type="file" multiple accept="image/*"
                                   onChange={this.onImageChange}/>
                            <div className="form-group col-md-3">
                                {this.state.imageURLs}
                            </div>
                        </div>
                        <div className="from-group col-md-4"></div>
                        <div className="from-group col-md-4">
                            <button type="submit" className="btn btn-success float-end">Confirm Job Offer</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}