// import { SettingsIcon } from '../../assets'
// import { Button } from './Button'
import { Modal } from './Modal'
// import { WaitingPage } from './'

type ModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function WaitingPage({ isOpen, setIsOpen }: ModalProps) {
  return (
    <>
      {/* <Button icon={<SettingsIcon />} onClick={() => setIsOpen(true)} /> */}

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        looking for a opponent
      </Modal>
    </>
  )
}
