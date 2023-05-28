import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const NavigationBar = () => {
    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <p className="logo">
                        {/* <img src="" alt="Shoppy logo" className="logo" /> */}
                        Shoppy
                    </p>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/products">All</Nav.Link>
                        <Nav.Link as={Link} to="/products/featured">Featured</Nav.Link>
                        <Nav.Link as={Link} to="/products/women">Women</Nav.Link>
                        <Nav.Link as={Link} to="/products/men">Men</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar
