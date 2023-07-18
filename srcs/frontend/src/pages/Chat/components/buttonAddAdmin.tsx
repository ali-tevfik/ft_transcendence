// import { Member, UserRole } from "../chat.types";
// import { useChat } from "../chat.provider";
// import { useSocket } from "../../../contexts/SocketProvider";
import { Member, UserRole, useChat } from "../../../contexts/ChatContext";
import { useSocket } from "../../../contexts/SocketContext";

export const AddAdminButton: React.FC<{ member: Member }> = ({ member }) => {
  const { socket } = useSocket();
  const { room, updateRoomUser } = useChat();

  async function handleClick(e: React.MouseEvent, member: Member) {
    e.stopPropagation();

    await updateRoomUser({
      ...member,
      userRole: UserRole.ADMIN,
    });

    socket.emit('memberUpdate', room.roomName);
  };

  return (
    <button onClick={(e) => handleClick(e, member)}>Admin+</button>
  )
}
