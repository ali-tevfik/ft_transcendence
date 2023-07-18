import axios from "axios";
import { useSocket } from "../../../contexts/SocketContext/provider"
import { DmRoomUser, GENERAL_CHAT, RoomType, RoomUser } from "../../../contexts/ChatContext/types";
// import { useUser } from "../../../contexts/UserProvider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";

type Props = {
	expanded: boolean,
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatHeader = ({ expanded, setExpanded }: Props) => {
  const { URL, socket } = useSocket();
	const { user } = useUser();
	const { room, setRoom, setDmRooms, setChatRooms } = useChat();

	const handleLeaveRoom = async() => {
		const response = await axios.put(`${URL}/chat/remove/${room.roomName}/${user.userName}/${room.type}`);
		if (room.type === RoomType.DIRECTMESSAGE) {
			setDmRooms(response.data);
		} else {
			setChatRooms(response.data)
		};
	
		// also emit event leave room??
		socket.emit('newMessage', {
			userName: user.userName,
			content: `left the chat...`,
			roomName: room.roomName,
		});

		socket.emit('memberUpdate', room.roomName);
		// socket.emit('leaveRoom')!!!!!!!!!!!
		// setRoom(GENERAL_CHAT);
	}

	function isDmRoomUser(room: RoomUser): room is DmRoomUser {
		return room.type === RoomType.DIRECTMESSAGE;
	}
	
	return (
		<div id="chat-header">
			<a className="roomBtn" onClick={() => setExpanded(!expanded)}>
				{isDmRoomUser(room) ? room.contact : `${room.roomName}`}
			</a>
			{room.roomName !== GENERAL_CHAT &&
				<button className="leaveChat-btn" onClick={handleLeaveRoom}>
					{room.type !== RoomType.DIRECTMESSAGE ? "LEAVE CHANNEL" : "LEAVE CONVERSATION"}
				</button>
			}
		</div>
	)
}
