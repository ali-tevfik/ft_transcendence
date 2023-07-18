import { useState,useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Settings } from './components/SettingsModal'
import { WaitingPage } from './components/WaitingPage/index'
import { useSocket } from "../../contexts/SocketContext"
import './styles.css'
// import { WaitingPage } from './components/WaitingPage'

export function Lobby() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  // const [gameId, setGameId] = useState('');


  const onMatched = useCallback((gameId:number) => {  // receive gameId here
    // Now you have access to gameId
    console.log(gameId);
    // setGameId(gameId);
    console.log('matched');
    setIsLookingForOpponent(false);
    navigate(`/random?gameId=${gameId}`)
  }, [navigate])
  
  useEffect(() => {
    socket.on("matchFound", onMatched);  // no need to pass gameId here
    return () => {
      socket.off('matchFound', onMatched);
      socket.disconnect();
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelMatching() {
        console.log('cancel');
        setIsLookingForOpponent(false);
        navigate('/lobby');
    }
    socket.on("gameUnqueued", onCancelMatching);
    return () => {
      socket.off('gameUnqueued', onCancelMatching);
      socket.disconnect();
    };
  }, [socket, navigate]);

  // if (!isConnected)
  //   return <div>not connected</div>

  const handleRandomGame = () => {
    setIsLookingForOpponent(true);
    console.log('yes');
    socket.emit("matchMaking");
  };

  return (
    <div className='lobby'>
      <div className='containerlobby'>
      {/* <h1>...</h1> */}
        <div className='left-column'>
          <div className='avatar'>avatar</div>
          <div className='avatar'>score</div>
          <Link to='/solo' className='button-73'>SOLO</Link>
          <Link to='/multiplayer' className='button-73'>MULTIPLAYER</Link>
        </div>
        {/* <div className='right-column'> */}
          <button className="button-74" onClick={handleRandomGame}>
            Random Game
          </button>
          {/* <button className="button-73" onClick={handleRandomGame}>
              Invite a friend
          </button> */}
        {/* </div> */}
      </div>
      {/* {isLookingForOpponent && (
        <div className="modal">
          Looking for an opponent...
        </div> */}
      {/* )} */}
      <Settings isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
      <WaitingPage isOpen={isLookingForOpponent} setIsOpen={setIsLookingForOpponent} />
    </div>
  );
}






