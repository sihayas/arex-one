import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SelectedSound } from "@/context/SoundContext";
import { User, Artifact } from "@/types/dbTypes";
import { v4 as uuidv4 } from "uuid";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";

export type Page = {
  key: string;
  name: string;
  sound?: SelectedSound;
  user?: User;
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
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  activeFeed: User | "bloom" | "recent" | null;
  setActiveFeed: React.Dispatch<
    React.SetStateAction<User | "bloom" | "recent" | null>
  >;
  feedHistory: User[];
  setFeedHistory: React.Dispatch<React.SetStateAction<User[]>>;
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

  // Create a ref for animations scrolling within the window
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the pages array
  const [pages, setPages] = useState<Page[]>([]);

  // Initialize the feed stack
  const [activeFeed, setActiveFeed] = useState<
    User | "bloom" | "recent" | null
  >(null);
  const [feedHistory, setFeedHistory] = useState<User[]>([]);

  // Prepare the user and session states
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    let currentSessionId: string | null | undefined = null;

    const setData = async (session: Session | null) => {
      if (session?.user?.id === currentSessionId) return;
      currentSessionId = session?.user?.id;

      if (session) {
        setSession(session);

        // Get the user profile details from the database
        try {
          const { data: userData, error: fetchError } = await supabaseClient
            .from("User")
            .select("*")
            .eq("email", session.user.email)
            .single();

          console.log(userData);

          if (fetchError) throw fetchError;
          setUser(userData);
          setActiveFeed(userData);
          console.log(userData);
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

  // Initialize the user page upon session and user initialization
  useEffect(() => {
    if (!pages.length && user) {
      setPages([
        {
          key: uuidv4(),
          name: "user",
          user: user,
          dimensions: { width: 576, height: 352 },
          scrollPosition: 0,
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
        user,
        setUser,
        session,
        setSession,
        activeFeed,
        setActiveFeed,
        feedHistory,
        setFeedHistory,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
