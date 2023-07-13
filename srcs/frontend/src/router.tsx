import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider, GameProvider, UserContext } from './contexts';
import { GameMode, gameModes } from './pages/Game/logic/types'
import { Game, Lobby, Home, Chat, Login } from './pages'
import { SocketProvider } from './contexts/SocketContext/provider';
import { Nav, Friends } from './components';


export function Router() {

    return (
      <BrowserRouter>
        <UserProvider>
          <SocketProvider>
            <Nav />
            <Routes>
              <Route path='/home' element={<Home />} />
              <Route path='/' element={<Home />} />
              <Route path='/friends' element={<Friends />} />
              <Route path='/login' element={<Login />} />
              <Route path='/friend' element={<Friends />} />
              <Route path='/lobby' element={<Lobby />} />
              <Route path='/chat' element={<Chat />} />
              {/* <Route path='/chat' element={<Chat />} /> */}
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
        </UserProvider>
      </BrowserRouter>
    )

}