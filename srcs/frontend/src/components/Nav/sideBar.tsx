import 'bootstrap-icons/font/bootstrap-icons.css';
import './sideBar.css';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';


function SideBar() {
	
	const { clearUser } = useUser();



	async function logout() {
		    // Diğer çıkış işlemleri...
		
			try{
			const response = await axios.get('http://localhost:3001/auth/logout')
			clearUser()
			localStorage.removeItem('user');
		}
		catch(error){
			console.error(error)
		}
	}
	return (
	<div className="sideBarContainer">
	  <div className="d-flex flex-column p-2">
		<ul className="nav flex-column">
		  <li className="nav-item">
			<a href="/home" className="d-flex mb-5">
		  <i className="bi bi-house-door fs-2 me-2"></i>
			</a>
		  </li>
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
		  {/* <li className="nav-item">
			<a href="/home" className="nav-link mb-5">
			  <i className="bi bi-person fs-2"></i>
			</a>
		  </li> */}
		  <li className="nav-item">
			<a href="/settings" className="nav-link mb-5">
			  <i className="bi bi-gear fs-2"></i>
			</a>
		  </li>
		  <li className="nav-item">
			<a onClick={logout} className="nav-link logout">
			  <i className="bi bi-door-open fs-2"></i>
			</a>
		  </li>
		</ul>
	   </div>
	</div>
	  );  
}

export default SideBar
