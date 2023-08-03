import React, { useState, useCallback, useContext, useMemo } from "react";
import { AlbumData } from "@/lib/interfaces";
import { useThreadcrumb } from "./Threadcrumbs";

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
  activePage: Page;
  navigateBack: (pageNumber?: number) => void;
  resetPage: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

type CMDKProviderProps = {
  children: React.ReactNode;
};

export type Page = {
  name: string;
  album?: AlbumData;
  threadcrumbs?: string[];
  user?: string;
  scrollPosition?: number;
  dimensions: {
    minWidth: number;
    height: number;
  };
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
  const [pages, setPages] = useState<Page[]>([
    { name: "index", dimensions: { minWidth: 1022, height: 680 } },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [hideSearch, setHideSearch] = useState(true);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [bounceScale, setBounceScale] = useState(1);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const activePage: Page = useMemo(() => pages[pages.length - 1], [pages]);

  const bounce = useCallback(() => {
    setBounceScale(0.95);
    setTimeout(() => {
      setBounceScale(1);
    }, 100);
  }, [setBounceScale]);

  const navigateBack = useCallback(
    (pageNumber: number = 1) => {
      setPages((prevPages) => {
        const newPages = prevPages.slice(0, prevPages.length - pageNumber);
        return newPages;
      });
    },
    [setPages]
  );

  const resetPage = useCallback(() => {
    setPages([{ name: "index", dimensions: { minWidth: 1022, height: 680 } }]);
  }, [setPages]);

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
        activePage,
        navigateBack,
        resetPage,
        inputRef,
      }}
    >
      {children}
    </CMDKContext.Provider>
  );
};
