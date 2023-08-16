import { useCMDK } from "@/context/CMDKContext";

export const useHandleSignalClick = () => {
  const { setPages } = useCMDK();

  const handleSignalClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "signals",
        dimensions: { width: 96, height: 712 },
      },
    ]);
  };

  return handleSignalClick;
};
