import 'bootstrap-icons/font/bootstrap-icons.css';
import './sideBar.css';


function SideBar() {
	return (
		<div className="d-flex flex-column p-2">
		<a href="/home" className="d-flex mb-5">
		  <i className="bi bi-house-door fs-2 me-2"></i>
		</a>
		<ul className="nav flex-column">
		  <li className="nav-item">
			<a href="/lobby" className="nav-link mb-5 mt-1">
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
			<a href='http://localhost:3001/auth/logout' className="nav-link logout">
			  <i className="bi bi-door-open fs-2"></i>
			</a>
		  </li>
		</ul>
	  </div>

	  );  
}

export default SideBar