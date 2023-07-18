import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider, GameProvider, UserContext } from './contexts';
import { GameMode, gameModes } from './pages/Game/logic/types'
import { Game, Lobby, Home, Chat, Login } from './pages'
import { SocketProvider } from './contexts/SocketContext/provider';
import { Friends } from './components';
import SettingsPage from './pages/SettingsPage'
import Create2fa from './pages/Create2fa'
import Verify2fa from './pages/Verify2fa'
import Navbar from './components/Nav/navBar';
import SideBar from './components/Nav/sideBar';
import React, { useContext } from 'react';
import './components/Nav/main.css';
import { Random } from './pages/Game/components/Online/index'


export function Router() {
  const {user} = useContext(UserContext)
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
                <SocketProvider>
                  <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/friends' element={<Friends />} />
                    <Route path='/friend' element={<Friends />} />
                    <Route path='/lobby' element={<Lobby />} />
                    <Route path='/chat' element={  <Chat/>} />
                    <Route path='/settings' element={  <SettingsPage/>} />
                    <Route path='/create2fa' element={  <Create2fa/>} />
                    <Route path='/verify2fa' element={  <Verify2fa/>} />
                    {/* <Route path='/chat' element={<Chat />} /> */}

                    <Route path='/random' element={<Random />} />
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
          </div>
        </div>
      </section>
      </UserProvider>
            </BrowserRouter>
    </React.Fragment>
  )

}