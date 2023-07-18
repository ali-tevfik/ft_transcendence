import { useState } from "react";
// import { useUser } from "../../../contexts/UserProvider";
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat, useUser } from "../../../contexts";

export function MessageInput(){
  const [message, setMessage] = useState<string>('');
  const { user } = useUser()
  const { socket } = useSocket();
  const { room } = useChat();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    socket.emit('newMessage', {
        userName: user.userName,
        content: message,
        roomName: room.roomName,
    });
    
    setMessage('');
  }

  return (
    <div id="chat-footer">
    <form
        className="form" 
        onSubmit={handleSendMessage}>
        <input 
          type="text"
          placeholder="Write message"
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}>
        </input>
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  )
}
