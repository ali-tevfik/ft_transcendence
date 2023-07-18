import { useRef, useEffect } from 'react'
import { Ball, Paddle, Score, Timer, Net } from './components'
import { useGame } from '../../contexts'
import { GameMode } from './logic/types'


type GameProps = {
  gameMode?: GameMode
}

export function Game({ gameMode = 'endless' }: GameProps) {
  const ballRef = useRef<HTMLDivElement>(null)
  const playerPaddleRef = useRef<HTMLDivElement>(null)
  const computerPaddleRef = useRef<HTMLDivElement>(null)
  const { setUp, start, gameState } = useGame()
  
  useEffect(() => {
    if (
      ballRef.current &&
      playerPaddleRef.current &&
      computerPaddleRef.current &&
      !gameState.isGameRunning
    ) {
      setUp(
        ballRef.current as HTMLDivElement,
        playerPaddleRef.current as HTMLDivElement,
        computerPaddleRef.current as HTMLDivElement,
        { gameMode }
      )

      start()
    }
  }, [
    ballRef.current,
    playerPaddleRef.current,
    computerPaddleRef.current,
    gameState.isGameRunning,
  ])

  return (
    <>
      <Timer />
      <Score />
      <Net />
      <Ball ballRef={ballRef} />
      <Paddle paddleRef={playerPaddleRef} />
      <Paddle paddleRef={computerPaddleRef} side='right' />
    </>
  )
}
