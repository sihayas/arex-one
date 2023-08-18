import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";

export const useHandleEntryClick = (reviewId: string) => {
  const { setPages, isVisible, setIsVisible } = useCMDK();
  const { setThreadcrumbs } = useThreadcrumb();

  const handleEntryClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "entry",
        threadcrumbs: [reviewId],
        dimensions: {
          width: 516,
          height: 610,
        },
      },
    ]);
    setThreadcrumbs([reviewId]);
    !isVisible ? setIsVisible(true) : null;
    window.history.pushState(null, "");
  };

  return handleEntryClick;
};
