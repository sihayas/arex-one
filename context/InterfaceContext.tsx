import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SelectedSound } from "@/context/SoundContext";
import { Record, User } from "@/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AlbumData, SongData } from "@/types/appleTypes";

export type Page = {
  key: string;
  name: string;
  sound?: AlbumData | SongData;
  user?: User;
  record?: Record;
  scrollPosition: number;
  dimensions: {
    width: number;
    height: number;
  };
};

export type PageName = "album" | "user" | "record";

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
  activeFeedUser: User | null;
  setActiveFeedUser: React.Dispatch<React.SetStateAction<User | null>>;
  feedUserHistory: User[];
  setFeedUserHistory: React.Dispatch<React.SetStateAction<User[]>>;
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

  // Initialize the feed user history stack
  const [activeFeedUser, setActiveFeedUser] = useState<User | null>(null);
  const [feedUserHistory, setFeedUserHistory] = useState<User[]>([]);

  // Prepare the user and session states
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const supabaseClient = useSupabaseClient();

  // Initialize the session and user on page load
  useEffect(() => {
    // Initialize a session and user if they exist on page load
    const setData = async () => {
      // Get a session if it exists
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);

      // Get the user profile details from the database
      const { data: userData, error: fetchError } = await supabaseClient
        .from("User")
        .select("*")
        .eq("email", session?.user.email)
        .single();

      if (fetchError) throw fetchError;
      setUser(userData);
    };

    // Listen for changes to authentication
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setData();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
        }
      },
    );

    setData();

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
          dimensions: { width: 442, height: 678 },
          scrollPosition: 0,
        },
      ]);
      setActiveFeedUser(user);
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
        activeFeedUser,
        setActiveFeedUser,
        feedUserHistory,
        setFeedUserHistory,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};

// useEffect(() => {
//   const { data: authListener } = supabaseClient.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === "SIGNED_IN" && session) {
//           console.log("SIGNED_IN");
//
//           setSession({ session: session });
//           console.log("SESSION", session);
//
//           const authUser = session.user;
//           console.log(authUser);
//           // Fetch user profile data from the database
//           const { data: fetchedUser, error: fetchError } = await supabaseClient
//               .from("User")
//               .select("*")
//               .eq("email", authUser.email)
//               .single();
//           {
//             fetchError &&
//             console.error("Error fetching user data:", fetchError);
//           }
//
//           setUser(fetchedUser);
//           console.log("fetchedUser", fetchedUser);
//         } else if (event === "SIGNED_OUT") {
//           setUser(null);
//           setSession(null);
//         }
//       },
//   );
//
//   // Cleanup subscription
//   return () => {
//     authListener.subscription.unsubscribe();
//   };
// }, []);
