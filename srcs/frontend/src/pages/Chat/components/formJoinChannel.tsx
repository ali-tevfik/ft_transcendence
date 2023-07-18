import { useEffect, useState } from "react"
import { ChatRoomUser, Room, RoomType, RoomUser, UserRole } from "../../../contexts/ChatContext/types"
import axios from "axios"
import { useSocket } from "../../../contexts/SocketContext/provider"
// import { useUser } from "../../../contexts/UserProvider"
import { ClickableList } from "./clickableList"
import { useChat } from "../../../contexts/ChatContext/provider"
import { useUser } from "../../../contexts"

type Props = {
	setPopupVisibility: (value: React.SetStateAction<boolean>) => void,
}

export const FormJoinChannel = ({ setPopupVisibility }: Props) => {
    const [joinableRooms, setJoinableRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [isProtected, setIsProtected] = useState<boolean>(false);
    const [value, setValue] = useState<string>('')
    const { URL } = useSocket();
    const { user } = useUser();
    const { setRoom, chatRooms, setChatRooms, fetchAllPublicRooms, addRoomUser } = useChat();
        
    useEffect(() => { // do same as contact with gateway?
        const getJoinableRooms = async() => {
            const allPublicRooms = await fetchAllPublicRooms();
            const filteredRooms = allPublicRooms
                .filter(room => !chatRooms.some(userRoom => userRoom.roomName === room.roomName)) // also weird   
            setJoinableRooms(filteredRooms);
        };
    	getJoinableRooms();
    },[])

    const joinRoom = async(room: Room) => {
        const newRoomUser = await addRoomUser(room.roomName, user.userName);
        setChatRooms(prevRooms => [...prevRooms, newRoomUser]);
        setRoom(newRoomUser);
        setPopupVisibility(false);
    }

    const handleRoomListClick = (room: Room) => {
        if (room.type === RoomType.PROTECTED) {
            setSelectedRoom(room);
            setIsProtected(true);
        } else {
            joinRoom(room);
        }
    }

    const handlePasswordSubmit = async(e: React.FormEvent) => { //make try catch block
        e.preventDefault();
        if (selectedRoom) {
            const response = await axios.post('http://localhost:8080/chat/password', {
                roomName: selectedRoom.roomName,
                type: RoomType.PROTECTED, // is necessary for RoomDto, make another for this?
                password: value
            })
            if (response.data === false) {
                alert('incorrect password, try again');
                setValue('');
            } else {
                joinRoom(selectedRoom);
            }
        }
    }

    return (
        <>
            Join existing channel
            <ClickableList
                items={joinableRooms}
                renderItem={room => <p className="roomListBtn">{room.roomName} - {room.type}</p>}
                onClickItem={room => handleRoomListClick(room)}
            />
            {isProtected && 
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        placeholder="password"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        />
                    <button>SUBMIT</button>
                </form>
            }
        </>
    )
}

        // const response = await axios.post(`${URL}/chat/roomuser/${room.roomName}/${user.userName}/${UserRole.MEMBER}`);
