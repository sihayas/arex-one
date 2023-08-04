import React, { useContext, Dispatch, SetStateAction } from "react";

interface IScrollContext {
  cursorOnRight: boolean;
  setCursorOnRight: Dispatch<SetStateAction<boolean>>;
}

const ScrollContext = React.createContext<IScrollContext>({
  cursorOnRight: false,
  setCursorOnRight: () => {}, // Default function does nothing
});

export const ScrollProvider = ({ children }) => {
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
