import './styles.css'
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../contexts'
import FriendsToggle from './components/UserToggle';
import LeaderMatchToggle from './components/LeadToggle';
import Achievements from './components/Achievements';
import pong from '../../img/pong.png';
import axios from 'axios';


export function Home() {

  const { user , setUser} = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await axios.get(`http://localhost:3001/user/${user?.intraId}`)
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (

    <div className="PageMain">
      <div id="item-0" className="ProfileSection item">&nbsp;
        <div className="ProfileInfo">
         <div className="imageClass">
            <img src={user.avatar} id="Avatar" alt="User Avatar"/>
          </div>
          <h4 className="UserName">{user.userName}</h4>
          <div className="ProfileStatusInfo">
            <i className="bi bi-circle-fill fs-5"  id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
            {user.isLogged && (
              <h4 className="UserStatus">Online</h4> 
             )} 
            {!user.isLogged && (
              <h4 className="UserStatus">Offline</h4> 
            )}
          </div>
        </div>
        <div className="ProfileRankInfo">
          <div className="ProfileRankInfoLine">
            <h4 className="UserScore">SCORE</h4>
          </div>
          <div className="ProfileRankInfoLine">
          <i className="bi bi-star fs-2"></i>

            <h4 className="UserScore">{user.score}</h4>
          </div>
          {/* <div className="ProfileRankInfoLine">
            <i className="bi bi-chevron-double-up fs-2"></i>
            <h4 className="UserRank">RANK - {user.rank}</h4>
          </div> */}
        </div>
        <div className="ProfileMatchStats">
          <div id="MatchStatsTitle">&nbsp;
            <img src={pong} className='pongIcon'  alt='pong icon'/>
            <h4>MATCH STATS</h4>
            <img src={pong} className='pongIcon reverse' alt='pong icon'/>
          </div>
          <div id="MatchStatsWin">&nbsp;
            <h4>WIN</h4>
            <i className="bi bi-trophy fs-4"></i>
            <h4>{user.totalWin}</h4>
          </div>
          <div id="MatchStatsLoss">&nbsp;
            <h4>LOSS</h4>
            <i className="bi bi-x-lg fs-4"></i>
            <h4>{user.totalLoose}</h4>
          </div>
        </div>
      </div>
      <div id="item-1" className="FriendSection item">
        <FriendsToggle />
      </div>
      <div id="item-2" className="LeaderBoard item">
        <LeaderMatchToggle/>
      </div>
      <div id="item-3" className="Achievement item">
        <Achievements intraid={user.intraId}/>
      </div>
    </div>
  )
};
