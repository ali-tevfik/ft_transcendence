import React, { useContext, useState, useRef, useEffect }  from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import Intra from '../../../img/ft.png';
import { UserContext } from '../../../contexts'
import { Request } from '../FriendRequest/FriendRequest';
import './styles.css'
import axios from 'axios';


const Styles = styled.div`
  a, .navbar-nav, .navbar-light .nav-link {
  z-index: 2;
  color: rgb(178,225,255);
  // &:hover { color: white; }
  }
  
  .navbar-brand {
    color: rgb(178,225,255);
    &:hover { color: white; }
  }
  `;


function NavigationBar () {

  const { user } = useContext(UserContext);
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

  const [friendRequest, setFriendRequest] = useState<boolean | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/friends/getFriendQuery/${user.intraId}`, {withCredentials:true});
        setFriendRequest(response.data.length == 0 ?  false :true)
      } catch (error) {
        localStorage.clear()
			window.location.href= '/login'
      }
    };

    fetchData();
  }, []);




return (
  <Styles>
    <Navbar>
	    <Navbar.Brand href="/home">
        <img src={Intra} alt="Ft-icon" className='Pongicon'/>
        <text className='brand'>PONG</text>
      </Navbar.Brand>
      {/* <Form className="form-center">
        <FormControl type="text" placeholder="Search" className="" />
      </Form> */}
      <Nav className="ms-auto">
		  <Nav.Item>
        <div className="friend-drop-down-container" ref={dropdownRef}>
		  	  <i className="bi bi-people-fill fs-3 me-2 friendsRequestButton" onClick={(e) => handleDropDownFocus(open)}>
            {friendRequest  ? ( 
            <span className="position-absolute top-0 start-90 translate-middle p-1 bg-light border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
            ): (<></>)} 
          </i>
          {open && (
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
            <img src={user.avatar} className='avatar' alt='Avatar'/>
          </Nav.Link></Nav.Item>  
        </Nav>
    </Navbar>
  </Styles>
);
  }

export default NavigationBar;