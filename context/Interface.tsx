import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import { Session } from "lucia";
import {
  useNotificationsQuery,
  useUserAndSessionQuery,
} from "@/lib/helper/session";
import { StateSnapshot } from "react-virtuoso";
import { Author, EntryExtended } from "@/types/global";
import { DatabaseUserAttributes } from "@/lib/global/auth";

export type PageSound = {
  id?: string; // database id
  apple_id: string;
  type: string;
  name: string;
  artist_name: string;
  release_date: string;
  artwork: string;
  identifier: string; // upc or isrc
};

export type Page = {
  key: string;
  type: PageType;
  data: Author | DatabaseUserAttributes | EntryExtended | PageSound;
  snapshot?: {
    key: number;
    state: StateSnapshot; // To retain scroll position
  };
  isOpen: boolean;
};

export type PageType = "sound" | "user" | "entry";

export type InterfaceContext = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  navigateBack: (pageNumber?: number) => void;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  user: DatabaseUserAttributes | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<any>>;
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

export const useInterfaceContext = (): InterfaceContext => {
  const context = useContext(InterfaceContext);
  if (!context) {
    throw new Error(
      "useInterfaceContext must be used within InterfaceProvider",
    );
  }
  return context;
};

// define the provider for the context
export const InterfaceContextProvider = ({
  children,
}: InterfaceContextProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<DatabaseUserAttributes | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);

  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = React.useState<Page>(
    pages[pages.length - 1],
  );

  // ref for animations scrolling within the window
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // initialize the user and session
  const { data } = useUserAndSessionQuery();
  useEffect(() => {
    if (data) {
      setUser(data.user);
      setSession(data.session);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [data]);

  // Initialize notifications
  const { data: notifData } = useNotificationsQuery(user?.id);
  useEffect(() => {
    if (notifData) {
      console.log("notifData", notifData);
      //  @ts-ignore
      setNotifs(notifData);
    }
  }, [notifData]);

  // Initialize the interface
  useEffect(() => {
    if (!pages.length && user) {
      setPages([{ key: user.id, type: "user", data: user, isOpen: false }]);
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

  // Track the active page
  useEffect(() => {
    const newActivePage = pages[pages.length - 1];
    setActivePage(newActivePage);
  }, [pages]);

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
        isLoading,
        setIsLoading,
        scrollContainerRef,
        user,
        setUser,
        session,
        setSession,
        notifs,
        setNotifs,
        pages,
        setPages,
        activePage,
        setActivePage,
        navigateBack,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
