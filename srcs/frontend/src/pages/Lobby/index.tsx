import { useState, ChangeEvent, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Settings } from './components/SettingsModal'
import { useSocket } from "../../contexts"
import * as Components from './containers';
import React from "react";
import SoloImg from './assets/single.png';
import MultiImg from './assets/multi.png';
import { PlusIcon } from "./assets/PlusIcon"
import { CloseIcon } from "./assets/CloseIcon"

export function Lobby() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false)
  const [settings, toggle] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);



  return (
    <Components.Container>
      {settings ? (
        <Components.OfflineContainer settings={settings}>
          <Components.Card>
          <Settings isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
            <Components.TopCard>
              <img src={SoloImg} alt="Solo" className='img1'/>
              <Link to='/solo' className='games1'>SOLO</Link>
            </Components.TopCard>
            <Components.BottomCard>
              <img src={MultiImg} alt="Multi" className='img2'/>
              <Link to='/multiplayer' className='games2'>MULTIPLAYER</Link>
            </Components.BottomCard>
          </Components.Card>
        </Components.OfflineContainer>
      ) : (
        <Components.OnlineContainer settings={settings}>
          {/* <WaitingPage isOpen={isLookingForOpponent} setIsOpen={setIsLookingForOpponent} /> */}
          <Components.Card>

            <Link to='/findingopponentClassic' className='mylink1'>CLASSIC GAME</Link>
            <Link to='/findingopponentCustom' className='mylink2'>CUSTOM GAME</Link>
            
            {/* add hereee */}
            {!isOpen && (
              <button onClick={handleOpen} className='flap'>
                Invite a Friend
              </button>
            )}
            {isOpen && (
              <div className='popup'>
                  <input className='box' type="text" value={username} onChange={handleChange} placeholder="Username"/>
                  <Link to={{ pathname: '/waitingreply', search: `?username=${username}`}} className='add'>
                    <PlusIcon />
                  </Link>
                <button className='close' onClick={handleClose} >
                  <CloseIcon />
                </button>
                
              </div>
            )}
            
            {/* <Link to='/invitation' className='button'>Random Game</Link> */}
            {/* <Components.Button onClick={handleRandomGame}>Random Game</Components.Button> */}
            {/* <Components.Button onClick={handleInvitation}>Invite a Friend</Components.Button> */}
          </Components.Card>
        </Components.OnlineContainer>
      )}
  
      <Components.OverlayContainer settings={settings}>
        <Components.Overlay settings={settings}>
          <Components.LeftOverlayPanel settings={settings}>
            <Components.GhostButton onClick={() => toggle(true)}>
              play offline
            </Components.GhostButton>
          </Components.LeftOverlayPanel>
  
          <Components.RightOverlayPanel settings={settings}>
            <Components.GhostButton onClick={() => toggle(false)}>
              play online
            </Components.GhostButton> 
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
  
    // <div className='lobby'>
    //   <div className='containerlobby'>
    //   {/* <h1>...</h1> */}
    //     <div className='left-column'>
    //       <div className='avatar'>avatar</div>
    //       <div className='avatar'>score</div>
    //       <Link to='/solo' className='button-73'>SOLO</Link>
    //       <Link to='/multiplayer' className='button-73'>MULTIPLAYER</Link>
    //     </div>
    //     <div className='right-column'>
    //       <button className="button-74" onClick={handleRandomGame}>
    //         Random Game
    //       </button>
    //       <button className="button-74" onClick={handleInvitation}>
    //         Invite a Friend
    //       </button>
    //     </div>
    //   </div>
    //   <Settings isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
    // </div>
  // );
}







