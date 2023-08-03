import React, { useContext, Dispatch, SetStateAction } from "react";

interface IScrollContext {
  isScrollingRight: boolean;
  setIsScrollingRight: Dispatch<SetStateAction<boolean>>;
}

const ScrollContext = React.createContext<IScrollContext>({
  isScrollingRight: false,
  setIsScrollingRight: () => {}, // Default function does nothing
});

export const ScrollProvider = ({ children }) => {
  const [isScrollingRight, setIsScrollingRight] = React.useState(false);

  return (
    <ScrollContext.Provider value={{ isScrollingRight, setIsScrollingRight }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
