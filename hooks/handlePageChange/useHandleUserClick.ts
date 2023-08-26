import { useInterface } from "@/context/Interface";

export const useHandleUserClick = (authorId: string) => {
  const { setPages, setIsVisible, isVisible } = useInterface();

  const handleUserClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "user",
        user: authorId,
        dimensions: { width: 532, height: 712 },
      },
    ]);
    !isVisible ? setIsVisible(true) : null;
  };

  return handleUserClick;
};
