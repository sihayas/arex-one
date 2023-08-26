import { useInterface } from "@/context/Interface";
import { useThreadcrumb } from "@/context/Threadcrumbs";

export const useHandleEntryClick = (reviewId: string) => {
  const { setPages, isVisible, setIsVisible } = useInterface();
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
        scrollPosition: 0,
      },
    ]);
    setThreadcrumbs([reviewId]);
    !isVisible ? setIsVisible(true) : null;
    window.history.pushState(null, "");
  };

  return handleEntryClick;
};
