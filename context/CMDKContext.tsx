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
    minWidth: number;
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
    { name: "index", dimensions: { minWidth: 500, height: 680 } },
  ]);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [bounceScale, setBounceScale] = useState(1);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Use memoization for performance optimization, this will prevent unnecessary re-renders
  const activePage: Page = useMemo(() => pages[pages.length - 1], [pages]);
  const previousPage: Page = useMemo(
    () =>
      pages[pages.length - 2] || { name: "index", minWidth: 500, height: 680 },
    [pages]
  );

  // Define navigateBack function, responsible for navigating pages
  const navigateBack = useCallback(
    (pageNumber: number = 1) => {
      setPages((prevPages) => {
        if (prevPages.length <= 1) {
          return prevPages;
        }

        const newPages = prevPages.slice(0, prevPages.length - pageNumber);
        return newPages;
      });
    },
    [setPages]
  );

  // Reset the pages to the index page
  const resetPage = useCallback(() => {
    setPages([{ name: "index", dimensions: { minWidth: 500, height: 680 } }]);
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
      }}
    >
      {children}
    </CMDKContext.Provider>
  );
};
