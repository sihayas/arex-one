import React, { createContext, useContext, useEffect, useState } from "react";
import { Artifact, Reply } from "@/types/dbTypes";

type ThreadcrumbProviderType = {
  children: React.ReactNode;
};

export type ReplyParent = {
  artifact?: Artifact;
  reply?: Reply;
};

// Define the context type
export type ThreadcrumbContextType = {
  threadcrumbs: string[];
  addToThreadcrumbs: (id: string) => void;
  removeLastThreadcrumb: () => void;
  resetThreadcrumbs: () => void;
  removeUpToId: (id: string) => void;
  replyParent: ReplyParent | null;
  setReplyParent: React.Dispatch<React.SetStateAction<ReplyParent | null>>;
  artifact: Artifact | null;
  setArtifact: React.Dispatch<React.SetStateAction<Artifact | null>>;
  setThreadcrumbs: React.Dispatch<React.SetStateAction<string[]>>;
};

// Create the context with a default empty object
export const ThreadcrumbContext = createContext<ThreadcrumbContextType | null>(
  null,
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
  const [replyParent, setReplyParent] = useState<ReplyParent | null>(null);
  const [artifact, setArtifact] = useState<Artifact | null>(null);

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

  // log every time replyParent changes
  useEffect(() => {
    console.log("replyParent changed");
  }, [replyParent]);

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
        artifact,
        setArtifact,
        setThreadcrumbs,
      }}
    >
      {children}
    </ThreadcrumbContext.Provider>
  );
};
