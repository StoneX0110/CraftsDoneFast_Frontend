import React, { Component } from "react";
import axios from "axios";
export default class CreateJobOfferView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category: "",
            postalCode: "",
            priceExpectation: "",
            description: "",
            images: [],
            imageURLs: [],
            displayImages: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
    }



    handleClick() {
        // add entity - POST
        // creates entity
        /*
         fetch("http://127.0.0.1:5000/api/jobOffer/test", {
             "method": "GET",
             headers: {
                         'Access-Control-Allow-Origin': '*',
                     }
         })
            
             .then(response => {
                 console.log(response)
             })
             .catch(err => {
                 console.log(err);
             });
             */
        axios({
            url:
                "/api/jobOffer/test",
            method: "GET",
            // headers: {
            //     'Access-Control-Allow-Origin': '*',
            // }
        })
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err);
            });
        // axios.get(`localhost:5000/api/jobOffer/test`)
        //     .then(res => {
        //         const resp = res.data;
        //         console.log(resp);
        //     })
    }

    handleChange(event) {
        const name = event.target.name;
        //console.log([name] + " - " + event.target.value);
        this.setState({ [name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        axios.post('/api/jobOffer/insert', this.state)
            .then(res => {
                // console.log(res);
                // console.log(res.data);
                // window.location = "/retrieve" //This line of code will redirect you once the submission is succeed
                const id = res.data;
                console.log(res.data);
                window.location = "/jobOffer/" + id;
            })
    }

    onImageChange(e) {
        // this.setState({images: e.target.files});
        // console.log(e.target.files);
        this.state.images.push(e.target.files[0]);
        // console.log(this.state.images);
        const newImageURLs = [];
        const image = "";
        Array.from(this.state.images).forEach(image => newImageURLs.push(URL.createObjectURL(image)));
        this.setState({ imageURLs: newImageURLs });
        this.state.imageURLs = newImageURLs;
        console.log("urls: " + this.state.imageURLs);
        this.state.imageURLs.map(imageSrc => <img src={imageSrc} />);
        this.setState({ imageURLs: this.state.imageURLs });
        console.log("img: " + this.state.imageURLs);
        this.state.imageURLs = this.state.imageURLs.map(imageSrc => <img key={imageSrc} src={imageSrc} />);
        this.setState({ imageURLs: this.state.imageURLs });
        console.log("display:" + this.state.imageURLs);
        this.forceUpdate();
    }



    render() {
        const picture = {
            width: "10px",
            maxWidth: "30px",
            maxHeight: "30px",
            overflow: "hidden",
            textOverflow: "clip",
            whiteSpace: "nowrap"
        };
        return (
            <div>
                <button className="btn btn-primary" onClick={() => this.handleClick()}>Click Test
                </button>
                <p className="h1">Insert a Job Offer</p>

                <form onSubmit={this.handleSubmit}>
                    <button type="submit" className="btn btn-primary">Confirm Job Offer</button>

                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" className="form-control" id="exampleFormControlInput1" value={this.state.title} onChange={this.handleChange}
                            placeholder="Insert Title..." />
                    </div>
                    <div className="form-row row">
                        <div className="form-group col-md-4">
                            <label>Category</label>
                            <select required name="category" className="form-control" id="exampleFormControlSelect1" value={this.state.category} onChange={this.handleChange}>
                                <option defaultValue disabled value="">Choose...</option>
                                <option>Electrican</option>
                                <option>Garden</option>
                                <option>Building House</option>
                                <option>Plumber</option>
                                <option>Woodworker</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label>Postal Code</label>
                            <input name="postalCode" type="text" className="form-control" id="exampleFormControlInput1" value={this.state.postalCode}
                                onChange={this.handleChange} placeholder="Insert Postal Code" />
                        </div>
                        <div className="form-group col-md-4">
                            <label>Price expectation*</label>
                            <input name="priceExpectation" type="text" className="form-control" id="exampleFormControlInput1" value={this.state.priceExpectation}
                                onChange={this.handleChange} placeholder="Price expectation" />
                        </div>
                    </div>
                    <input className="form-control" type="file" multiple accept="image/*" onChange={this.onImageChange} />
                    <div className="from-group col-md-3">
                        {this.state.imageURLs}
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" className="form-control" id="exampleFormControlTextarea1" rows="5" value={this.state.description}
                            onChange={this.handleChange}></textarea>
                    </div>
                </form>
            </div >
        );
    }
}