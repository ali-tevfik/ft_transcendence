// import { SettingsIcon } from '../../assets'
// import { Button } from './Button'
import { Modal } from './Modal'
import { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocket } from "../../../../contexts"
import queryString from 'query-string';
import './styles.css'

export enum GameType {
  CLASSIC = 0,
  CUSTOM = 1,
}

export function WaitingPage1() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();


  useEffect(() => {
    function onMatched() {
        console.log('matched');
        setIsLookingForOpponent(false);
        navigate('/random');
    }
    socket.on("matchFound", onMatched);
    return () => {
      socket.off('matchFound', onMatched);
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
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket.emit("matchMaking", {type: 'CLASSIC'});
    return () => {
      socket.off('matchMaking');
    };
  }, []);

  const handleClose = () => {
    socket.emit("cancelMatching");
    console.log('idil');
    setIsLookingForOpponent(false);
    navigate('/lobby');
  };

  return (
    <>
      {isLookingForOpponent && (
        <div className='installing'>
          <p className="loader"></p>
          <p>Looking for an opponent</p>
          <button className='close' onClick={handleClose}>
            Cancel Game Request
          </button>
        </div>
        
      )}
    </>
  )
}

export function WaitingPage3() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(true);
  const [isClose, setIsClose] = useState(false)
  const { socket } = useSocket();
  const navigate = useNavigate();


  useEffect(() => {
    function onMatched() {
        console.log('matched');
        setIsLookingForOpponent(false);
        navigate('/random');
    }
    socket.on("matchFound", onMatched);
    return () => {
      socket.off('matchFound', onMatched);
      // socket.disconnect();
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
      // socket.disconnect();
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket.emit("matchMaking", {type: 'CUSTOM'});
    return () => {
      // socket.off('gameUnqueued', onCancelInvite);
      // socket.disconnect();
    };
  }, []);

  const handleClose = () => {
    socket.emit("cancelMatching");
    console.log('idil');
    setIsLookingForOpponent(false);
    navigate('/lobby');
  };

  return (
    <>
      {isLookingForOpponent && (
        <div className='installing'>
          <p className="loader"></p>
          <p>Looking for an opponent</p>
          <button className='close' onClick={handleClose}>
            Cancel Game Request
          </button>
        </div>
      )}
    </>
  )
}

export function WaitingPage2() {
  const [isLookingForOpponent, setIsLookingForOpponent] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = queryString.parse(location.search);
  const username = queryParams.username;

  useEffect(() => {
    function onSend() {
        console.log('++++++++invite send, waiting for respond');
        setIsLookingForOpponent(true);
        // navigate('/random');
    }
    socket.on("invitesent", onSend);
    return () => {
      socket.off('invitesent', onSend);
      // socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    function onAccepted() {
        setIsLookingForOpponent(false);
        navigate('/friendgame');
    }
    socket.on("gameAccepted", onAccepted);
    return () => {
      socket.off('gameAccepted', onAccepted);
    };
  }, [socket, navigate]);

  useEffect(() => {
    function onCancelInvite() {
        console.log('cancel');
        setIsLookingForOpponent(false);
        navigate('/lobby');
    }
    socket.on("error", onCancelInvite);
    return () => {
      socket.off('error', onCancelInvite);
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket.emit("Invite", { userName: username });
    return () => {
    };
  }, []);

  const handleClose = () => {
    socket.emit("Uninvite", { userName: username });
    console.log('idil');
    setIsLookingForOpponent(false);
    navigate('/lobby');
  };

  return (
    <>
      {isLookingForOpponent && (
        <div className='installing'>
          <p className="loader"></p>
          <p>Hang tight! Your friend is still thinking it over...</p>
          <button className='close' onClick={handleClose}>
            Cancel Invite
          </button>
        </div>
      )}
    </>
  )
}

