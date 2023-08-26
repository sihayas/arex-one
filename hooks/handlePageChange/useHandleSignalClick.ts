import { useInterface } from "@/context/Interface";

export const useHandleSignalClick = () => {
  const { setPages } = useInterface();

  const handleSignalClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "signals",
        dimensions: { width: 96, height: 712 },
        scrollPosition: 0,
      },
    ]);
  };

  return handleSignalClick;
};
