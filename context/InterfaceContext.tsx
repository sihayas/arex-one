import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { UserType, Artifact } from "@/types/dbTypes";
import { AlbumData, SongData } from "@/types/appleTypes";

import { Session } from "lucia";
import {
  useUserAndSessionQuery,
  useNotificationsQuery,
} from "@/lib/apiHelper/user";
import { StateSnapshot } from "react-virtuoso";

export type Page = {
  key: string;
  name: string;
  color: string;
  scrollPosition: number;
  user?: UserType;
  sound?: {
    sound: SongData | AlbumData;
    snapshot?: {
      // To retain scroll position
      state: StateSnapshot;
      key: number;
    };
  };
  artifact?: { artifact: Artifact; replyTo?: string };
  isOpen: boolean;
};

export type PageName = "sound" | "user" | "artifact";

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

type InterfaceContextProviderProps = {
  children: React.ReactNode;
};

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

  // Track the active page
  useEffect(() => {
    const newActivePage = pages[pages.length - 1];
    setActivePage(newActivePage);
  }, [pages]);

  // Initialize the user and session
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);

  const { data } = useUserAndSessionQuery();

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setSession(data.session);
    }
  }, [data]);

  // Fetch notifications
  const { data: notifData } = useNotificationsQuery(user?.id);

  useEffect(() => {
    if (notifData) {
      setNotifs(notifData.data);
    }
  }, [notifData]);

  // Initialize the interface
  useEffect(() => {
    if (!pages.length && user) {
      setPages([
        {
          key: user.id,
          name: "user",
          user: user,
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
