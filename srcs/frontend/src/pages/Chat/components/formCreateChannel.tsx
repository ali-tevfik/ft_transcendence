import { useState } from "react"
import { Room, RoomType, RoomUser } from "../../../contexts/ChatContext/types";
import axios from "axios";
// import { useUser } from "../../../contexts/UserProvider";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";

type createChannelProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormCreateChannel = ({ setPopupVisibility }: createChannelProps) => {
	const [type, setType] = useState<RoomType>(RoomType.PUBLIC);
	const [roomName, setRoomName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { user } = useUser();
	const { URL } = useSocket();
	const { setRoom, setChatRooms } = useChat();

	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();

		const newChatRoom: Room = {						// add description? i am setting it...
			roomName: roomName,							// add admins or members here?
			type: type,									//user need to have Name filled in!!!
			userName: user.userName,
			password: password,
		};
		
		try {
			const response = await axios.post(`${URL}/chat/channel`, newChatRoom)
			setChatRooms(prevRooms => [...prevRooms, response.data])
			setRoom({...response.data, userRole: 'owner'});
			setPopupVisibility(false);
		} catch (error) {
			// alert('Chat room already exists. Please choose a different name.');
			alert(error);
		}
	}
	
	return (
		<>
			<form onSubmit={handleSubmit}>
				Create New Channel 
				<button 
					type="button" 
					onClick={() => setPopupVisibility(false)}>
					X
				</button>
				<div>
					<label htmlFor="type">Type</label>
						<select id="type" onChange={(e) => setType(e.target.value as RoomType)}>
							<option value={RoomType.PUBLIC}>public</option>
							<option value={RoomType.PRIVATE}>private</option>
							<option value={RoomType.PROTECTED}>protected</option>
					</select>
				</div>
				<div className="popup-input">
					<input
						placeholder="name" 
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}/> 
				</div>
				<div>
					<textarea 
						rows={4}
						placeholder="optional: description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}/>
				</div>
				{type === 'protected' && (
					<div>
						<input 
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}/>
					</div>
				)}
				<button type="submit">CREATE</button>
			</form>
		</>
	)
}
