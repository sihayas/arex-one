import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { UserType, Artifact } from "@/types/dbTypes";
import { v4 as uuidv4 } from "uuid";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AlbumData, SongData } from "@/types/appleTypes";
import { useNotificationsQuery } from "@/lib/apiHelper/user";

export type Page = {
  key: string;
  name: string;
  color: string;
  sound?: AlbumData | SongData;
  user?: UserType;
  artifact?: Artifact;
  scrollPosition: number;
  dimensions: {
    width: number;
    height: number;
  };
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
  activeFeed: "personal" | "bloom" | "recent" | null;
  setActiveFeed: React.Dispatch<
    React.SetStateAction<"personal" | "bloom" | "recent" | null>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notifs: any[];
  setNotifs: React.Dispatch<React.SetStateAction<any[]>>;
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

  // Initialize the feed stack
  const [activeFeed, setActiveFeed] = useState<
    "personal" | "bloom" | "recent" | null
  >(null);

  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSessionRaw] = useState<Session | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);
  const supabaseClient = useSupabaseClient();

  const sessionRef = useRef(session);

  const setSession = useCallback(
    (newSession: Session | null) => {
      /**
       * Prevent forced redraw on tab focus:
       * [onAuthStateChange (SIGNED\_IN event) Fired everytime I change Chrome Tab or refocus on tab . · Issue #7250 · supabase/supabase](https://github.com/supabase/supabase/issues/7250)
       */
      if (JSON.stringify(sessionRef.current) === JSON.stringify(newSession)) {
        console.debug("SupabaseBrowserAuthManager: no update, the same");
        return;
      }

      console.debug("SupabaseBrowserAuthManager: update, new session");

      sessionRef.current = newSession;
      setSession(newSession);
    },
    [setSessionRaw],
  );

  useEffect(() => {
    const setData = async (session: Session | null) => {
      console.debug("Auth state changed:", { event, session });
      if (session) {
        setSession(session);

        try {
          const { data: userData, error: fetchError } = await supabaseClient
            .from("User")
            .select("*")
            .eq("email", session.user.email)
            .single();

          if (fetchError) throw fetchError;
          setUser(userData);
          setActiveFeed("personal");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setSession(null);
      }
    };

    // Listen for changes to authentication
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setData(session);
      },
    );

    // Initial call to set data
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setData(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabaseClient]);

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
          dimensions: { width: 640, height: 608 },
          scrollPosition: 0,
          color: "CCC",
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
        activeFeed,
        setActiveFeed,
        isLoading,
        setIsLoading,
        notifs,
        setNotifs,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
