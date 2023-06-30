import React, { useState, useCallback } from "react";

export type CMDKContextType = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReviewId: string | null;
  setSelectedReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  pages: string[];
  setPages: React.Dispatch<React.SetStateAction<string[]>>;
  bounceScale: number;
  setBounceScale: React.Dispatch<React.SetStateAction<number>>;
  bounce: () => void;
};

export const CMDKContext = React.createContext<CMDKContextType | undefined>(
  undefined
);

export const CMDKProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pages, setPages] = useState(["search"]);

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const [bounceScale, setBounceScale] = useState(1);

  const bounce = useCallback(() => {
    setBounceScale(0.95);
    setTimeout(() => {
      setBounceScale(1);
    }, 100);
  }, [setBounceScale]);

  return (
    <CMDKContext.Provider
      value={{
        isVisible,
        setIsVisible,
        selectedReviewId,
        setSelectedReviewId,
        pages,
        setPages,
        bounceScale,
        setBounceScale,
        bounce,
      }}
    >
      {children}
    </CMDKContext.Provider>
  );
};
