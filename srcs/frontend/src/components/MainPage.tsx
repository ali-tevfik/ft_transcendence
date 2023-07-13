import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import Navbar from './Nav/NavBar';
import SideBar from './Nav/sidebar';
import Home from './Home'
import Game from './Profile'
import {Routes, Route, NavLink } from 'react-router-dom'


    const authToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];


  type Data = {
    avatar: string,
    username: string,
    intraID: string
  };
  
  const HomePage: React.FC = () => {
    const [data, setData] = useState<Data>({
      avatar : '',
      username : '',
      intraID : ''
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await axios.get(`http://localhost:3001/user/${authToken}`)
        setData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <React.Fragment>
        <section>
          <div className='NavContent'>
              <Navbar/>
          </div>
        </section>
        <section>
          <div className='FullPage'>
            <div className='SideContent'>
                <SideBar/>
            </div>
            <div className='MainContent'>
            <Routes>
              <Route path='/' element={<Home/>} /> 
              <Route path='/game' element={<Game/>} />
            </Routes>
              {/* <Home/> */}
            </div>
          </div>
       </section>
      </React.Fragment>
    )
};
export default HomePage;