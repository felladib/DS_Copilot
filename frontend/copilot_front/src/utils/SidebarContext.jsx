// contexts/SidebarContext.js
import { createContext, useContext, useState } from 'react';

export const SidebarContext = createContext();
// createContext() crée un "contexte" vide.
// SidebarContext va contenir l’état du sidebar et la fonction pour le modifier.

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};