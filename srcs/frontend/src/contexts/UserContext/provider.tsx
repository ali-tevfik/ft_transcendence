import { createContext, useState, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from "react";
import { UserRole } from "../ChatContext";
import axios from "axios";
import { Navigate } from 'react-router-dom'
import { Login } from "../../pages";
import Validate2faPage from '../../pages/Login/auth'

export type User = {
  userName: string;
  avatar: string;
  intraId: string;
  status: string,
  userRole?: string,
  isLogged: boolean,
  TwoFactorAuth	: boolean,
  twoFactorCorrect:false
}

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    userName: '',
    intraId: '',
    avatar: '',
    status: '',
    userRole: '',
    isLogged: false,
    TwoFactorAuth	: false,
    twoFactorCorrect:false
  },
  setUser: (user: User) => { }
} as UserContextInterface;

export const UserContext = createContext(defaultState);

export function useUser() {
  return useContext(UserContext);
}




type UserProviderProps = {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({
    userName: '',
    avatar: '',
    intraId: '',
    status: '',
    userRole: '',
    isLogged: false,
    TwoFactorAuth	: false,
    twoFactorCorrect:false
  });



  useEffect(() => {
    console.log("user provider calisti 0");
    const fetchData = async () => {
      console.log("user provider calisti 1");

      try {
        const response = await axios.get('http://localhost:3001/auth/status', { withCredentials: true })
        console.log("naber " + user.userName);
        setUser(response.data);
        console.log("sonrasinda  " + user.userName + " asdasd " + JSON.stringify(response.data) + "user login    bundan sonra" + window.location.pathname);
        console.log(response.data.avatar + " asdasd")
        console.log("provider data " + response.data)
      } catch (error) {
        if (!window.location.pathname.match('/login'))
          window.location.href = '/login'
      }
    };

    fetchData();
  }, []);


  if (user.isLogged && (user.TwoFactorAuth	 != true || user.twoFactorCorrect)) {
    console.log("provider " + JSON.stringify(user))
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  }
  else if (user.isLogged && user.TwoFactorAuth	) {
    return (
      <Validate2faPage />
    )
  }
  else {
    return (
      <Login />
    )
  }
}