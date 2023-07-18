import { GameState } from '../../../contexts'

export type GameConstructor = React.Dispatch<React.SetStateAction<GameState>>

export type GameSetUp = {
  ballRef: HTMLDivElement
  playerPaddleRef: HTMLDivElement
  computerPaddleRef: HTMLDivElement
  options?: GameOptions
}

export type GameOptions = {
  gameMode?: GameMode
  isFixedVelocity?: boolean
  ballVelocityIncrease?: number
  paddleSize?: number
  gameStartTimer?: number
}

export type GameMode = 'solo' | 'multiplayer' | 'endless'

export const gameModes: GameMode[] = ['solo', 'multiplayer', 'endless']

export type Score = [number, number]

export type Vector = { x: number; y: number }
