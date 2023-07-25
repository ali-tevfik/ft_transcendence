import React, { useContext, useState, useRef }  from 'react';
import { Nav, Navbar, Form, FormControl,  } from 'react-bootstrap';
import styled from 'styled-components';
import Intra from '../../img/ft.png';
import Avatar from '../../img/default.png';
import { UserContext } from '../../contexts'
import { Friends } from '../Friends';
import { Request } from './FriendRequest/FriendRequest';
import './styles.css'


const Styles = styled.div`
  a, .navbar-nav, .navbar-light .nav-link {
  z-index: 2;
  color: rgb(178,225,255);
  // &:hover { color: white; }
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

  `;


function NavigationBar () {

  const { user, setUser } = useContext(UserContext);
  const[open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleDropDownFocus = (state: boolean) => {
    setOpen(!state);
  };
  const handleClickOutsideDropdown =(e:any)=>{
    if(open && !dropdownRef.current?.contains(e.target as Node)){
      setOpen(false)
      
    }
  }
  window.addEventListener("click",handleClickOutsideDropdown)

  

return (
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
		  <Nav.Item>
        <div className="friend-drop-down-container" ref={dropdownRef}>
		  	  <i className="bi bi-people-fill fs-3 me-2" onClick={(e) => handleDropDownFocus(open)}></i>
          {open && (
            // <ul>
            //   <li>Item 1</li>
            //   <li>Item 2</li>
            //   <li>Item 3</li>
            //   <li>Item 4</li>
            // </ul>
            <ul>
              <li>
                <Request/>
              </li>
            </ul>
          )}
        </div>
          </Nav.Item> 
          <Nav.Item><Nav.Link href="/home">
            <text className='userName'>{user.userName}</text>
            <img src={user.avatar} className='avatar'/>
          </Nav.Link></Nav.Item>  
        </Nav>
    </Navbar>
  </Styles>
);
  }

export default NavigationBar;