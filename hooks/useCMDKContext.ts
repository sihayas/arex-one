import { useContext } from "react";
import { CMDKContext, CMDKContextType } from "../contexts/CMDK";

export const useCMDK = (): CMDKContextType => {
  const context = useContext(CMDKContext);
  if (!context) {
    throw new Error("useCMDK must be used within CMDKProvider");
  }
  return context;
};

export default useCMDK;
