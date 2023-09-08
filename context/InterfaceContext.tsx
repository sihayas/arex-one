import React, { useState, useCallback, useContext, useEffect } from "react";
import { SelectedSound } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";

export type Page = {
  key: string;
  name: string;
  selectedSound?: SelectedSound;
  threadcrumbs?: string[];
  user?: string;
  scrollPosition: number;
  dimensions: {
    width: number;
    height: number;
  };
  translate?: {
    x: number;
    y: number;
  };
  scale?: {
    x: number;
    y: number;
  };
};

export type InterfaceContext = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReviewId: string | null;
  setSelectedReviewId: React.Dispatch<React.SetStateAction<string | null>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  expandInput: boolean;
  setExpandInput: React.Dispatch<React.SetStateAction<boolean>>;
  navigateBack: (pageNumber?: number) => void;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  storedInputValue: string;
  setStoredInputValue: React.Dispatch<React.SetStateAction<string>>;
};

// Define the props for the InterfaceProvider component
type InterfaceContextProviderProps = {
  children: React.ReactNode;
};

// Create the context, initialized as undefined
export const InterfaceContext = React.createContext<
  InterfaceContext | undefined
>(undefined);

// Export a custom hook to consume the context
export const useInterfaceContext = (): InterfaceContext => {
  const context = useContext(InterfaceContext);
  if (!context) {
    throw new Error("useInterfaceContextmust be used within InterfaceProvider");
  }
  return context;
};

// Define the provider for the context
export const InterfaceContextProvider = ({
  children,
}: InterfaceContextProviderProps) => {
  const { data: session, status } = useSession();

  const [isVisible, setIsVisible] = useState(false);

  const [expandInput, setExpandInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [storedInputValue, setStoredInputValue] = useState("");
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (session) {
      setPages([
        {
          key: session.user.id,
          name: "user",
          dimensions: { width: 480, height: 928 },
          scrollPosition: 0,
        },
      ]);
    }
  }, [session]);

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

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
  }, []);

  // Function to handle the web browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (pages.length > 1) {
        navigateBack();
      } else {
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pages, navigateBack]);

  // Render the provider with the context value
  return session ? (
    <InterfaceContext.Provider
      value={{
        isVisible,
        setIsVisible,
        selectedReviewId,
        setSelectedReviewId,
        pages,
        setPages,
        expandInput,
        setExpandInput,
        navigateBack,
        inputRef,
        inputValue,
        setInputValue,
        storedInputValue,
        setStoredInputValue,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  ) : null; // or replace with a loading component
};
