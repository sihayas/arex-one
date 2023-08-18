import { useCMDK } from "@/context/CMDKContext";

export const useHandleUserClick = (authorId: string) => {
  const { setPages, setIsVisible, isVisible } = useCMDK();

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
