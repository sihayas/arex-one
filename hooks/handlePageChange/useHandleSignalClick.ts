import { useCMDK } from "@/context/Interface";

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
