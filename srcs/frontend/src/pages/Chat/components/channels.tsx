import { useState } from "react"
import { useSocket } from "../../../contexts/SocketContext/provider";
import { FormCreateChannel } from "./formCreateChannel";
import { FormJoinChannel } from "./formJoinChannel";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";

export const Channels = () => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
	// const { setRoom } = useSocket();
	const { setRoom, chatRooms } = useChat();
	
	return (
		<>
			<div>
				<h3>
					Channels
					<button onClick={() => setPopupVisibility(true)}>+</button>
				</h3>
			</div>
			<ClickableList
				items={chatRooms}
				renderItem={room => 
					<p className="roomListBtn">
						{room.roomName}
						{
  						room.unreadMessages > 0
    					? room.unreadMessages < 10
      				? ` [${room.unreadMessages}]`
      				: ` [9+]`
    					: ""
						}
					</p>
				}
				onClickItem={room => setRoom(room)}
				/>
			{popupVisibility && (
				<div className="chat-popup">
					<FormCreateChannel
						setPopupVisibility={setPopupVisibility}
					/>
					<FormJoinChannel
						setPopupVisibility={setPopupVisibility}
					/>
				</div>
			)}
		</>
	)
}
