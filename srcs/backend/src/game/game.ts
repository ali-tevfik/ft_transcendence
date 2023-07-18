import { Server } from "socket.io";

export const numActPerSendData = 2;
export const baseSpeed = 100;
export const scoreMax = 3;
// export const startTime = 1e3;
export const gameTps = 120;
// export const ballSpeed = (baseSpeed / gameTps); //don't take a ration baseSpeed / gameTps over the padWidth could cause problem with collision detection
export const ballSizeX = 2.4;
export const ballSizeY = 3.2;
export const ballSpeedInc = 100/120 / 25;
export const padSpeed = (baseSpeed / gameTps);
export const padHeight = 15;
export const padWidth = 1.25;
export const paddleLeftStartX = padWidth * 2;
export const paddleRightStartX = 100 - (padWidth * 3);
// export const 50 - 15 / 2 = 50 - padHeight / 2;

export class Ball {
  x: number;
  y: number;
  speed: number;
  directionX: number;
  directionY: number;
  sizeX: number;
  sizeY: number;
  accel: number;

  constructor(directionX: number, customBallSpeed: number) {
    this.x = 50;
    this.y = 50;
    this.speed = customBallSpeed;
    this.directionX  = directionX;
    this.directionY = customBallSpeed * Math.sin(Math.PI / 4);
    this.sizeX = ballSizeX;
    this.sizeY = ballSizeY;
    this.accel = 0;
  }
}

export class Pad {
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
  move: number;
  reversed: number;

  constructor(startX: number, height: number) {
    this.x = startX;
    this.y = 50 - 15 / 2;
    this.height = height;
    this.width = padWidth;
    this.speed = padSpeed;
    this.move = 0;
    this.reversed = 1;
  }
}

export class Game {
  
  interval: NodeJS.Timer;
  sendTest: number;
  pause: boolean;
  p1Score: number;
  p2Score: number;
  ball: Ball;
  paddleLeft: Pad;
  paddleRight: Pad;
  server: Server;
  p1: number;
  p2: number;
  id: string;
  dbIdP1: number;
  dbIdP2: number;
  packetId: number;

  constructor(
    server: Server,
    p1: number,
    p2: number,
    dbIdP1: number,
    dbIdP2: number,
    customPadHeight = padHeight,
    customBallSpeed = 100/120,
    customAccelBall = ballSpeedInc,
  ) {
    const modeSpeed = customBallSpeed;

    this.server = server;
    this.interval = null;
    this.sendTest = 1;
    this.pause = false;
    this.p1Score = 0;
    this.p2Score = 0;
    this.ball = new Ball(-modeSpeed * Math.cos(Math.PI / 4), modeSpeed);
    this.paddleLeft = new Pad(paddleLeftStartX, customPadHeight);
    this.paddleRight = new Pad(paddleRightStartX, customPadHeight);
    this.p1 = p1;
    this.p2 = p2;
    this.id = [p1, p2].sort().join('_');
    this.dbIdP1 = dbIdP1;
    this.dbIdP2 = dbIdP2;
    this.packetId = 0;
  }

}