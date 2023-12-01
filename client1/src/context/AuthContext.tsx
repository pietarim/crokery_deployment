import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthUser {
  id: number;
  username: string;
  token: string;
}

interface AuthContextType {
  token: AuthUser | null;
  setToken: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
  const [token, setToken] = useState<AuthUser | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};