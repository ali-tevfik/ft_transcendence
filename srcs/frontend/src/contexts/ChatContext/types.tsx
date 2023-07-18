import { User } from "../UserContext";

export const GENERAL_CHAT = 'Transcendence'

export enum RoomType {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected',
	DIRECTMESSAGE = 'directmessage',
}

export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}

export type Message = {
	id: number,
	userName: string,
	content: string,
	roomName: string,
}

export type Room = { //newRoom?
	roomId?: number;
	roomName: string;
	type: RoomType;
	userName?: string;
	description?: string;
	member?: string[];
	password?: string;
}
	
// Base RoomUser type
export type RoomUser = {
	roomId: number;
	roomName: string;
	type: RoomType;
	unreadMessages: number;
};

// Base User type
// export type User = {
// 	id: number;
// 	userName: string;
// 	status: string;
// 	avatar: string;
// 	intraId: string;
// };

// UserRoles type
export type RoomUserDetails = {
	userRole: UserRole;
	isMuted: boolean;
	isKicked: boolean;
	isBanned: boolean;
};

// Specific RoomUser types
export type ChatRoomUser = RoomUser & RoomUserDetails;
export type DmRoomUser = RoomUser & { contact: string, userName: string};

// Member type
export type Member = User & RoomUserDetails;