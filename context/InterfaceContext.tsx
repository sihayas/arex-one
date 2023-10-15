import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SelectedSound } from "@/lib/global/interfaces";
import { ReviewData, UserData } from "@/lib/global/interfaces";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/global/supabase";

export type Page = {
  key: string;
  name: string;
  sound?: SelectedSound;
  user?: UserData;
  entry?: ReviewData;
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
    throw new Error(
      "useInterfaceContext must be used within" + " InterfaceProvider",
    );
  }
  return context;
};

// Define the provider for the context
export const InterfaceContextProvider = ({
  children,
}: InterfaceContextProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
      } else {
        // @ts-ignore
        setUser({ user: user });
      }
    }
    getUser();
  }, []);

  // Initialize pages
  useEffect(() => {
    if (!pages.length && user) {
      console.log(user);
      setPages([
        {
          key: uuidv4(),
          name: "user",
          user: user,
          dimensions: { width: 352, height: 512 },
          scrollPosition: 0,
        },
      ]);
    }
  }, [pages.length, user]);

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
