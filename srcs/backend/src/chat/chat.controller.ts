import { Post, Body, Controller, Get, Param, Delete, Put } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RoomDto } from 'src/dto/room.dto';
import { MessageDto } from 'src/dto/message.dto';
import { UserRole } from 'src/typeorm/roomUser.entity';
import { RoomType } from 'src/typeorm/room.entity';
import { RoomUserDto } from 'src/dto/roomUser.dto';

@Controller('chat')
export class ChatController {

	constructor(private chatService: ChatService) {}

	@Post('channel') 
	async createChatRoom(@Body() chatRoom: RoomDto): Promise<RoomUserDto> {
		return await this.chatService.createChatRoom(chatRoom);
	}

	@Post('contact')
	async createDmRoom(@Body() dmRoom: RoomDto): Promise<RoomUserDto> {
		const newDmRoom = await this.chatService.createDmRoom(dmRoom.roomName);
		return await this.chatService.addDmRoomUser(newDmRoom, dmRoom.member);
	}

	@Post('roomuser/:roomName/:userName/:userRole')
	async addChatRoomUser(
		@Param('roomName') roomName: string, 
		@Param('userName') userName: string, 
		@Param('userRole') userRole: UserRole): Promise<RoomUserDto> {
		return await this.chatService.addChatRoomUser(roomName, userName, userRole);
	}

	@Put('room')
	async UpdateRoom(@Body() updatedRoom: RoomDto): Promise<void> {
		return await this.chatService.updateRoom(updatedRoom);
	}

	@Put('roomuser/:roomName/:userName')
	async UpdateRoomUser(
		@Param('roomName') roomName: string,
		@Param('userName') userName: string,
		@Body() updatedRoomUser: RoomUserDto): Promise<RoomUserDto[]> {
		await this.chatService.updateRoomUser(roomName, userName, updatedRoomUser);
		return await this.chatService.getRoomMembers(roomName);
	}

	// @Put('roomuser/:roomName/:userName')
	// async UpdateRoomUserUnread(
	// 	@Param('roomName') roomName: string,
	// 	@Param('userName') userName: string,
	// 	@Body() updatedRoomUser: RoomUserDto): Promise<RoomUserDto[]> {
	// 	await this.chatService.UpdateRoomUserDetails(roomName, userName, updatedRoomUser);
	// 	return await this.chatService.getRoomUsers(roomName);
	// }

	@Put('remove/:roomName/:userName/:type')
	async removeRoomUserLinks(
		@Param('roomName') roomName: string,
		@Param('userName') userName: string,
		@Param('type') type: RoomType): Promise<RoomUserDto[]> {
		await this.chatService.removeRoomUser(roomName, userName);
		if (type === RoomType.DIRECTMESSAGE) {
			return await this.chatService.getUserDmRooms(userName);
		} else {
			return await this.chatService.getUserChatRooms(userName);
		}
	}

	// @Put('remove/contact/:roomName/:userName/')
	// async removeContact(
	// 	@Param('roomName') roomName: string,
	// 	@Param('userName') userName: string): Promise<RoomUserDto[]> {
	// 	await this.chatService.removeRoomUser(roomName, userName);
	// 	return await this.chatService.getUserDmRooms(userName);
	// }

	@Post('password')
	async checkPassword(@Body() room: RoomDto): Promise<boolean> {
		return await this.chatService.checkPassword(room);
	}
	
	@Get('generalchat/:userName')
	async getDefaultChatRoomUser(@Param('userName') userName: string): Promise<RoomUserDto> {
		return await this.chatService.getDefaultChatRoomUser(userName);
	}

	@Get('public')
	async getAllPublicChatRooms(): Promise<RoomDto[]> {
		return await this.chatService.getAllPublicChatRooms();
	}
	
	@Get('channels/:userName')
	async getUserChatRooms(
		@Param('userName') userName: string): Promise<RoomUserDto[]> {
		return await this.chatService.getUserChatRooms(userName);
	}

	@Get('contacts/:userName')
	async getUserDmRooms(
		@Param('userName') userName: string): Promise<RoomUserDto[]> {
		return await this.chatService.getUserDmRooms(userName);
	}
		
	@Get('messages/:roomName')
	async getRoomMessages(
		@Param('roomName') roomName: string): Promise<MessageDto[]> {
		return this.chatService.getRoomMessages(roomName);
	}

	@Get('members/:roomName')
	async getRoomMembers(
		@Param('roomName') roomName: string
	): Promise<RoomUserDto[]> {
		return await this.chatService.getRoomMembers(roomName);
	}
	
	@Delete(':id')
	delete(@Param('id') id: number) {
		return this.chatService.deleteRoom(id);
	}	
}

// @Put('unsubscribe/:room/:user/:role')
// leaveRoom(
// 	@Param('room') room: string,
// 	@Param('user') user: string,
// 	@Param('role') role: string
// ) {
// 	this.chatService.leaveRoom(room, user, role);
// }


// @Put('admin/:user/:room')
// addAdmin(
// 	@Param('user') user: string,
// 	@Param('room') room: string) {
// 	this.chatService.addAdmin(user, room);
// }

// @Get('exists/:room')
// async checkRoomExists(@Param('room') room: string): Promise<boolean> {
// 	return await this.chatService.checkRoomExists(room);
// }