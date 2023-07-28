import './styles.css'
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  id: string;
};

type User = {
  avatar: string;
  userName: string;
  intraId: string;
  intraName: string;
  isLogged: boolean;
  inGame: boolean;
};

const FriendsSection: React.FC<Props> = ({ id }) => {

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get(`http://localhost:3001/friends/allUser/${id}`,{withCredentials:true})
			const { friends} = response.data;
			const usersData = [...friends.map((friend: User) => ({ ...friend }))]
			setUsers(usersData);
		  } catch (error) {
			localStorage.clear()
			window.location.href= '/login'
		  }
		};
		fetchData();
	  }, []);
	
  return (<>
	<div id="AllFriends" className="UsersSection">
	{( users.length ) ? (
        users.map((user, index) => (
		<div className="FriendsSectionComponent" key={user.intraId}>
			<div className="imageClassFS">
				<img src={user.avatar} id="Avatar" alt=""/>
			</div>
			<div className="FriendsSectionUsername">{user.userName}</div>
			<div className="FriendsSectionIntraname">
				<a href={`/profile/${user.intraName}`} className="visitUserProfile">{user.intraName}</a>
			</div>
			<div className="personOnlineContainer">
              <i className="bi bi-circle-fill fs-5 FriendsOnlineDisplay"
                id={user.isLogged ? "indicatorOnline" : "indicatorOffline"}>
				<div className={user.inGame ? "indicatorGame" : "indicatorNotGame"}>Ingame</div>	
				</i>
            </div>
	</div>))):
		(
			<p className="NoUsersFound">You don't have any friends yet!</p>
		)
		}
	</div>	
	</>
	);
  };
  
  export default FriendsSection;