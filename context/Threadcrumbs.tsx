import { createContext, useContext, useState } from "react";
import { ReviewData, ReplyData } from "../lib/global/interfaces";

type ThreadcrumbProviderType = {
  children: React.ReactNode;
};

// Define the context type
export type ThreadcrumbContextType = {
  threadcrumbs: string[];
  addToThreadcrumbs: (id: string) => void;
  removeLastThreadcrumb: () => void;
  resetThreadcrumbs: () => void;
  removeUpToId: (id: string) => void;
  replyParent: ReviewData | ReplyData | null;
  setReplyParent: React.Dispatch<
    React.SetStateAction<ReviewData | ReplyData | null>
  >;
  setThreadcrumbs: React.Dispatch<React.SetStateAction<string[]>>;
  openThreads: boolean;
  setOpenThreads: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create the context with a default empty object
export const ThreadcrumbContext = createContext<ThreadcrumbContextType | null>(
  null
);

// Create a hook to use the context
export const useThreadcrumb = () => {
  const context = useContext(ThreadcrumbContext);
  if (!context) {
    throw new Error("useThreadcrumb must be used within a ThreadcrumbProvider");
  }
  return context;
};

// Create a provider component
export const ThreadcrumbProvider = ({ children }: ThreadcrumbProviderType) => {
  const [openThreads, setOpenThreads] = useState(false);
  const [threadcrumbs, setThreadcrumbs] = useState<string[]>([]);
  const [replyParent, setReplyParent] = useState<ReviewData | ReplyData | null>(
    null
  );

  const addToThreadcrumbs = (id: string) => {
    const newThreadcrumbs = [...threadcrumbs, id];
    setThreadcrumbs(newThreadcrumbs);
    // console.log("New Threadcrumbs:", newThreadcrumbs);
  };

  const removeLastThreadcrumb = () => {
    const newThreadcrumbs = [...threadcrumbs];
    newThreadcrumbs.pop();
    setThreadcrumbs(newThreadcrumbs);
    // console.log("Removed Threadcrumb:", newThreadcrumbs);
  };

  const removeUpToId = (id: string) => {
    const newThreadcrumbs = [...threadcrumbs];
    const index = newThreadcrumbs.indexOf(id);
    if (index !== -1) {
      newThreadcrumbs.splice(index); // remove all elements starting from index
      setThreadcrumbs(newThreadcrumbs);
      console.log(
        "Removed Threadcrumbs Up To:",
        id,
        " New Threadcrumbs:",
        newThreadcrumbs
      ); // log the updated threadcrumb state
    }
  };

  const resetThreadcrumbs = () => {
    setThreadcrumbs([]);

    // console.log("current crumbs:", threadcrumbs);
  };

  return (
    <ThreadcrumbContext.Provider
      value={{
        threadcrumbs,
        addToThreadcrumbs,
        removeLastThreadcrumb,
        removeUpToId,
        resetThreadcrumbs,
        replyParent,
        setReplyParent,
        setThreadcrumbs,
        openThreads,
        setOpenThreads,
      }}
    >
      {children}
    </ThreadcrumbContext.Provider>
  );
};
