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

export const FormAddContact = ({ setPopupVisibility }: addContactProps) => {
	const [unknowContacts, setUnknownContacts] = useState<User[]>([]);
	const { setRoom, allUsers, dmRooms, createDmRoom } = useChat();
	const { socket } = useSocket();
	const { user } = useUser();
	
	useEffect(() => {
		const filteredUsers = allUsers
		.filter(contact => !dmRooms.some(room => room.contact === contact.userName))
		.filter(contact => contact.userName !== user.userName)
		
		setUnknownContacts(filteredUsers);
	},[allUsers])

	const handleClick = async(newContact: User) => { // prevent e.default()?
		const newDmRoom =  await createDmRoom(newContact.userName);
		setRoom(newDmRoom);
		setPopupVisibility(false);
	}

	return (
		<>
			Add Contact
			<button 
				type="button" 
				onClick={() => setPopupVisibility(false)}>
				X
			</button>
			<ClickableList
				items={unknowContacts}
				renderItem={(newContact) => (
					<p className={`roomListBtn ${newContact.status === 'online' ? 'online' : 'offline'}`}>
						{newContact.userName} : {newContact.status}
					</p>
				)}
				onClickItem={(newContact) => handleClick(newContact)}
			/>
		</>
	)
}

