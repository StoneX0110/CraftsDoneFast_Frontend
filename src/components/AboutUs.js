import React, { Component } from "react";
import './About.css'

/**
 * Code adapted from https://www.w3schools.com/howto/howto_css_about_page.asp
 */
export default class AboutUs extends Component {

    render() {
        return (
            <div>
                <div class="about-section">
                    <h1>About Us Page</h1>
                    <p>We as CraftsDoneFast team had the vision to enable citiziens to find craftsman without requiring a time intensive search. 
                        By the way, the available craftsman are easy to find, based on your location and requirements and the platform provides you with
                        way to transparently compare prices between craftsman. In the future, you therfore won't have to face any problems in waiting phone queues,
                        scrolling to phone dictonaries or using various websites.</p>
                        <p>The more often you use this platform, the more ratings you will get from your respective
                        partner and therefore you chances for a job acqusisition will rise. You can directly pay the craftman within the platform and together with Our
                        transparency strategy we also enable a trustworthiness strategy. This means, if there are any issues you will have together with the rating impression, 
                        a buyer protection and in special cases you can also contact us. We want to guarantee an easy, comfortable and especially secure way to get your handicraft work done.</p>
                </div>

                <h2>Our Team</h2>
                <div className="row">
                    <div className="column">
                        <div className="card">
                        <img className="img" src="Daniel.jpg" alt="Jane" />
                            <div className="container">
                                <h2>Daniel Testor</h2>
                                <p className="title">Founder and Developer</p>
                                <p>TUM Information Systems Master student. Likes the creation and development of new vision.</p>
                                <p>daniel.testor@tum.de</p>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="card">
                        <img className="img" src="defaultAvatar.png" alt="Jane" />
                            <div className="container">
                                <h2>Patrick</h2>
                                <p className="title">Founder and Developer</p>
                                <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                                <p>jane@example.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="card">
                        <img className="img" src="defaultAvatar.png" alt="Jane" />
                            <div className="container">
                                <h2>Jannis</h2>
                                <p className="title">Founder and Developer</p>
                                <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                                <p>jane@example.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="card">
                        <img className="img" src="Florian.png" alt="Jane" />
                            <div className="container">
                                <h2>Florian Stang</h2>
                                <p className="title">Founder and Developer</p>
                                <p>TUM Information Systems Master student. Interested in Cloud Technology</p>
                                <p>florian.stang@tum.de</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

