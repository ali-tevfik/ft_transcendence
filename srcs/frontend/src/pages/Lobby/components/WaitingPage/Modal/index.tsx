import { ReactNode } from 'react'
import { CloseIcon } from '../../../assets'
import './styles.css'
import { Button } from '../Button'
import { useSocket } from "../../../../../contexts/SocketContext"

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Modal({ children, isOpen, setIsOpen }: ModalProps) {

  const { socket } = useSocket();

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
    >
      <div onClick={(e) => e.stopPropagation()} className='modal-content'>
        <Button
          icon={<CloseIcon />}
          className='close-button'
          onClick={() => {
            console.log('cancel');
            socket.emit('cancelMatching');
            setIsOpen(false);
          }}
        />
        {children}
      </div>
    </div>
  )
}