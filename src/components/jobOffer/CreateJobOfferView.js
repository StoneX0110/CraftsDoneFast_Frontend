import React, { Component } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
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
        };
        this.imageURLs = [];

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
        // this.state.imageURLs = "";
        delete this.state.imageURLs;
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

    resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
            uri => {
                resolve(uri);
            }, 'base64');
    });

    resi = async (file) => {
        await this.resizeFile(file);
    }

    onImageChange(e) {
        // this.setState({images: e.target.files});
        // console.log(e.target.files);
        // const resized = this.resizeFile(e.target.files[0]);
        // const resized1 = this.resi(e.target.files[0]);
        try {
            Resizer.imageFileResizer(
                e.target.files[0],
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => {
                    // console.log(uri);
                    // this.setState({ newImage: uri });
                    this.state.images.push(uri);
                    // console.log("img" + this.state.images);
                    this.imageURLs = this.state.images.map(imageSrc => <img className="border mb-3" key={imageSrc} src={imageSrc} />);
                    this.setState({ imageURLs: this.imageURLs });
                    console.log(this.imageURLs);
                    // console.log("finished");
                },
                "base64",
                100,
                100
            );
        } catch (err) {
            console.log(err);
        }
        // const resized1 = Resizer.imageFileResizer(e.target.files[0], 300, 300, 'JPEG', 100, 0, 'base64');
        // console.log(resized1);
        // this.state.images.push(e.target.files[0]);
        // this.state.images.push(resized1);
        // console.log("test");
        // console.log(this.state.images);
        /*
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
        */


    }



    render() {
        // const picture = {
        //     width: "10px",
        //     maxWidth: "30px",
        //     maxHeight: "30px",
        //     overflow: "hidden",
        //     textOverflow: "clip",
        //     whiteSpace: "nowrap",
        // };
        return (
            <div className="col-md-9">
                {/* <button className="btn btn-primary" onClick={() => this.handleClick()}>Click Test
                </button> */}
                <p className="h1">Insert a Job Offer</p>
                <form onSubmit={this.handleSubmit}>
                    <button type="submit" className="btn btn-success">Confirm Job Offer</button>

                    <div className="form-group">
                        <label>Title</label>
                        <input required type="text" name="title" className="form-control" id="exampleFormControlInput1" value={this.state.title} onChange={this.handleChange}
                            placeholder="Insert Title..." />
                    </div>
                    <div className="form-row row">
                        <div className="form-group col-md-4">
                            <label>Category</label>
                            <select required name="category" className="form-control" id="exampleFormControlSelect1" value={this.state.category} onChange={this.handleChange}>
                                <option defaultValue disabled value="">Choose...</option>
                                <option>Electrics</option>
                                <option>Gardening</option>
                                <option>Painting</option>
                                <option>Plumbing</option>
                                <option>Woodworking</option>
                                <option>Other</option>
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
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" className="form-control" id="exampleFormControlTextarea1" rows="5" value={this.state.description}
                            onChange={this.handleChange}></textarea>
                    </div>
                    <div  className="from-group col-md-3">
                        <input className="form-control" type="file" multiple accept="image/*" onChange={this.onImageChange} />
                        <div>
                            {this.state.imageURLs}
                        </div>
                    </div>
                </form>
            </div >
        );
    }
}