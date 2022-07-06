import React from "react";
import {Button, Navbar, Nav, Dropdown, DropdownButton} from 'react-bootstrap'
import './Navbar.css';
import logo from "./Logo_Transparent.png";

export default class NavbarComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        };
    }

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('userData'));
        // console.log(user);
        if (user != null) {
            this.state.loggedIn = true;
            this.setState({loggedIn: true});
        }
    }

    logout() {
        sessionStorage.setItem('userData', null);
        this.setState({loggedIn: false});
        window.location = "/login";
    }

    render() {
        return (
            <Navbar sticky="top" className="color-nav navbar-custom" expand="lg">
                <div className="col-4">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <Link to="/createJobOffer">About</Link> */}
                        {/* <Nav.Link as={Link} to="/createJobOffer" >Home</Nav.Link> */}
                        <Nav.Link href="/createJobOffer">
                            <Button className="navbarButton" size="lg">Insert New Job Offer</Button>
                        </Nav.Link>
                    </Navbar.Collapse>
                </div>

                <div className="col-4">
                    <a href={"/"}> <img src={logo} height={100} alt="Company Logo"/></a>
                </div>

                <div className="col-4">
                    <Navbar.Toggle aria-controls="basic-navbar-nav2"/>
                    <Navbar.Collapse id="basic-navbar-nav2" className="float-end">
                        <Nav.Link href="/messages">
                            <Button className="navbarButton" size="lg">Messages</Button>
                        </Nav.Link>
                        {this.state.loggedIn ? (
                            <DropdownButton title="Profile" id="basic-nav-dropdown" className="btn" size="lg">
                                {this.state.loggedIn && <Dropdown.Item
                                    href={"/user/profile/" + JSON.parse(sessionStorage.getItem('userData')).username}>My
                                    Profile</Dropdown.Item>}
                                <Dropdown.Item href="/myJobOffers">My Job Offers</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={() => this.logout()}>Logout</Dropdown.Item>
                                {/* {false && <Dropdown.Item href="#action/3.4">Login</Dropdown.Item>}     */}
                            </DropdownButton>
                        ) : (
                            <Nav.Link href="/login">
                                <Button className="navbarButton" size="lg">Login</Button>
                            </Nav.Link>
                        )}
                    </Navbar.Collapse>
                </div>
            </Navbar>
        );
    }
}