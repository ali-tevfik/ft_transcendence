import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../../contexts';
import { Timer } from '../Timer/index';
import { useNavigate } from 'react-router-dom'
import './styles.css'

interface GameState {
  ball: { x: number; y: number; sizeX: number; sizeY: number; };
  // block: { x: number; y: number; sizeX: number; sizeY: number; };
  paddleLeft: { x: number; y: number; width: number; height: number; };
  paddleRight: { x: number; y: number; width: number; height: number; };
  blockA: { x: number; y: number; width: number; height: number; };
  blockB: { x: number; y: number; width: number; height: number; };
  pause: boolean;
  p1Score: number;
  p2Score: number;
  p1: string;
  p2: string;
  isCustom: boolean;
}

export function Random() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timer, setTimer] = useState(false);
  const [end, setEnd] = useState(false);
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const gameDataHandler = (data: GameState) => {
      // console.log('++++++++++++++++Received game data:', data);
      setGameState(data);
      // console.log(data.isCustom);
    };
    socket.on('gameData', gameDataHandler);
    return () => {
      socket.off('gameData', gameDataHandler);
    };
  }, [socket]);

  useEffect(() => {
    function gameFoundHandler() {
      console.log('gameFound');
      setTimer(true);
    };
    socket.on('gameFound', gameFoundHandler);
    return () => {
      socket.off('gameFound', gameFoundHandler);
    };
  }, [socket]);

  useEffect(() => {
    const gameEndHandler = (data: string) => {
      setMessage(data);
      console.log(data);
      setTimer(false);
      // setGameState(null);
      setEnd(true);
      // navigate('/lobby');
    };
    socket.on('gameEnd', gameEndHandler);
    return () => {
      socket.off('gameEnd', gameEndHandler);
    };
  }, [socket, message]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['w', 's', 'Esc'].includes(event.key)) {
        socket.emit('keyDown', event.key);
      }
    };
  
    const handleKeyUp = (event: KeyboardEvent) => {
      if (['w', 's', 'Esc'].includes(event.key)) {
        socket.emit('keyUp', event.key);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket]);

  const handleClose = () => {
    setEnd(false);
    navigate('/lobby');
  };
  

  return (
    <>
      <div>
        {timer && (
          <>
            <Timer />
          </>
        )}
          {(gameState && !end) && (
            <>
            <div className='game-container'>
              <div className='score'>
                {`${gameState.p1Score} - ${gameState.p2Score}`}
              </div>
              <div 
                style={{
                  position: 'absolute',
                  top: `calc(${gameState.ball.y}vh)`,
                  left: `calc(${gameState.ball.x}vw`,
                  height: `calc(${gameState.ball.sizeY}vh`,
                  width: `calc(${gameState.ball.sizeX}vw`,
                  backgroundColor: 'var(--foreground-color)',
                  borderRadius: '50%'
                }}
              />
              <div
                style={{ position: 'absolute',
                  top: `calc(${gameState.paddleLeft.y}vh)`,
                  left: `calc(${gameState.paddleLeft.x}vw)`,
                  height: `calc(${gameState.paddleLeft.height}vh)`,
                  width: `calc(${gameState.paddleLeft.width}vw)`,
                  backgroundColor: 'var(--foreground-color)'
                }}
              />
              <div
                style={{ position: 'absolute',
                top: `calc(${gameState.paddleRight.y}vh)`,
                left: `calc(${gameState.paddleRight.x}vw)`,
                height: `calc(${gameState.paddleRight.height}vh)`,
                width: `calc(${gameState.paddleRight.width}vw)`,
                backgroundColor: 'var(--foreground-color)'
              }}
              />
              {gameState.isCustom && (
                <div>
                <div
                  style={{ position: 'absolute',
                  top: `calc(${gameState.blockA.y}vh)`,
                  left: `calc(${gameState.blockA.x}vw)`,
                  height: `calc(${gameState.blockA.height}vh)`,
                  width: `calc(${gameState.blockA.width}vw)`,
                  backgroundColor: 'var(--foreground-color)',
                }} />
                <div
                  style={{ position: 'absolute',
                  top: `calc(${gameState.blockB.y}vh)`,
                  left: `calc(${gameState.blockB.x}vw)`,
                  height: `calc(${gameState.blockB.height}vh)`,
                  width: `calc(${gameState.blockB.width}vw)`,
                  backgroundColor: 'var(--foreground-color)',
                }} />
                </div>
              )}
            </div>
            </>
          )}


        {end && (
          <>
            <div className='result'>
              {message}
              <button className='backlobby' onClick={handleClose}>
                Turn back to Lobby
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};


export function FriendGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timer, setTimer] = useState(false);
  const [end, setEnd] = useState(false);
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const gameDataHandler = (data: GameState) => {
      // console.log('++++++++++++++++Received game data:', data);
      setGameState(data);
    };
    socket.on('gameData', gameDataHandler);
    return () => {
      socket.off('gameData', gameDataHandler);
    };
  }, [socket]);

  useEffect(() => {
    function gameFoundHandler() {
      console.log('gameFound');
      setTimer(true);
    };
    socket.on('gameFound', gameFoundHandler);
    return () => {
      socket.off('gameFound', gameFoundHandler);
    };
  }, [socket]);

  useEffect(() => {
    const gameEndHandler = (data: string) => {
      setMessage(data);
      console.log(data);
      setTimer(false);
      setGameState(null);
      setEnd(true);
      navigate('/lobby');
    };
    socket.on('gameEnd', gameEndHandler);
    return () => {
      socket.off('gameEnd', gameEndHandler);
    };
  }, [socket, message]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['w', 's', 'Esc'].includes(event.key)) {
        socket.emit('keyDown', event.key);
      }
    };
  
    const handleKeyUp = (event: KeyboardEvent) => {
      if (['w', 's', 'Esc'].includes(event.key)) {
        socket.emit('keyUp', event.key);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket]);
  

  return (
    <>
      <div>
        {timer && (
          <>
            <Timer />
          </>
        )}
        <div className='game-container'>
          {gameState && (
            <>
              <div className='score'>
                {`${gameState.p1Score} - ${gameState.p2Score}`}
              </div>
              <div 
                style={{
                  position: 'absolute',
                  top: `calc(${gameState.ball.y}vh)`,
                  left: `calc(${gameState.ball.x}vw`,
                  height: `calc(${gameState.ball.sizeY}vh`,
                  width: `calc(${gameState.ball.sizeX}vw`,
                  backgroundColor: 'var(--foreground-color)',
                  borderRadius: '50%'
                }}
              />
              <div
                style={{ position: 'absolute',
                  top: `calc(${gameState.paddleLeft.y}vh)`,
                  left: `calc(${gameState.paddleLeft.x}vw)`,
                  height: `calc(${gameState.paddleLeft.height}vh)`,
                  width: `calc(${gameState.paddleLeft.width}vw)`,
                  backgroundColor: 'var(--foreground-color)'
                }}
              />
              <div
                style={{ position: 'absolute',
                top: `calc(${gameState.paddleRight.y}vh)`,
                left: `calc(${gameState.paddleRight.x}vw)`,
                height: `calc(${gameState.paddleRight.height}vh)`,
                width: `calc(${gameState.paddleRight.width}vw)`,
                backgroundColor: 'var(--foreground-color)'
              }}
              />
              {/* {gameState.isCustom && (
                <div
                  style={{ position: 'absolute',
                  top: `calc(${gameState.blockA.y}vh)`,
                  left: `calc(${gameState.blockA.x}vw)`,
                  height: `calc(${gameState.blockA.height}vh)`,
                  width: `calc(${gameState.blockA.width}vw)`,
                  backgroundColor: 'var(--foreground-color)',
                }} />
                <div
                  style={{ position: 'absolute',
                  top: `calc(${gameState.blockB.y}vh)`,
                  left: `calc(${gameState.blockB.x}vw)`,
                  height: `calc(${gameState.blockB.height}vh)`,
                  width: `calc(${gameState.blockB.width}vw)`,
                  backgroundColor: 'var(--foreground-color)',
                }} />
              )} */}
            </>
          )}
        </div>


        {/* {end && (
          <>
            {message}
          </>
        )} */}
      </div>
    </>
  );
};