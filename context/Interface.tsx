import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { SelectedSound } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";

// Define the shape of the Page data type
export type Page = {
  name: string;
  selectedSound?: SelectedSound;
  threadcrumbs?: string[];
  user?: string;
  scrollPosition?: number;
  dimensions: {
    width: number;
    height: number;
  };
};

// Define the shape of the context data type
export type InterfaceContext = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReviewId: string | null;
  setSelectedReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  expandInput: boolean;
  setExpandInput: React.Dispatch<React.SetStateAction<boolean>>;
  activePage: Page;
  navigateBack: (pageNumber?: number) => void;
  resetPage: () => void;
  previousPage: Page | null;
  prevPageCount: number;
  setPrevPageCount: React.Dispatch<React.SetStateAction<number>>;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  storedInputValue: string;
  setStoredInputValue: React.Dispatch<React.SetStateAction<string>>;
};

// Define the props for the CMDKProvider component
type InterfaceProviderProps = {
  children: React.ReactNode;
};

// Create the context, initialized as undefined
export const CMDKContext = React.createContext<InterfaceContext | undefined>(
  undefined
);

// Export a custom hook to consume the context
export const useCMDK = (): InterfaceContext => {
  const context = useContext(CMDKContext);
  if (!context) {
    throw new Error("useCMDK must be used within CMDKProvider");
  }
  return context;
};

// Define the provider for the context
export const CMDKProvider = ({ children }: InterfaceProviderProps) => {
  const { data: session, status } = useSession();

  // Visiblity states
  const [isVisible, setIsVisible] = useState(true);
  const [expandInput, setExpandInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [storedInputValue, setStoredInputValue] = useState("");
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Page states
  const [pages, setPages] = useState<Page[]>([
    { name: "feed", dimensions: { width: 574, height: 1084 } },
  ]);
  const [prevPageCount, setPrevPageCount] = useState(pages.length);

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const activePage: Page = useMemo(() => pages[pages.length - 1], [pages]);
  const previousPage: Page = useMemo(
    () => pages[pages.length - 2] || { name: "feed", width: 574, height: 1084 },
    [pages]
  );

  const navigateBack = useCallback(() => {
    setPages((prevPages) => {
      if (prevPages.length <= 1) {
        return prevPages;
      }

      // Make a shallow copy of the pages array
      const newPages = [...prevPages];

      // Pop the last page off the array
      newPages.pop();

      return newPages;
    });
    console.log("navigating back");
  }, []);

  const resetPage = useCallback(() => {
    setPages([{ name: "index", dimensions: { width: 922, height: 600 } }]);
  }, [setPages]);

  useEffect(() => {
    // Function to handle the web browser back button
    const handlePopState = () => {
      if (pages.length > 1) {
        navigateBack();
      } else {
      }
    };

    // Add a listener for the  event
    window.addEventListener("popstate", handlePopState);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pages, navigateBack]);

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
        expandInput,
        setExpandInput,
        activePage,
        navigateBack,
        resetPage,
        previousPage,
        prevPageCount,
        setPrevPageCount,
        inputRef,
        inputValue,
        setInputValue,
        storedInputValue,
        setStoredInputValue,
      }}
    >
      {children}
    </CMDKContext.Provider>
  );
};
