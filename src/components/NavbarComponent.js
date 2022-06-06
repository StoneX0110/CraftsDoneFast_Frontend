import React from "react";
import { Button, Navbar, Nav, Dropdown, DropdownButton } from 'react-bootstrap'
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
        const user = JSON.parse(localStorage.getItem('userData'));
        // console.log(user);
        if (user != null) {
            this.state.loggedIn = true;
            this.setState({loggedIn: true});
        }
    }

    logout() {
        localStorage.setItem('userData', null);
        this.setState({loggedIn: false});
        window.location = "/login";
    }

    render() {
        return (
            <Navbar sticky="top" className="color-nav navbar-custom" expand="lg">
                <div className="position-fixed ">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <Link to="/createJobOffer">About</Link> */}
                        {/* <Nav.Link as={Link} to="/createJobOffer" >Home</Nav.Link> */}
                        <Nav.Link href="/createJobOffer">
                            <Button className="btn btn-primary" size="lg">Insert New Job Offer</Button>
                        </Nav.Link>
                    </Navbar.Collapse>
                </div>

                <div className="position-fixed start-50 translate-middle-x">
                    <Navbar.Brand href="/"><img src={logo} height={100} alt="Company Logo" /> </Navbar.Brand>
                </div>

                <div className="position-fixed end-0">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav.Link href="#link">
                            <Button className="btn btn-primary" size="lg">Messages</Button>
                        </Nav.Link>
                        {this.state.loggedIn ? (
                        <DropdownButton title="Profile" id="basic-nav-dropdown" className="btn" size="lg">
                            {this.state.loggedIn && <Dropdown.Item href="#action/3.1">My Profile</Dropdown.Item>}
                            <Dropdown.Item href="/myJobOffer">My Job Offers</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => this.logout()}>Logout</Dropdown.Item>
                            {/* {false && <Dropdown.Item href="#action/3.4">Login</Dropdown.Item>}     */}
                        </DropdownButton>
                        ) : (
                        <Nav.Link href="/login">
                            <Button className="btn btn-primary" size="lg">Login</Button>
                        </Nav.Link>
                        )}
                    </Navbar.Collapse>
                </div>
            </Navbar>
        );
    }
}