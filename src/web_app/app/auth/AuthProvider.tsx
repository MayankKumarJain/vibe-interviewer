import React, { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router";

type LoginData = {
  email: string;
  password: string;
};
type AuthDetails = {
  userId: string | null;
  userRole: string | null;
  token: string | null;
  loginAction: (data: LoginData) => Promise<void>;
  logOut: () => Promise<void>;
};
// TODO: Move this to config file #CONFIG
const API_ENDPOINT = "http://172.190.178.195:8085/api/v1/";
const AUTH_ENDPOINT = `${API_ENDPOINT}sia/auth/login`;


const AuthContext = createContext({
  userId: null,
  userRole: null,
  token: null,
  loginAction: (data) => {},
  logOut: () => {},
} as AuthDetails);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  const navigate = useNavigate();
  const loginAction = async (data: LoginData) => {
    try {
      const response = await fetch(AUTH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (response.ok) {
        setUserId(res.userId);
        setUserRole(res.role);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        
        const meetingPath = localStorage.getItem("meeting-path");
        const redirectPath = meetingPath ? meetingPath : '/';
        navigate(redirectPath);
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      // TODO: Show snack bar login failed
      console.error(err);
    }
  };

  const logOut = async () => {
    setUserId(null);
    setUserRole(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ token, userId, userRole, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
