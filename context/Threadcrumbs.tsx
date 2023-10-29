import React, { createContext, useContext, useEffect, useState } from "react";
import { Record, Reply } from "@/types/dbTypes";

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
  replyParent: Record | Reply | null;
  setReplyParent: React.Dispatch<React.SetStateAction<Record | Reply | null>>;
  record: Record | null;
  setRecord: React.Dispatch<React.SetStateAction<Record | null>>;
  setThreadcrumbs: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [threadcrumbs, setThreadcrumbs] = useState<string[]>([]);
  const [replyParent, setReplyParent] = useState<Record | Reply | null>(null);
  const [record, setRecord] = useState<Record | null>(null);

  const addToThreadcrumbs = (id: string) => {
    const newThreadcrumbs = [...threadcrumbs, id];
    setThreadcrumbs(newThreadcrumbs);
  };

  const removeLastThreadcrumb = () => {
    const newThreadcrumbs = [...threadcrumbs];
    newThreadcrumbs.pop();
    setThreadcrumbs(newThreadcrumbs);
  };

  const removeUpToId = (id: string) => {
    const newThreadcrumbs = [...threadcrumbs];
    const index = newThreadcrumbs.indexOf(id);
    if (index !== -1) {
      newThreadcrumbs.splice(index); // remove all elements starting from index
      setThreadcrumbs(newThreadcrumbs);
    }
  };

  const resetThreadcrumbs = () => {
    setThreadcrumbs([]);
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
        record,
        setRecord,
        setThreadcrumbs,
      }}
    >
      {children}
    </ThreadcrumbContext.Provider>
  );
};
