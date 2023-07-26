import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider, GameProvider, UserContext, ChatProvider, SettingsProvider } from './contexts';
import { GameMode, gameModes } from './pages/Game/logic/types'
import { Game, Lobby, Home, Chat, Login } from './pages'
import { SocketProvider } from './contexts/SocketContext/provider';
import { Friends } from './components';
import SettingsPage from './pages/SettingsPage'
import Create2fa from './pages/Create2fa'
import Verify2fa from './pages/Verify2fa'
import Navbar from './components/Nav/navBar';
import SideBar from './components/Nav/SideBar/sideBar';
import React, { useContext } from 'react';
import './components/Nav/main.css';
import { Random, FriendGame } from './pages/Game/components/Online/index'
import { WaitingPage1, WaitingPage2, WaitingPage3 } from './pages/Lobby/components/WaitingPage';


export function Router() {
  return (
    <React.Fragment>
            <BrowserRouter>
              <UserProvider>

      <section>
        <div className='NavContent'>
          <Navbar />
        </div>
      </section>
      <section>
        <div className='FullPage'>
          <div className='SideContent'>
            <SideBar />
          </div>
          <div className='MainContent'>
                <SettingsProvider>
                <SocketProvider>
                  <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/friend' element={<Friends />} />
                    <Route path='/lobby' element={<Lobby />} />
                    <Route 
                      path='/chat' 
                      element={
                        <ChatProvider>
                          <Chat />
                        </ChatProvider>
                      }
                    />
                    <Route path='/settings' element={  <SettingsPage/>} />
                    <Route path='/create2fa' element={  <Create2fa/>} />
                    {/* <Route path='/verify2fa' element={  <Verify2fa/>} /> */}
                    {/* <Route path='/chat' element={<Chat />} /> */}
                    <Route path='/random' element={<Random />} />
                    <Route path='/friendgame' element={<FriendGame />} />
                    <Route path='/findingopponentClassic' element={<WaitingPage1 />} />
                    <Route path='/findingopponentCustom' element={<WaitingPage3 />} />
                    <Route path='/waitingreply' element={<WaitingPage2 />} />
                    {gameModes.map((mode: GameMode) => (
                      <Route
                        key={mode}
                        path={`/${mode}`}
                        element={
                          <GameProvider>
                            <Game gameMode={mode} />
                          </GameProvider>
                        }
                      />
                    ))}
                  </Routes>
                </SocketProvider>
                </SettingsProvider>
          </div>
        </div>
      </section>
      </UserProvider>
            </BrowserRouter>
    </React.Fragment>
  )

}