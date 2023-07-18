import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway";
import { ChatService } from "src/chat/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/typeorm/user.entity";
import { RoomEntity } from "src/typeorm/room.entity";
import { MessageEntity } from "src/typeorm/message.entity";
import { UserService } from "src/user/user.service";
import { RoomUserEntity } from "src/typeorm/roomUser.entity";
import { GatewayService } from './gateway.service';
import { GameEntity } from '../typeorm/game.entity';
import { GameService } from '../game/game.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity, RoomUserEntity, MessageEntity, GameEntity])],
	providers: [MyGateway, ChatService, UserService, GatewayService, GameService]
})
export class GatewayModule{}