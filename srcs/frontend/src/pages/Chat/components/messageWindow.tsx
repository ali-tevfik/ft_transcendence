import { useEffect, useRef, useState } from "react"
import { Message, RoomType } from "../../../contexts/ChatContext/types"
import { useSocket } from "../../../contexts/SocketContext/provider";
import { useChat } from "../../../contexts/ChatContext/provider";
import { useUser } from "../../../contexts";

export const MessageWindow = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useSocket();
  const { user } = useUser();
  const { room, blocked, messages, setMessages, handleUnreadMessage } = useChat();

  useEffect(() => {
    const onMessage = (newMessage: Message) => {
      const isBlocked = blocked
        .some(blocked => blocked.userName === newMessage.userName);
      if (!isBlocked && newMessage.roomName === room.roomName) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } else {
        handleUnreadMessage(newMessage.roomName);
      }
    };
    socket.on('onMessage', onMessage);
    return () => {
      socket.off('onMessage');
    }
  }, [room, socket, user, blocked])

  useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return ( // change appearance of chat and dm messages
    <div id="chat-window">
      <div id="chat-container">
        {messages.map((message) => 
          message.userName === user.userName ? (
            <div className="message-chats" key={message.id}>
              <p className="sender-name">You</p>
              <div className="message-sender">
                <p>{message.content}</p>
              </div>
            </div>
          ) : (
            <div className="message-chats" key={message.id}>
              <p>{message.userName}</p>
              <div className="message-recipient">
                <p>{message.content}</p>
              </div>
            </div>
          )
        )}
        <div ref={lastMessageRef} />
      </div>
    </div>
  )
}
