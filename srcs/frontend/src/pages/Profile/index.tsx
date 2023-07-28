import './style.css'
import {useEffect, useState } from 'react';
import pong from '../../img/pong.png';
import Achievements from '../Home/components/Achievements';
import MatchHistory from '../Home/components/MatchHistory/index';
import FriendsSection from '../Home/components/FriendsSection/index';
import { useParams } from 'react-router-dom';
import axios from 'axios';


type User = {
  avatar: string;
  userName: string;
  intraId: string;
  intraName: string;
  isLogged: boolean;
  score: number;
  rank: number;
  totalLoose: number;
  totalWin: number;
  inGame:boolean;
};


export default function Profile() {
  
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/friends/allUsers', {withCredentials:true});
        
        response.data.forEach((user: any) => {
          if(user.intraName === id) {
            let profileUser: User = {
              avatar: user.avatar,
              userName: user.userName,
              intraId: user.intraId,
              intraName: user.intraName,
              isLogged: user.isLogged,
              score: user.score,
              rank: user.rank,
              totalLoose: user.totalLoose,
              totalWin: user.totalWin,
              inGame: user.inGame,
            }
            setUser(profileUser)
            setLoading(false);
          }
        })
  
      } catch (error) {
        localStorage.clear()
        window.location.href= '/login'
      }
    };

    fetchData();
  }, [user?.intraId]);


  return (
    <div>
    {!loading && (
      <div className="PageProfile">
        <div id="item-0" className="ProfileSection item">&nbsp;
          <div className="ProfileInfo">
          <div className="imageClass">
              <img src={user?.avatar} id="Avatar" alt="User Avatar"/>
            </div>
            <h4 className="UserName">{user!.userName}</h4>
            <div className="ProfileStatusInfo">
              <i className="bi bi-circle-fill fs-5"  id={user!.isLogged ? "indicatorOnline" : "indicatorOffline"}></i>
              {!user?.inGame && user?.isLogged && (
                <h4 className="UserStatus">Online</h4> 
              )}
              {user?.inGame && user.isLogged && (
                <h4 className="UserStatus">In Game</h4> 
              )}
              {!user!.isLogged && (
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

            <h4 className="UserScore">{user!.score}</h4>
          </div>
            {/* <div className="ProfileRankInfoLine">
              <i className="bi bi-chevron-double-up fs-2"></i>
              <h4 className="UserRank">RANK - {user!.rank}</h4> 
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
              <h4>{user!.totalWin}</h4>
            </div>
            <div id="MatchStatsLoss">&nbsp;
              <h4>LOSS</h4>
              <i className="bi bi-x-lg fs-4"></i>
              <h4>{user!.totalLoose}</h4>
            </div>
          </div>
        </div>
        <div id="item-1" className="FriendSection item">
          <div className="Friend-UsersSection">
            <div className="title-box">
              <div className="ProfileComponentTitle">FRIENDS</div>
            </div>
            <FriendsSection id={user!.intraId} />
          </div>
        </div>
          <div id="item-2" className="LeaderBoard item">
            <div className="LeaderBoard-MatchHistorySection">
              <div className="title-box">
                <div className="ProfileComponentTitle">MATCH HISTORY</div>
              </div>
              <MatchHistory id={user!.intraId}/>
            </div>
          </div>
        <div id="item-3" className="Achievement item">
          <Achievements intraid={user!.intraId}/>
        </div>
      </div>
      )
    }
      </div>
  )
  
};
