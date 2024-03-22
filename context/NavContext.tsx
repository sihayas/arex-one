import React, {
  useState,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { ReplyTargetType } from "@/lib/helper/artifact";

export type NavContextType = {
  expandInput: boolean;
  setExpandInput: Dispatch<SetStateAction<boolean>>;
  expandSignals: boolean;
  setExpandSignals: Dispatch<SetStateAction<boolean>>;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  storedInputValue: string;
  setStoredInputValue: Dispatch<SetStateAction<string>>;
  isChangingEssential: boolean;
  setIsChangingEssential: Dispatch<SetStateAction<boolean>>;
  activeAction: "form" | "reply" | "notifications" | "none";
  setActiveAction: Dispatch<
    SetStateAction<"form" | "reply" | "notifications" | "none">
  >;
  replyTarget: ReplyTargetType;
  setReplyTarget: Dispatch<SetStateAction<ReplyTargetType>>;
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
  const [expandInput, setExpandInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [storedInputValue, setStoredInputValue] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTargetType>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [expandSignals, setExpandSignals] = useState(false);

  const [isChangingEssential, setIsChangingEssential] = useState(false);

  const [activeAction, setActiveAction] = useState<
    "form" | "reply" | "notifications" | "none"
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
        expandSignals,
        setExpandSignals,
        inputRef,
        inputValue,
        setInputValue,
        storedInputValue,
        setStoredInputValue,
        isChangingEssential,
        setIsChangingEssential,
        activeAction,
        setActiveAction,
        replyTarget,
        setReplyTarget,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};
