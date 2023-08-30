import { useInterface } from "@/context/Interface";
import { v4 as uuidv4 } from "uuid";

export const useHandleSignalClick = () => {
  const { setPages } = useInterface();

  const handleSignalClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "signals",
        dimensions: { width: 96, height: 712 },
        scrollPosition: 0,
      },
    ]);
  };

  return handleSignalClick;
};
