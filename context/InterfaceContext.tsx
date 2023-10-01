import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SelectedSound } from "@/lib/global/interfaces";
import { useSession } from "next-auth/react";
import { ReviewData } from "@/lib/global/interfaces";

export type Page = {
  key: string;
  name: string;
  sound?: SelectedSound;
  user?: string;
  review?: ReviewData;
  scrollPosition: number;
  dimensions: {
    width: number;
    height: number;
  };
};

export type InterfaceContext = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  navigateBack: (pageNumber?: number) => void;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Page states
  const [pages, setPages] = useState<Page[]>([]);

  // Initialize pages
  useEffect(() => {
    if (session && !pages.length) {
      setPages([
        {
          key: session.user.id,
          name: "user",
          dimensions: { width: 384, height: 512 },
          scrollPosition: 0,
        },
      ]);
    }
  }, [session, pages]);

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
  return (
    <InterfaceContext.Provider
      value={{
        isVisible,
        setIsVisible,
        pages,
        setPages,
        navigateBack,
        scrollContainerRef,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
