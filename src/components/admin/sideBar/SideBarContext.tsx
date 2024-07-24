// SideBarContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface SideBarContextProps {
  isExpanded: boolean;
  toggleSideBar: () => void;
}

// Default value for the context
const defaultValue: SideBarContextProps = {
  isExpanded: false,
  toggleSideBar: () => {}
};


const SideBarContext = createContext<SideBarContextProps>(defaultValue);


interface SideBarContextProviderProps {
  children: ReactNode;
}

// Provider component
export function SideBarContextProvider({ children }: SideBarContextProviderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleSideBar() {
    setIsExpanded(!isExpanded);
    console.log(isExpanded)
  }

  return (
    <SideBarContext.Provider value={{ isExpanded, toggleSideBar }}>
      {children}
    </SideBarContext.Provider>
  );
}

// Export the context for use in other components
export default SideBarContext;
