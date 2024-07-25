import { createContext, ReactNode, useEffect, useState } from "react";

interface Storage {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
}

interface StorageInternal {
  [key: string]: any; // Index signature to allow string keys
}

class LocalStorage implements Storage {
  private storage: StorageInternal = {}; // Internal storage

  getItem(key: string): any {
    return this.storage[key] || null; // Return null if the key doesn't exist
  }

  setItem(key: string, value: any): void {
    this.storage[key] = value; // Set the value for the given key
  }
}

let localStorage = new LocalStorage();


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
