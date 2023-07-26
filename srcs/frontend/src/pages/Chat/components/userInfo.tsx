import { useChat } from "../../../contexts/ChatContext/provider";
import { Member, RoomType } from "../../../contexts/ChatContext/types";
import { useUser } from "../../../contexts";
import { useSetupDmConversation } from "./hookSetupDm";
import { BlockButton } from "./buttonBlock";
import { useEffect } from "react";
import { MdKeyboardReturn } from "react-icons/md"
import { BsChatRightText } from "react-icons/bs"
import { PiGameControllerDuotone } from "react-icons/pi"

type Props = {
  selectedMember: Member | null,
	setSelectedMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const UserInfo = ({ selectedMember, setSelectedMember }: Props) => {
  const { user } = useUser();
	const { myRooms, room, setRoom, members } = useChat();
	// const [gameType, setGameType] = useState<GameType
	const setupDmConversation = useSetupDmConversation();

	const openConversation = async(member: Member) => {
		const existingRoom = myRooms.find(room => room.contactName === member.userName);
		if (existingRoom) {
			setRoom(existingRoom);
		} else {
			await setupDmConversation(member);
		}
	}

	useEffect(() => {
		if (room.type === RoomType.DIRECTMESSAGE) {
			const contact = members.find(member => member.userName !== user.userName);
			if (contact) {
				setSelectedMember(contact);
				// console.log('yes')
			} else {
				setSelectedMember(null);
				// console.log('no')
			}
		}
	}, [members])

	return (
		<>
			{room.type !== RoomType.DIRECTMESSAGE &&
        <button className="iconBtn" onClick={() => setSelectedMember(null)}>
					<MdKeyboardReturn size="2em"/>
				</button>
			}
			<div />
			{selectedMember &&
			<img src={selectedMember.avatar} style={{margin:10,width:190, height:150, borderRadius:10}}/>
			}
			<div />
			{selectedMember && 
				selectedMember.userName !== user.userName &&
				<BlockButton member={selectedMember}/>
			}
			{selectedMember?.userName}
			{selectedMember 
				&& selectedMember.userName !== user.userName 
				&& room.type !== RoomType.DIRECTMESSAGE 
				&& 
				<>
					<button className="iconBtn" onClick={() => openConversation(selectedMember)}>
					<BsChatRightText size="2em"/>
						message
					</button>
					<button className="iconBtn" onClick={() => }>
					<PiGameControllerDuotone size="2em" />
					</button>
				</>
			}
		</>
	)
}
