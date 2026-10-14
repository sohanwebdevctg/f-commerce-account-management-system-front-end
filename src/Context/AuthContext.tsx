import { createContext, useContext, useState } from "react";

// Direct declaration of types for all states and functions within the context
export interface AuthContextType{
  id: string | null;
  email: string | null;
  role: string | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
  setAuthData: (token: string, id: string, email: string, role: string) => void;
}

// Creating context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps{
  children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {

  // all state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
const [id, setId] = useState<string | null>(() => localStorage.getItem("id"));
const [email, setEmail] = useState<string | null>(() => localStorage.getItem("email"));
const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));

// Initially, all data loads in the first frame, so loading = false
const [loading, setLoading] = useState<boolean>(false);

// To update the state after login
  const setAuthData = (token: string, id: string, email: string, role: string) => {
    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    // Save to React State
    setToken(token);
    setId(id);
    setEmail(email);
    setRole(role);
  };

  // To log out
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("activeTab");

    setToken(null);
    setId(null);
    setEmail(null);
    setRole(null);
  };

  return (<AuthContext.Provider value={{token,id,email,role,loading,setAuthData,logout}}>{children}</AuthContext.Provider>)

};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
