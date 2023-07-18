import { useState } from "react";
import { FormAddContact } from "./formAddContact";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { ClickableList } from "./clickableList";
import { useChat } from "../../../contexts/ChatContext/provider";

export const DirectMessages = () => {
	const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
    // const { setRoom } = useSocket();
    const { setRoom, dmRooms } = useChat();
    
    return (
        <>
			<h3>
                Direct Messages
                <button onClick={() => setPopupVisibility(true)}>
                    + 
                </button>
            </h3>
            <ClickableList
                items={dmRooms}
                renderItem={room => 
                    <p className="roomListBtn">
                        {room.contact}
						{room.unreadMessages > 0 && ` ${room.unreadMessages}`}
                    </p>}
                onClickItem={room => setRoom(room)}
                />
            {popupVisibility && (
                <div className="chat-popup">
                    <FormAddContact setPopupVisibility={setPopupVisibility} />
                </div>
			)}
        </>
    )
}





// useEffect(() => {
//     function onNewDMessage(newDmRoom: DmRoomUser) { //should i join them to room in server for unread messages?
//         if (!dmRooms.find(roomUser => roomUser.contact === newDmRoom.userName))
//             setDmRooms(prev => [...prev, newDmRoom]);
//     };

//     socket.on('newDMessage', onNewDMessage);
//     return () => {
//         socket.off('newDMessage');
//     }
// },[socket, user]);