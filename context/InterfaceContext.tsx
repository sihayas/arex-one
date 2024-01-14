import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { UserType, Artifact } from "@/types/dbTypes";
import { v4 as uuidv4 } from "uuid";
import { AlbumData, SongData } from "@/types/appleTypes";
import {
  useNotificationsQuery,
  useUserAndSessionQuery,
} from "@/lib/apiHelper/user";
import { Session } from "lucia";

export type Page = {
  key: string;
  name: string;
  color: string;
  dimensions: {
    width: number;
    height: number;
  };
  scrollPosition: number;
  user?: UserType;
  sound?: AlbumData | SongData;
  artifact?: Artifact;
  isOpen: boolean;
};

export type PageName = "album" | "user" | "artifact";

export type InterfaceContext = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  navigateBack: (pageNumber?: number) => void;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notifs: any[];
  setNotifs: React.Dispatch<React.SetStateAction<any[]>>;
  activePage: Page;
  setActivePage: React.Dispatch<React.SetStateAction<Page>>;
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
  // Control the visibility of the window
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create a ref for animations scrolling within the window
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the pages array
  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = React.useState<Page>(
    pages[pages.length - 1],
  );

  useEffect(() => {
    const newActivePage = pages[pages.length - 1];
    setActivePage(newActivePage);
    console.log("active page changed", newActivePage);
  }, [pages]);

  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);

  const { data, isError } = useUserAndSessionQuery();

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setSession(data.session);
      console.log("user and session set");
      console.log(data);
    }
  }, [data]);

  const { data: notifications } = useNotificationsQuery(user?.id);

  useEffect(() => {
    if (scrollContainerRef.current) {
      console.log(scrollContainerRef.current);
    }
  }, [scrollContainerRef]);

  useEffect(() => {
    if (notifications) {
      setNotifs(notifications.data);
    }
  }, [notifications]);

  // Initialize the user page upon session and user initialization
  useEffect(() => {
    if (!pages.length && user) {
      setPages([
        {
          key: uuidv4(),
          name: "user",
          user: user,
          dimensions: { width: 656, height: 384 },
          scrollPosition: 0,
          color: "CCC",
          isOpen: false,
        },
      ]);
    }
  }, [pages.length, user]);

  // Navigate back in the history
  const navigateBack = useCallback(() => {
    setPages((prevPages) => {
      if (prevPages.length <= 1) {
        return prevPages;
      }
      const newPages = [...prevPages];
      newPages.pop();
      return newPages;
    });
  }, []);

  // Store pages in web browser history
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

  return (
    <InterfaceContext.Provider
      value={{
        isVisible,
        setIsVisible,
        pages,
        setPages,
        navigateBack,
        scrollContainerRef,
        user,
        setUser,
        session,
        setSession,
        isLoading,
        setIsLoading,
        notifs,
        setNotifs,
        activePage,
        setActivePage,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
