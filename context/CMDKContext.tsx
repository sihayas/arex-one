import React, { useState, useCallback, useContext, useMemo } from "react";
import { AlbumData } from "@/lib/interfaces";

// Define the shape of the Page data type
export type Page = {
  name: string;
  album?: AlbumData;
  threadcrumbs?: string[];
  user?: string;
  scrollPosition?: number;
  dimensions: {
    width: number;
    height: number;
  };
};

// Define the shape of the context data type
export type CMDKContextType = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReviewId: string | null;
  setSelectedReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  hideSearch: boolean;
  setHideSearch: React.Dispatch<React.SetStateAction<boolean>>;
  activePage: Page;
  navigateBack: (pageNumber?: number) => void;
  resetPage: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  previousPage: Page | null;
  prevPageCount: number;
  setPrevPageCount: React.Dispatch<React.SetStateAction<number>>;
};

// Define the props for the CMDKProvider component
type CMDKProviderProps = {
  children: React.ReactNode;
};

// Create the context, initialized as undefined
export const CMDKContext = React.createContext<CMDKContextType | undefined>(
  undefined
);

// Export a custom hook to consume the context
export const useCMDK = (): CMDKContextType => {
  const context = useContext(CMDKContext);
  if (!context) {
    throw new Error("useCMDK must be used within CMDKProvider");
  }
  return context;
};

// Define the provider for the context
export const CMDKProvider = ({ children }: CMDKProviderProps) => {
  // Visiblity states
  const [isVisible, setIsVisible] = useState(false);
  const [hideSearch, setHideSearch] = useState(true);

  // Page states
  const [pages, setPages] = useState<Page[]>([
    { name: "index", dimensions: { width: 922, height: 600 } },
  ]);
  const [prevPageCount, setPrevPageCount] = useState(pages.length);

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Use memoization for performance optimization, this will prevent unnecessary re-renders
  const activePage: Page = useMemo(() => pages[pages.length - 1], [pages]);
  const previousPage: Page = useMemo(
    () => pages[pages.length - 2] || { name: "index", width: 922, height: 600 },
    [pages]
  );
  const [isNavigating, setIsNavigating] = useState(false);

  // Update your navigateBack function
  const navigateBack = useCallback(
    (pageNumber: number = 1) => {
      if (isNavigating) return;

      setIsNavigating(true);

      setTimeout(() => {
        setPages((prevPages) => {
          if (prevPages.length <= 1) {
            setIsNavigating(false);
            return prevPages;
          }

          console.log("navigating back");
          const newPages = prevPages.slice(0, prevPages.length - pageNumber);
          setIsNavigating(false);
          return newPages;
        });
      }, 500);
    },
    [isNavigating]
  );

  // Reset the pages to the index page
  const resetPage = useCallback(() => {
    setPages([{ name: "index", dimensions: { width: 922, height: 600 } }]);
  }, [setPages]);

  // Render the provider with the context value
  return (
    <CMDKContext.Provider
      value={{
        isVisible,
        setIsVisible,
        selectedReviewId,
        setSelectedReviewId,
        pages,
        setPages,
        hideSearch,
        setHideSearch,
        activePage,
        navigateBack,
        resetPage,
        inputRef,
        previousPage,
        prevPageCount,
        setPrevPageCount,
      }}
    >
      {children}
    </CMDKContext.Provider>
  );
};
