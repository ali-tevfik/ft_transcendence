import React, { ReactNode } from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';


function Sidebar() {
	return (
		<div className="d-flex flex-column p-2">
		<a href="/home" className="d-flex mb-5">
		  <i className="bi bi-house-door fs-2 me-2"></i>
		</a>
		<ul className="nav flex-column">
		  <li className="nav-item">
			<a href="/game" className="nav-link mb-5 mt-1">
			  <i className="bi bi-controller fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/chat" className="nav-link mb-5">
			  <i className="bi bi-wechat fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/home" className="nav-link mb-5">
			  <i className="bi bi-person fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/settings" className="nav-link mb-5">
			  <i className="bi bi-gear fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a href="/login" className="nav-link logout">
			  <i className="bi bi-door-open fs-2"></i>
			</a>
		  </li>
		</ul>
	  </div>

	  );  
}

export default Sidebar
