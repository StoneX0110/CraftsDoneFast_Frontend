import React from "react";
import {Button, Navbar, Nav, Dropdown, DropdownButton} from 'react-bootstrap'
import './Navbar.css';
import logo from "./Logo_Transparent.png";

export default class NavbarComponent extends React.Component {
    render() {
        return (
            <Navbar sticky="top" className="color-nav navbar-custom" expand="lg">
                <div class="position-fixed ">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <Link to="/createJobOffer">About</Link> */}
                        {/* <Nav.Link as={Link} to="/createJobOffer" >Home</Nav.Link> */}
                        <Nav.Link href="/createJobOffer">
                            <Button class="btn btn-primary" size="lg">Insert New Job Offer</Button>
                        </Nav.Link>
                    </Navbar.Collapse>
                </div>

                <div class="position-fixed start-50 translate-middle-x">
                    <Navbar.Brand href="/"><img src={logo} height={100} alt="Company Logo"/> </Navbar.Brand>
                </div>

                <div class="position-fixed end-0">
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav.Link href="#link">
                            <Button class="btn btn-primary" size="lg">Messages</Button>
                        </Nav.Link>
                        <DropdownButton title="Profile" id="basic-nav-dropdown" class="btn btn-primary" size="lg">
                            <Dropdown.Item href="#action/3.1">My Profile</Dropdown.Item>
                            <Dropdown.Item href="/myJobOffer">My Job Offers</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item href="#action/3.4">Logout</Dropdown.Item>
                        </DropdownButton>
                        <Nav.Link href="/login">
                            <Button class="btn btn-primary" size="lg">Login</Button>
                        </Nav.Link>
                    </Navbar.Collapse>
                </div>
            </Navbar>
        );
    }
}