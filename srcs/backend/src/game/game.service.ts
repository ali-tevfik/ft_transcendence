import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GatewayService } from 'src/gateway/gateway.service';
import { Repository } from 'typeorm';
import { GameEntity } from '../typeorm/game.entity';
import { UserEntity } from '../typeorm/user.entity';
import { Game, ballSizeY, padHeight } from './game';
import { Ball } from './game';
import { Pad } from './game';
import { PadMove } from './game';
import { scoreMax } from "./game";
import { numActPerSendData } from "./game";
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private socketService: GatewayService,
        private userService: UserService,
    ) {}
    
    // after matching with an opponent start the game.
    async startGame(game: Game) {
        await this.userRepository.update(game.p1, { inGame: true });
        await this.userRepository.update(game.p2, { inGame: true });
        await new Promise(resolve => setTimeout(resolve, 4000)); //3000 for the timer.. but maybe a little larger?
        game.interval = setInterval(() => this.gameLoop(game), 8); // smalller then 1000/120
    }

    async gameLoop(game: Game) {
        let i: number = 1;
        if (!game.pause) {
            this.isLose(game);
            if (game.p1Score === scoreMax || game.p2Score === scoreMax) {
                clearInterval(game.interval);
                const winner = game.p1Score === scoreMax ? game.p1 : game.p2;
                const loser = winner === game.p1 ? game.p2 : game.p1;
                const winnerScore = Math.max(game.p1Score, game.p2Score);
                const loserScore = Math.min(game.p1Score, game.p2Score);

                await this.userRepository.update(winner, { totalWin: +1, score: +100, inGame: false });
                await this.userRepository.update(loser, { totalLoose: +1, inGame: false });

                const winnerObj = await this.userService.findUserByUserId(winner);  ///buraya alinin fonksiyonunu koyacaksin

                let winnerUsername: String;
                if (!winnerObj) winnerUsername = "unKnown";
                else winnerUsername = winnerObj.userName;

                game.server.to(`game${game.id}`).emit('success', `user ${winnerUsername} won the game ${winnerScore} - ${loserScore}`);
                game.server.to(`game${game.id}`).emit('game_ended', { winnerUsername, winnerId: winner, winnerScore, loserScore });
                // this.socketService.endGame(game, game.id);
                game.server.socketsLeave(`game${game.id}`);
                this.socketService.games.delete(game.id);
                // game.pause = true;
                return;
            }

            this.isCollisionWall(game.ball);
            
            if (game.ball.x <= game.paddleLeft.x + game.paddleLeft.width &&
                game.ball.x + game.ball.sizeX >= game.paddleLeft.x &&
                game.ball.directionX < 0) {
                this.isCollisionPaddle(game.paddleLeft, game.ball);
            }

            else if (game.ball.x + game.ball.sizeX >= game.paddleRight.x &&
                    game.ball.x <= game.paddleRight.x + game.paddleRight.width &&
                    game.ball.directionX > 0) {
                this.isCollisionPaddle(game.paddleRight, game.ball);
            }

            // Add velocity to ball
            game.ball.x += game.ball.directionX;
            game.ball.y += game.ball.directionY;

            // Make sure ball is stil inside the game
            game.ball.x = Math.min(game.ball.x, 100 - game.ball.sizeX);
            game.ball.x = Math.max(game.ball.x, 0);
            game.ball.y = Math.min(game.ball.y, 100 - game.ball.sizeY);
            game.ball.y = Math.max(game.ball.y, 0);

            if (game.paddleLeft.move === -1)
                this.padUp(game.paddleLeft);
            else if (game.paddleLeft.move === 1)
                this.padDown(game.paddleLeft);
            if (game.paddleRight.move === -1)
                this.padUp(game.paddleRight);
            else if (game.paddleRight.move === 1)
                this.padDown(game.paddleRight);
        }

        if (!game.pause) {
            this.broadcastGame(game);
            i = 1;
        }
        else
            return ;
        //  this.socketService.endGame(game, game.id);

        //     end game
    }

    // if ball is out of game, update the scores in the database, and reset the game.
    async isLose(game: Game) {
        if (game.ball.x <= 0 || game.ball.x + game.ball.sizeX >= 100) {
            if (game.ball.x <= 0)
                game.p2Score++;
            else
                game.p1Score++;
            try {
                await this.gameRepository.update(game.dbIdP1, { playerScore: game.p1Score, opponentScore: game.p2Score });
                await this.gameRepository.update(game.dbIdP2, { playerScore: game.p2Score, opponentScore: game.p1Score });
            } catch {
                game.server.to(`game${game.id}`).emit('error', "could not update score in database");
            }
            this.reset(game);
            // put a popup in the frontend maybe?
            if (game.p2Score !== scoreMax && game.p1Score !== scoreMax) {
                game.server.to(`game${game.id}`).emit('success', `Score: ${game.p1Score} - ${game.p2Score}`);
            }
        }
    }

    // reset every data to the initial state, pause the game for 3 sec and restart it.
    reset(game: Game) {
        game.ball.x = 50;
        game.ball.y = 50;
        game.ball.speed = 100/120;
        if (game.p2Score > game.p1Score)
            game.ball.directionX = game.ball.speed * Math.cos(Math.PI / 4);
        else
            game.ball.directionX = -game.ball.speed * Math.cos(Math.PI / 4);
        game.ball.directionY = game.ball.speed * Math.sin(Math.PI / 4);
        game.paddleLeft.y = 50;
        game.paddleLeft.move = 0;
        game.paddleLeft.reversed = 1;
        game.paddleRight.y = 50;
        game.paddleRight.move = 0;
        game.paddleRight.reversed = 1;

        game.pause = true;

        this.broadcastGame(game);
        setTimeout(() => {
            game.pause = false
        }, 3000); //bu timer ile ayni olmali
    }

    isCollisionWall(ball: Ball) {
        if ((ball.y <= 0 && ball.directionY < 0) || (ball.y + ball.sizeY >= 100 && ball.directionY > 0))
            ball.directionY = -ball.directionY;
    }

    isCollisionPaddle(pad: Pad, ball: Ball) {
        // check if the balls bottom edge < the paddle's top edge &&& balls bottom edge is < the paddle's top edge
        if ( ball.y + ball.sizeY > pad.y && ball.y < pad.y + pad.height) {
            // sifira yaklastikca tam ortaya gelmis olacak. arti dgerler paddlein ust kismi negativeler alt kismi
            const collidedAt = ball.y + ball.sizeY / 2 -
                (pad.y + pad.height / 2);
            // saga mi sola mi? ve hangi hizla 
            ball.directionX = (pad.x > 50 ? -1 : 1) * Math.abs(ball.speed *
                Math.cos((collidedAt * Math.PI) / 4 / (pad.height / 2)));
            // y hizi
            ball.directionY = ball.speed *
                Math.sin((collidedAt * Math.PI) / 4 / (pad.height / 2));
            // her carptiginda biraz arttir bu swayiyi degistir kayboluyo top
            ball.speed += ball.accel;
            // yada bu sorunu cozebilir mi acaba padin eninden sanki aaz olmasi yetecek onu yakalayacak
            if (ball.speed >= pad.width) {
                ball.speed = pad.width - 0.05;
                ball.accel = 0;
            }
        }
    }

    broadcastGame(game: Game) {
        game.server.to(`game${game.id}`).emit('gameData', {
            ball: game.ball,
            paddleLeft: game.paddleLeft,
            paddleRight: game.paddleRight,
            pause: game.pause,
            p1Score: game.p1Score,
            p2Score: game.p2Score,
            p1: game.p1,
            p2: game.p2,
        });
    }

    padUp(pad: Pad) {
        if (pad.y - pad.reversed * pad.speed <= 0)
            pad.y = 0;
        else if (pad.y + pad.height - pad.reversed * pad.speed >= 100)
            pad.y = 100 - pad.height;
        else
            pad.y -= padHeight ;
    }

    padDown(pad: Pad) {
        if (pad.y + pad.reversed * pad.speed <= 0)
            pad.y = 0;
        else if (pad.y + pad.height + pad.reversed * pad.speed >= 100)
            pad.y = 100 - pad.height;
        else
            pad.y += padHeight;
    }
}