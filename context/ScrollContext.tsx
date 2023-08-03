import React, { useContext, Dispatch, SetStateAction } from "react";

interface IScrollContext {
  isScrollingRight: boolean;
  setIsScrollingRight: Dispatch<SetStateAction<boolean>>;
  cursorOnRight: boolean;
  setCursorOnRight: Dispatch<SetStateAction<boolean>>;
}

const ScrollContext = React.createContext<IScrollContext>({
  isScrollingRight: false,
  setIsScrollingRight: () => {}, // Default function does nothing
  cursorOnRight: false,
  setCursorOnRight: () => {}, // Default function does nothing
});

export const ScrollProvider = ({ children }) => {
  const [isScrollingRight, setIsScrollingRight] = React.useState(false);
  const [cursorOnRight, setCursorOnRight] = React.useState(false);

  return (
    <ScrollContext.Provider
      value={{
        isScrollingRight,
        setIsScrollingRight,
        cursorOnRight,
        setCursorOnRight,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
