// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Mock del usuario para el mockup
  const [currentUser] = useState({
    uid: 'mock-user-123',
    email: 'usuario@ejemplo.com',
    displayName: 'Usuario Demo'
  });

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};