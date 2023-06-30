import { useContext } from "react";
import {
  ThreadcrumbContext,
  ThreadcrumbContextType,
} from "../contexts/Threadcrumbs";

export const useThreadcrumbs = (): ThreadcrumbContextType => {
  const context = useContext(ThreadcrumbContext);
  if (!context) {
    throw new Error("useThreadcrumbs must be used within ThreadcrumbProvider");
  }
  return context;
};

export default useThreadcrumbs;
