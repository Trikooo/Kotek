import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface SideBarContextProps {
  isExpanded: boolean;
  toggleSideBar: () => void;
}

const defaultValue: SideBarContextProps = {
  isExpanded: false,
  toggleSideBar: () => {}
};

const SideBarContext = createContext<SideBarContextProps>(defaultValue);

interface SideBarContextProviderProps {
  children: ReactNode;
}

export function SideBarContextProvider({ children }: SideBarContextProviderProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Retrieve the initial state from local storage
    const storedValue = localStorage.getItem('isExpanded');
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    // Store the state in local storage whenever it changes
    localStorage.setItem('isExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  function toggleSideBar() {
    setIsExpanded(!isExpanded);
  }

  return (
    <SideBarContext.Provider value={{ isExpanded, toggleSideBar }}>
      {children}
    </SideBarContext.Provider>
  );
}

export default SideBarContext;
