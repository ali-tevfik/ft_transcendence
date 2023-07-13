import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
// import Intra from './ft.png';
import Avatar from '../../img/default.png';
import Intra from '../../img/ft.png';
// import Avatar from '../../img/ft.png'

const Styles = styled.div`
  .navbar { background-color: rgb(88, 110, 124); }
  a, .navbar-nav, .navbar-light .nav-link {
	z-index: 2;
    color: rgb(178,225,255);
    &:hover { color: white; }
  }
  .icon{
	width: 40px;
	border-radius: 50%;
	margin-left: 20px;
}	
  .brand{
	font-size: x-large;
	margin-left: 8px;
	margin-top: 1px;
  }
  .navbar-brand {
    font-size: 1.4em;
    color: rgb(178,225,255);
    &:hover { color: white; }
  }
  .form-center {
    position: absolute !important;
    left: 20%;
    right: 20%;
  }
  .avatar{
	width: 35px;
	border-radius: 50%;
	margin-right: 15px; 
	margin-left: 15px; 
}
`;
const NavigationBar = () => (
  <Styles>
    <Navbar>
	    <Navbar.Brand href="/home">
        <img src={Intra} alt="Ft-icon" className='icon'/>
        <text className='brand'>PONG</text>
      </Navbar.Brand>
      {/* <Form className="form-center">
        <FormControl type="text" placeholder="Search" className="" />
      </Form> */}
        <Nav className="ms-auto">
          <Nav.Item><Nav.Link href="/home"><text className='userName'>user.name</text><img src={Avatar} className='avatar' /></Nav.Link></Nav.Item> 
        </Nav>
    </Navbar>
  </Styles>
)

export default NavigationBar;