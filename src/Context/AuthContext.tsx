import { createContext, useContext, useState } from "react";


// declare user data
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

// declare authContextType data
export interface AuthContextType{
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}


// declare context object
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps{
  children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};