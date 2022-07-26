import React, {Component} from "react";
import './About.css'

/**
 * Code adapted from https://www.w3schools.com/howto/howto_css_about_page.asp
 */
export default class AboutUs extends Component {

    render() {
        return (
            <div>
                <div className="about-section">
                        <h2>About Us</h2>
                    <div className="text-start" style={{width: "40%", margin: "0 auto"}}>
                        <p>CraftsDoneFast has the vision to enable citizens to find craftsmen without requiring a time
                            intensive search. Available craftsman are easy to find based on your location and category of work.
                            The platform provides you with ways to transparently compare prices across different
                            craftsmen.
                            Thus, in the future, you won't have to face any problems waiting in phone queues, scrolling
                            through phone books or using various websites.</p>
                        <p>You can pay craftsmen directly through our platform with us acting as a trusted third party
                            handling the money side of business.
                            Additionally, the more often you use this platform, the more ratings you will get from your
                            respective partners.
                            This means if any issues come up, we offer buyer protection and in special cases you can get
                            into direct contact with us.
                            We want to guarantee an easy, comfortable and secure way to get your handicraft work
                            done.</p>
                    </div>
                </div>
                <h2 style={{marginTop: "10px"}}>Our Team</h2>
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <img className="img" src="Daniel.jpg" alt="Jane"/>
                            <div className="container">
                                <h2>Daniel Testor</h2>
                                <p className="title">Founder and Developer</p>
                                <p>TUM Information Systems Master student. Likes the creation and development of new
                                    visions.</p>
                                <p>daniel.testor@tum.de</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <img className="img" src="Patrick.jpg" alt="Jane"/>
                            <div className="container">
                                <h2>Patrick Litschel</h2>
                                <p className="title">Founder and Developer</p>
                                <p>TUM Information Systems Master student. Likes cats.</p>
                                <br/>
                                <p>patrick.litschel@tum.de</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <img className="img" src="Jannis.jpg" alt="Jane"/>
                            <div className="container">
                                <h2>Jannis Bittlmayer</h2>
                                <p className="title">Founder and Developer</p>
                                <p>TUM Information Systems Master student. !Likes fixing bugs.</p>
                                <p>j.bittlmayer@tum.de</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <img className="img" src="Florian.png" alt="Jane"/>
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

