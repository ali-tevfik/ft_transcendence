import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "../UserContext/provider";
import { ChatRoomUser, DmRoomUser, Room, RoomType, RoomUser, UserRole } from "../ChatContext/types";
import { UserContext } from '..';


export const GENERAL_CHAT = {
	roomId: 1,
	roomName: 'Transcendence',
	unreadMessages: 0,
	type: RoomType.PUBLIC,
	userRole: UserRole.MEMBER,
}

type SocketContextValue = {
	URL: string,
	socket: Socket,
	isConnected: boolean,
	room: RoomUser,
	setRoom: React.Dispatch<React.SetStateAction<RoomUser>>,
}

const URL = 'http://localhost:3001';
const socket = io(URL, { autoConnect: false });
const SocketContext = createContext({} as SocketContextValue);

export function useSocket() {
	return useContext(SocketContext);
}

export function SocketProvider({ children }: {children: ReactNode}) {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [room, setRoom] = useState<RoomUser>(generalchat())//GENERAL_CHAT);
	const { user } = useUser();

    // const {user} = useContext(UserContext)
		function generalchat() {
			return {
				roomId: 1,
				roomName: 'Transcendence',
				unreadMessages: 0,
				type: RoomType.PUBLIC,
				userRole: UserRole.MEMBER,
			}
		}
		
		useEffect(() => {
			if(isConnected) // not necessary in final product?
			socket.disconnect();
			if(user.userName !== 'unknown') {
			// console.log(user);
			socket.auth = { name: user.userName };
			socket.connect();
		}
		setRoom(GENERAL_CHAT);
	}, [user])

	useEffect(() => {
		function onConnect() {
			console.log('connected', socket)
		  	setIsConnected(true);
			socket.emit('joinRoom', room)
		}
	
		function onDisconnect() {
			console.log('disconnected', socket)
		  	setIsConnected(false);
		}

		// function onUserId(id: number) {
			// console.log('userId', id);
			// socket.emit()
		// }
		
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		// socket.on('userId', onUserId);
	
		return () => {
		  	socket.off('connect', onConnect);
		  	socket.off('disconnect', onDisconnect);
			// socket.off('userId');
		 	socket.disconnect();
		};
	}, [user]);

	useEffect(() => {
		socket.emit('joinRoom', room) // join all rooms in loop, and then only in joining a new room so this runs only 1 time
	}, [room])

	const value = {
		URL,
		socket,
		isConnected,
		room,
		setRoom,
	}

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}