import { useEffect, useState } from "react";
// import { useUser } from "../../../contexts/UserProvider";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { User, useUser } from "../../../contexts";
// import { User } from "../chat.types";

type addContactProps = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormAddMember = ({ setPopupVisibility }: addContactProps) => {
	const [unknowMembers, setUnknownMembers] = useState<User[]>([]);
	const { allUsers, members, addRoomUser } = useChat();
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const { socket } = useSocket();
	const { user } = useUser();
	const { room } = useChat();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(users => !members.some(member => member.userName === users.userName))
		.filter(users => users.userName !== user.userName) // filter out my username in provider?
		
		setUnknownMembers(filteredUsers);
	},[allUsers])

	const handleCheckBoxChange = (userName: string, isChecked: boolean) => {
		if (isChecked) {
			setSelectedUsers(prev => [...prev, userName])
		} else {
			setSelectedUsers(prev => prev.filter(user => user !== userName))
		}
	};

  const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		
		for (const userName of selectedUsers) {
			const newRoomUser = await addRoomUser(room.roomName, userName);
		};

		socket.emit('memberInvite', selectedUsers);
		socket.emit('memberUpdate', room.roomName);
		setPopupVisibility(false);
  }

	return (
		<form onSubmit={handleSubmit}>
			Invite Member
			<button type="button" onClick={() => setPopupVisibility(false)}>
				X
			</button>
      {unknowMembers.map((user, index) => (
        <div key={index}>
					<p className={`roomListBtn ${user.status === 'online' ? 'online' : 'offline'}`}>
						<input
							type="checkbox"
							onChange={(e) => handleCheckBoxChange(user.userName, e.target.checked)}
						/>
						{user.userName}
					</p>
        </div>
      ))}
			<div>
				<button type="submit">ADD</button>
			</div>
		</form>
	)
}
