import { createContext, useContext, useState, useEffect } from "react";

const MenuBarContext = createContext<MenuBarContextType | null>(null);

export function MenuBarProvider({ children }: { children: React.ReactNode }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick() {
      setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <MenuBarContext.Provider value={{ openMenu, setOpenMenu }}>
      {children}
    </MenuBarContext.Provider>
  );
}

export function useMenuBar(): MenuBarContextType {
    // createContext could be MenuBarContextType or null, 
    // so we need to check for null before returning
    // so typescript will shut up 
  const ctx = useContext(MenuBarContext);
  if (!ctx) {
    throw new Error("MenuBarContext is not available");
  }
  return ctx;
}

export type MenuBarContextType = {
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
};
