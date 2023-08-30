import { useInterface } from "@/context/Interface";
import { v4 as uuidv4 } from "uuid";

export const useHandleUserClick = (authorId: string) => {
  const { setPages, setIsVisible, isVisible } = useInterface();

  const handleUserClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "user",
        user: authorId,
        dimensions: { width: 532, height: 712 },
        scrollPosition: 0,
      },
    ]);
  };

  return handleUserClick;
};
