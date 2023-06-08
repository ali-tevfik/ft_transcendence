import { useState } from 'react';
import './App.css';
import HomePage2 from './compunent/HomePage2';
import Login  from './compunent/Login';
import {Routes, Route, NavLink } from 'react-router-dom'
import Nav from './compunent/Nav/nav';

function App() {
  const [data, setData] = useState(''); 
  return (
    <>
    <Nav/>
    <Routes>
      <Route path='/' element={<HomePage2/>} />
      <Route path='/login' element={<Login/>} />
   </Routes>
   </>
  ); 
  
}

export default App;
