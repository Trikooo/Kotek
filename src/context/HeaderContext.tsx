import React, { createContext, useState, useContext, ReactNode } from 'react';

interface HeaderContextProps {
  searchFieldVisible: boolean;
  setSearchFieldVisible: (visible: boolean) => void;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [searchFieldVisible, setSearchFieldVisible] = useState(false);

  return (
    <HeaderContext.Provider value={{ searchFieldVisible, setSearchFieldVisible }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
};
