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
  const [session, setSession] = useState<Session | null>(null);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    // Initialize User
    let currentSessionId: string | null | undefined = null;

    const setData = async (session: Session | null) => {
      if (session?.user?.id === currentSessionId) return;
      currentSessionId = session?.user?.id;

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

          console.log("User data fetched successfully:", userData);
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

  const { data: notifications, refetch } = useNotificationsQuery(user?.id);

  useEffect(() => {
    if (notifications) {
      // const unseenNotifications = notifications.filter(
      //   (notification) => !notification.seen,
      // );
      // if (unseenNotifications.length) {
      //   setIsVisible(true);
      // }
      // const updatedUser = {
      //   ...user,
      //   notifications.notifications,
      // };

      console.log("notifications", notifications);
      // setUser(updatedUser);
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

  // Function to navigate back in the history
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

  // Function to store pages in web browser history
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
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
