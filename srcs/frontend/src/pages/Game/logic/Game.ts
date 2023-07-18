import { GameState } from '../../../contexts'
import { GAME_START_TIMER, GAME_START_TIMER_DELAY } from './constants'
import { Score } from '.'
import {
  Ball,
  Paddle,
  setUpListeners,
} from '.'
import {
  GameConstructor,
  GameOptions,
  GameSetUp,
} from './types'

export class Game {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  controlledPaddles: Array<Paddle> = []
  computerPaddles: Array<Paddle> = []

  ball: Ball = null as any
  paddle1: Paddle = null as any
  paddle2: Paddle = null as any

  score: Score = [0, 0]
  options: GameOptions = {}
  isEndless: boolean = false

  lastTime: number = 0
  timeStarted: number = 0

  constructor(setGameState: GameConstructor) {
    this.setGameState = setGameState
  }

  setUp({ ballRef, playerPaddleRef, computerPaddleRef, options }: GameSetUp) {
    this.ball = new Ball(
      ballRef,
      !!options?.isFixedVelocity,
      options?.ballVelocityIncrease
    )
    this.paddle1 = new Paddle(playerPaddleRef)
    this.paddle2 = new Paddle(computerPaddleRef)
    this.options = options ?? {}

    switch (options?.gameMode) {
      case 'endless':
        this.controlledPaddles = []
        this.computerPaddles = [this.paddle1, this.paddle2]
        this.isEndless = true
        break
      case 'multiplayer':
        this.controlledPaddles = [this.paddle1, this.paddle2]
        this.computerPaddles = []
        break
      // case 'random':
      //   this.controlledPaddles = [this.paddle1, this.paddle2]
      //   this.computerPaddles = []
      //   break
      default:
        this.controlledPaddles = [this.paddle1]
        this.computerPaddles = [this.paddle2]
    }
  }

  start() {
    setTimeout(() => {
      !this.isEndless&&
        setUpListeners(this.controlledPaddles, this.options.paddleSize)
      window.requestAnimationFrame((time) => this.update(time))
    }, this.options.gameStartTimer ?? GAME_START_TIMER + GAME_START_TIMER_DELAY)
  }

  update(time: number) {
    if (this.lastTime != 0) {
      const delta = time - this.lastTime

      this.ball.update(delta, [this.paddle1.rect(), this.paddle2.rect()])
      this.computerPaddles.forEach((paddle) => {
        paddle.update(delta, this.ball.y)
      })

      if (this.isLose()) this.handleLose()
    }

    this.lastTime = time
    window.requestAnimationFrame((time) => this.update(time))
  }

  isLose() {
    const rect = this.ball.rect()
    return rect.right >= window.innerWidth || rect.left <= 0
  }

  handleLose() {
    const rect = this.ball.rect()

    if (rect.right >= window.innerWidth) {
      this.score = [this.score[0] + 1, this.score[1]]
      this.setGameState((prevState) => ({
        ...prevState,
        score: this.score,
      }))
    } else {
      this.score = [this.score[0], this.score[1] + 1]
      this.setGameState((prevState) => ({
        ...prevState,
        score: this.score,
      }))
    }

    this.ball.reset()
    this.computerPaddles.forEach((paddle) => paddle.reset())
  }
}
