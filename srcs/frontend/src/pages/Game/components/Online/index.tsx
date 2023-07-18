import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useSocket } from '../../../../contexts/SocketContext'
import io from 'socket.io-client';

interface GameData {
  ball: { x: number; y: number; sizeX: number; sizeY: number; };
  paddleLeft: { x: number; y: number; width: number; height: number; };
  paddleRight: { x: number; y: number; width: number; height: number; };
  pause: boolean;
  p1Score: number;
  p2Score: number;
  p1: string;
  p2: string;
  tps: number;
}

export function Random() {
  const {socket} = useSocket();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('gameId');

console.log ('++++++++++');
console.log (gameId);
useEffect(() => {
  
  
  const handler = (data: GameData) => {
    console.log('++++++++++Received game data:', data);
    setGameData(data);
  };
  
  socket.emit('join', `game${gameId}`);
    socket.on('gameData', handler);
    return () => {
      socket.off('gameData', handler);
    };
  }, [socket]);
  
  // Render the game data
  if (gameData !== null) {
    console.log('data yess');
    // return <div>Loading...</div>;
  }

  return (
    <div>
         Game
         {gameData && (
        <>
          <p>{`Score: ${gameData.p1Score} - ${gameData.p2Score}`}</p>
          <div> idiiiiil</div>
          <div style={{ position: 'relative', height: '500px', width: '500px', border: '1px solid black' }}>
            <div style={{ position: 'absolute', top: `${gameData.ball.y * 5}px`, left: `${gameData.ball.x * 5}px`, height: `${gameData.ball.sizeY * 5}px`, width: `${gameData.ball.sizeX * 5}px`, backgroundColor: 'black' }} />
            <div style={{ position: 'absolute', top: `${gameData.paddleLeft.y * 5}px`, left: `${gameData.paddleLeft.x * 5}px`, height: `${gameData.paddleLeft.height * 5}px`, width: `${gameData.paddleLeft.width * 5}px`, backgroundColor: 'blue' }} />
            <div style={{ position: 'absolute', top: `${gameData.paddleRight.y * 5}px`, left: `${gameData.paddleRight.x * 5}px`, height: `${gameData.paddleRight.height * 5}px`, width: `${gameData.paddleRight.width * 5}px`, backgroundColor: 'red' }} />
          </div>
        </>
      )}
    </div>
  );
}