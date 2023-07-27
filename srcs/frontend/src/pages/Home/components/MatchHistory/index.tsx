import './styles.css'
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts'
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
};

const MatchHistory: React.FC<Props> = ({ id }) => {

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get(`http://localhost:3001/game/${id}`,{withCredentials:true});
			console.log("BURASI MATCH  " + JSON.stringify(response.data))
			// const { friends} = response.data;
			// const usersData = [...friends.map((friend: User) => ({ ...friend }))]
			// setUsers(usersData);
			
		  } catch (error) {
			console.error(error)
			// localStorage.clear()
			// window.location.href= '/login'
		  }
		};
		fetchData();
	  }, []);
	
	const isWon = true;
	const isLost = true;

  return (
	<>
		<div className="MatchHistorySection">
	{( users.length ) ? (
		users.map((user, index) => (
	// There will be array of oponents match
			<div className={isWon ? 'UserMatchHistory userWonMatch' : 'UserMatchHistory userLostMatch'}>
				<div className="imageUserMatch" id="imageFirstUser">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
				<div className="MatchHistoryScore" id="ScoreFirstUser">5</div>
				<div className="VS">-</div>
				<div className="MatchHistoryScore" id="ScoreSecondUser">3</div>
				<div className="imageUserMatch" id="imageSecondUser">
					<img src={user.avatar} id="Avatar" alt=""/>
				</div>
			{/* <div className={isLost ? 'UserMatchHistory userLostMatch' : 'UserMatchHistory userWonMatch'}>
				<div className="imageUserMatch" id="imageFirstUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
					<div className="MatchHistoryScore" id="ScoreFirstUser">18</div>
					<div className="VS">-</div>
					<div className="MatchHistoryScore" id="ScoreSecondUser">22</div>
					<div className="imageUserMatch" id="imageSecondUser">
						<img src={user.avatar} id="Avatar" alt=""/>
					</div>
				</div> */}
			{/* <div className="DummyContent"></div>
			<div className="DummyContent"></div> */}
		</div>
		))):
		(
			<p  className="NoUsersFound">You haven't played a match before!</p>
		)
		
	}
	</div>
	</>
	);
	}
  export default MatchHistory;