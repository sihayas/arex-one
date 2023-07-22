import React, { useState, useCallback, useContext } from "react";
import { AlbumData } from "@/lib/interfaces";

export type Page = {
  name: string;
  album?: AlbumData;
  threadcrumbs?: string[];
  user?: string;
  scrollPosition?: number;
};

export type CMDKContextType = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReviewId: string | null;
  setSelectedReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  bounceScale: number;
  setBounceScale: React.Dispatch<React.SetStateAction<number>>;
  bounce: () => void;
  hideSearch: boolean;
  setHideSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

type CMDKProviderProps = {
  children: React.ReactNode;
};

export const CMDKContext = React.createContext<CMDKContextType | undefined>(
  undefined
);

// Export the hook
export const useCMDK = (): CMDKContextType => {
  const context = useContext(CMDKContext);
  if (!context) {
    throw new Error("useCMDK must be used within CMDKProvider");
  }
  return context;
};

export const CMDKProvider = ({ children }: CMDKProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pages, setPages] = useState<Page[]>([{ name: "index" }]);

  const [hideSearch, setHideSearch] = useState(true);

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
        hideSearch,
        setHideSearch,
      }}
    >
      {children}
    </CMDKContext.Provider>
  );
};
