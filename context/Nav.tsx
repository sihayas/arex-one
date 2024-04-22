import React, {
  useState,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { ReplyTargetType } from "../lib/helper/interface/nav";
import { AlbumData, SongData } from "@/types/appleTypes";

export type NavContextType = {
  expandInput: boolean;
  setExpandInput: Dispatch<SetStateAction<boolean>>;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  storedInputValue: string;
  setStoredInputValue: Dispatch<SetStateAction<string>>;
  activeAction: "form" | "reply" | "notifications" | "essential" | "none";
  setActiveAction: Dispatch<
    SetStateAction<"form" | "reply" | "notifications" | "essential" | "none">
  >;
  replyTarget: ReplyTargetType;
  setReplyTarget: Dispatch<SetStateAction<ReplyTargetType>>;
  selectedFormSound: AlbumData | SongData | null;
  setSelectedFormSound: React.Dispatch<
    React.SetStateAction<AlbumData | SongData | null>
  >;
};

// Create the context, initialized as undefined
export const NavContext = React.createContext<NavContextType | undefined>(
  undefined,
);

// Export a custom hook to consume the context
export const useNavContext = (): NavContextType => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNavContext must be used within InputProvider");
  }
  return context;
};

// Define the props for the InputProvider component
type NavProviderProps = {
  children: React.ReactNode;
};

// Define the provider for the context
export const NavProvider = ({ children }: NavProviderProps) => {
  // Input states
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [expandInput, setExpandInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [storedInputValue, setStoredInputValue] = useState("");

  const [selectedFormSound, setSelectedFormSound] = useState<
    AlbumData | SongData | null
  >(null);

  const [replyTarget, setReplyTarget] = useState<ReplyTargetType>(null);

  const [activeAction, setActiveAction] = useState<
    "form" | "reply" | "notifications" | "essential" | "none"
  >("none");

  // Whenever expandInput changes and is true, focus the input
  useEffect(() => {
    if (expandInput && inputRef.current && activeAction !== "notifications") {
      inputRef.current.focus();
    }
  }, [expandInput]);

  // Render the provider with the context value
  return (
    <NavContext.Provider
      value={{
        expandInput,
        setExpandInput,
        inputRef,
        inputValue,
        setInputValue,
        storedInputValue,
        setStoredInputValue,
        activeAction,
        setActiveAction,
        replyTarget,
        setReplyTarget,
        selectedFormSound,
        setSelectedFormSound,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};
