import React, { useContext, Dispatch, SetStateAction, ReactNode } from "react";

interface ScrollContext {
  cursorOnRight: boolean;
  setCursorOnRight: Dispatch<SetStateAction<boolean>>;
}

const ScrollContext = React.createContext<ScrollContext>({
  cursorOnRight: false,
  setCursorOnRight: () => {}, // Default function does nothing
});

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [cursorOnRight, setCursorOnRight] = React.useState(false);

  return (
    <ScrollContext.Provider
      value={{
        cursorOnRight,
        setCursorOnRight,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
