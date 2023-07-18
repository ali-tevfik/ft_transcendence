import { OnGatewayConnection, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatService } from "src/chat/chat.service";
import { Logger } from "@nestjs/common"; 
import { UserService } from "src/user/user.service";
import { RoomDto } from "src/dto/room.dto";
import { MessageDto } from "src/dto/message.dto";
import { UserDto } from "src/dto/user.dto";
import { RoomUserDto } from "src/dto/roomUser.dto";
import { GatewayService } from "./gateway.service";
import { GameService } from "../game/game.service";

@WebSocketGateway( {
	cors: {
		origin: ['http://localhost:3000']
	}
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect{
	private logger: Logger = new Logger('MyGateway');

	@WebSocketServer()
	server: Server;

	constructor(
		private chatService: ChatService,
		private userService: UserService,
		private gatewayService: GatewayService, ////////////ibulak
		private gameService: GameService) {}
		// ///////////////////idil
		private userToSocketId: Map<number, string> = new Map<number, string>();
		// //////////////didil

	async handleConnection(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client connected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);

		const user = await this.userService.findUserByUserName(userSocket.name);
		if(!user)
			return

		client.join(user.id.toString());
		// client.emit('userId', user.id);
		this.userToSocketId.set(user.id, client.id); ////////ibulak
		console.log('burda');
		console.log(client.id);
		console.log(user.id);
		// await this.userService.updateStatus(userSocket.name, 'online');
		// this.onUserUpdate();

		await this.userService.updateStatus(userSocket.name, 'online');
		this.onUserUpdate();
	}
	
	async handleDisconnect(client: Socket) {
		const userSocket = client.handshake.auth;
		this.logger.debug(`Client disconnected: [${userSocket.name}] - ${client.id}`);
		this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`);
		// console.log(client.rooms);
		await this.userService.updateStatus(userSocket.name, 'offline');
		this.onUserUpdate();
	}
	
	@SubscribeMessage('userUpdate') // unneccesary? to have event, only server uses it now
	async onUserUpdate() {
		const users = await this.userService.getAllUsersStatus();
		this.server.emit('onUserUpdate', users);
	}

	@SubscribeMessage('memberUpdate') // also leave room?
	async onMemberUpdate(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
		// const userSocket = client.handshake.auth;
		// const members = await this.chatService.getRoomMembers(roomName);
		// if (!roomName) return
		// console.log("MEMBERUPDAT",roomName);
		// console.log(userSocket.name);
		// console.log(members);
		this.server.to(roomName).emit('onMemberUpdate')//, members);
	}

	@SubscribeMessage('memberInvite') // also leave room?
	async onMemberInvite(@MessageBody() selectedUsers: string[]) {
		for (const userName of selectedUsers) {
			const user = await this.userService.findUserByUserName(userName);
			this.server.to(user.id.toString()).emit('onMemberInvite');
		}
	}
	
	@SubscribeMessage('joinRoom') // also leave room?
	async onJoinRoom(@MessageBody() room: RoomDto, @ConnectedSocket() client: Socket) {
		client.join(room.roomName);
		// console.log("JOIN",room.roomName)
		this.onMemberUpdate(room.roomName, client)
		// const users = await this.chatService.getRoomUsers(room.roomName);
		// this.server.to(room.roomName).emit('memberStatus', users); //more elegant way?
	}

	@SubscribeMessage('leaveRoom') // also leave room?
	async onLeaveRoom(@MessageBody() room: RoomDto, @ConnectedSocket() client: Socket) {
		client.leave(room.roomName);
		// console.log("JOIN",room.roomName)
		this.onMemberUpdate(room.roomName, client)
		// const users = await this.chatService.getRoomUsers(room.roomName);
		// this.server.to(room.roomName).emit('memberStatus', users); //more elegant way?
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@MessageBody() message: MessageDto) {
		const newMessage = await this.chatService.addMessage(message);
		this.server.to(newMessage.roomName).emit('onMessage', newMessage);
	}

	@SubscribeMessage('newDmRoom')
	async onNewDmRoom(@MessageBody() userName: string) { //i'm gining userroom to contact? wrong RoomUser
		const { id } = await this.userService.findUserByUserName(userName);
		this.server.to(id.toString()).emit('onNewDmRoom');
		// {
		// 	...room,
		// 	contact: room.userName,
		// });
	}

	@SubscribeMessage('blockUser')
	async onBlockUser(@MessageBody() { user, blockedUser }: { user: UserDto, blockedUser: UserDto }) {
		await this.userService.blockUser(user.userName, blockedUser.userName); // do with http?
		this.server.to(blockedUser.id.toString()).emit('blockedBy', user);
	}


	// /////////////////////////////////////////////////////////////////////////////

	@SubscribeMessage('matchMaking')
	async handleMatchMaking( @ConnectedSocket() client: Socket ) {
		if (!client) {
			client.emit('error', "No connection"); ///null oldugu duruma bak  frontende koy
			return;
		}
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		const resQueued = this.gatewayService.addUserToQueue(user.id);
		if (resQueued.status !== true) {
			client.emit('error', resQueued.message);
			return;
		}
		const resMatching = await this.gatewayService.findMatch();
		if (resMatching.status !== true) {
			client.emit('error', resMatching.message);
            return;
        }
		// ilk buranin kini koydun
		// const [socket1, socket2] = resMatching.payload.map(u => this.server.sockets.sockets.get(this.gatewayService.getUserKVByUserId(u.id)[0])); //socket from user id
		// console.log(socket1,socket2);
        // if (!socket1 || !socket2)
        //     return; //error donmen gerek?>
		const [user1, user2] = resMatching.payload;
		const socket1Id = this.userToSocketId.get(user1.id);
		const socket2Id = this.userToSocketId.get(user2.id);
		
		const socket1 = this.server.sockets.sockets.get(socket1Id);
		const socket2 = this.server.sockets.sockets.get(socket2Id);
		console.log('idil+++++++++++');
		console.log(socket1Id);
		// console.log(socket2);
		if(!socket1 || !socket2){
			console.error('One or both sockets could not be found');
			return; // Or handle error in another appropriate way
		  }
		  
		const gameId = [resMatching.payload[0].id, resMatching.payload[1].id].sort().join('_');
		socket1.emit('matchFound', gameId); //bu oldugunda bir insatlling effecti koyabilirsin?
		socket2.emit('matchFound', gameId); //bu oldugunda bir insatlling effecti koyabilirsin?
        socket1.join(`game${gameId}`);
        socket2.join(`game${gameId}`);

		if (socket1.rooms.has(`game${gameId}`) && socket2.rooms.has(`game${gameId}`)) {
			console.log(`room: game${gameId} 'e iki user da girdi`);
		} else {
			console.log(`Error: One or both users have not joined game room: game${gameId}`);
		}
        const resGameCreate = await this.gatewayService.createGame(this.server, resMatching.payload[0], resMatching.payload[1]);
        if (resGameCreate.status !== true) {
			if (resGameCreate.message)
			client.emit('error', resGameCreate.message);
            socket1.leave(`game${gameId}`);
            socket2.leave(`game${gameId}`);
            return;
        }
        this.server.to(`game${gameId}`).emit('success', `Found match! Starting the game...`);
        this.server.to(`game${gameId}`).emit('game_info', { p1: resMatching.payload[0].id, p2: resMatching.payload[1].id });
        this.server.to(`game${gameId}`).emit('game_found');
		console.log(resMatching.payload[0].id,' and ', resMatching.payload[1].id, 'oyuna basladi');
        this.gameService.startGame(this.gatewayService.getGameByGameId(gameId));
	}

	@SubscribeMessage('cancelMatching')
    async cancelMatch( @ConnectedSocket() client: Socket ) {
		console.log('idil');
		const userSocket = client.handshake.auth;
		const user = await this.userService.findUserByUserName(userSocket.name);
		if (!user) {
			client.emit('error', 'Invalid user');
			return;
		}
		const resUnqueued = this.gatewayService.deleteUserFromQueue(user.id);
		if (resUnqueued.status !== true) {
			client.emit('error', resUnqueued.message);
			return;
		}
        client.emit('gameUnqueued');
    }

	@SubscribeMessage('join')
	onJoin(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
		client.join(room);
		console.log('yes');
	}
	}



	// @SubscribeMessage('getUserStatus')
	// async getUserStatus(@ConnectedSocket() client: Socket) {
	// 	const users = await this.userService.getAllUsersStatus();
	// 	client.emit('userStatus', users);
	// }
	
	// @SubscribeMessage('getMemberStatus')
	// async getMemberStatus(@MessageBody() body: RoomDto, @ConnectedSocket() client: Socket) {
	// 	const users = await this.chatService.getRoomUsers(body.roomName);
	// 	client.emit('memberStatus', users);
	// }




// handleConnection(client: Socket) {
// 	const user = client.handshake.auth;
// 	// console.log(user);
// 	// this.users.push(user);
// 	client.data.user = user;
// 	this.logger.log(`Client connected: ${client.id}`);
// 	this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`)
// 	this.server.emit('newUserResponse', this.users);
// }

// handleDisconnect(client: Socket) {
// 	const user = client.handshake.auth;
// 	this.users = this.users.filter((users) => users.name !== user.name) 
// 	this.server.emit('newUserResponse', this.users);
// 	this.logger.debug(`Client disconnected: ${client.id}`);
// 	this.logger.debug(`Number of sockets connected: ${this.server.sockets.sockets.size}`)
// }

// @SubscribeMessage('newUser')
// onNewUser(@MessageBody() body: any) {
// 	this.users.push(body);
// 	// this.logger.log(body);
// 	this.server.emit('onNewUser', this.users);
// }