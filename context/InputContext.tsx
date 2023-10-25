import React, {
  useState,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";

export type InputContextType = {
  expandInput: boolean;
  setExpandInput: Dispatch<SetStateAction<boolean>>;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  storedInputValue: string;
  setStoredInputValue: Dispatch<SetStateAction<string>>;
  isChangingEssential: boolean;
  setIsChangingEssential: Dispatch<SetStateAction<boolean>>;
};

// Create the context, initialized as undefined
export const InputContext = React.createContext<InputContextType | undefined>(
  undefined
);

// Export a custom hook to consume the context
export const useInputContext = (): InputContextType => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("useInputContext must be used within InputProvider");
  }
  return context;
};

// Define the props for the InputProvider component
type InputProviderProps = {
  children: React.ReactNode;
};

// Define the provider for the context
export const InputProvider = ({ children }: InputProviderProps) => {
  // Input states
  const [expandInput, setExpandInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [storedInputValue, setStoredInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [isChangingEssential, setIsChangingEssential] = useState(false);

  // Render the provider with the context value
  return (
    <InputContext.Provider
      value={{
        expandInput,
        setExpandInput,
        inputRef,
        inputValue,
        setInputValue,
        storedInputValue,
        setStoredInputValue,
        isChangingEssential,
        setIsChangingEssential,
      }}
    >
      {children}
    </InputContext.Provider>
  );
};
