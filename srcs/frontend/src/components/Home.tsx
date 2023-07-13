import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './Home.css';
    const authToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];


  type Data = {
    avatar: string,
    username: string,
    intraID: string
  };
  
  const Home: React.FC = () => {
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
    <div className='PageMain'>
        <div className="ProfileInfo container">
        <img src={data.avatar} style={{margin:50,width:200, height:170, borderRadius:20}} alt="" />
        <h1> {data.username}</h1>
        <h1> {data.intraID}</h1>
        </div>
        <div className="MyRank container">MyRank</div>
        <div className="Chat container">Chat</div>
        <div className="AllRanks container">Allranks</div>
        <div className="FriendSection container">Friend
            <div className="friend">Test</div>
            <div className="friend">Test</div>
            <div className="friend">Test</div>
        </div>
    </div>
    )
};
export default Home;