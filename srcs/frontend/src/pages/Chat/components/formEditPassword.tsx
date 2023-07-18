import { useState } from "react";
import { useSocket } from "../../../contexts/SocketContext/provider"
import { useChat } from "../../../contexts/ChatContext/provider";
import { Room, RoomType } from "../../../contexts/ChatContext/types";

export const FormEditPassword = () => {
  const [visibility, setVisibility] = useState<Boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  // const { room } = useSocket();
  const { room, updateRoom } = useChat();

  const handleRemovePassword = () => {
    updateRoom({
      roomId: room.roomId,
      roomName: room.roomName,
      type: RoomType.PUBLIC,
    });
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === repeatPassword) {
      updateRoom({
        roomId: room.roomId,
        roomName: room.roomName,
        type: RoomType.PROTECTED,
        password: newPassword, // HASH
      })
      setVisibility(false);
    } else {
      alert('password does not match, please try again');
      setNewPassword('');
      setRepeatPassword('');
    }
  }

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        {room.type === RoomType.PROTECTED ? (
          <>
            <button type="button" onClick={() => setVisibility(!visibility)}>Edit Password</button> 
            <button onClick={handleRemovePassword}>Remove Password</button>
          </>
        ) : (
          <button onClick={() => setVisibility(true)}>Add Password</button>
        )
        }
        {room.type} 
        {visibility &&
        <div className="chat-popup">
          <div>
            <input
              placeholder="type in new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              />
          </div>
          <div>
            <input
              placeholder="repeat password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
          <button type="submit">submit</button>
        </div>
        }
      </form>
     
    </>
  )
}