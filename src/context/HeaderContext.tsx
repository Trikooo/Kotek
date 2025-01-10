"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
} from "react";

interface HeaderContextProps {
  searchFieldVisible: boolean;
  setSearchFieldVisible: (visible: boolean) => void;
  storeInputRef: React.RefObject<HTMLInputElement>;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [searchFieldVisible, setSearchFieldVisible] = useState(false);
  const storeInputRef = useRef<HTMLInputElement>(null);

  return (
    <HeaderContext.Provider
      value={{ searchFieldVisible, setSearchFieldVisible, storeInputRef }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
