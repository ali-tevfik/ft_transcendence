import { useSocket } from "../../../contexts/SocketContext/provider";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";
import { BlockButton } from "./buttonBlock";
import { UnBlockButton } from "./buttonUnBlock";
import { AddAdminButton } from "./buttonAddAdmin";
import { useState } from "react";
import { FormAddMember } from "./formAddMember";
import { DmRoomUser, Member, RoomType, RoomUser, UserRole } from "../../../contexts/ChatContext/types";
import { useUser } from "../../../contexts";

type Props = {
    selectedMember: Member | null,
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const UserInfo = ({ selectedMember, setSelectedMember }: Props) => {
    const { socket } = useSocket();
    const { user } = useUser();
	const { dmRooms, setDmRooms, createDmRoom, members, room: RoomUser, setRoom } = useChat();
    // const { room: RoomUser, setRoom } = useSocket();
    const room = RoomUser as DmRoomUser;

	const openConversation = async(userName: string) => { // clicking on your onw name??
		const dmRoom = dmRooms.find(dmRoom => dmRoom.contact === userName);
		if (dmRoom) {
			setRoom(dmRoom);
		} else {
			const newDmRoom = await createDmRoom(userName);
			setRoom(newDmRoom);
		};
	}
// console.log(room)
	return (
		<>
			User Information
            {selectedMember &&
                <button onClick={() => setSelectedMember(null)}>back</button>
            }
            <div>
                {selectedMember?.userName}
                {room.contact}
            </div>
            {selectedMember && selectedMember.userName !== user.userName &&
                <button onClick={() => openConversation(selectedMember.userName)}>open conversation</button>
            }
			
		</>
	)
}








// useEffect(() => {
// 	function onMemberStatus(members: Member[]) {
// 		members.sort((a, b) => a.userName.localeCompare(b.userName))
// 		setMembers(members);
// 	};
	
// 	function onUserStatus() { // have to change this
// 		socket.emit('getMemberStatus', room)
// 	};

// 	socket.on('memberStatus', onMemberStatus);
// 	socket.on('userStatus', onUserStatus);		
// 	return () => {
// 		socket.off('memberStatus');
// 		socket.off('userStatus');
// 	}
// }, [room, socket])