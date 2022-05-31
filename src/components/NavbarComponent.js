import React, { Component } from "react";
import { Button, Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class NavbarComponent extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Craftsman Done Fast</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">


                            {/* <Link to="/createJobOffer">About</Link> */}

                            {/* <Nav.Link as={Link} to="/createJobOffer" >Home</Nav.Link> */}
                            <Nav.Link href="/createJobOffer">Insert new Job Offer</Nav.Link>
                            <Nav.Link href="#link">My Messages</Nav.Link>
                            <NavDropdown title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">My Job Offers</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#link">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        );
    }
}