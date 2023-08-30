import { useInterface } from "@/context/Interface";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { v4 as uuidv4 } from "uuid";

export const useHandleEntryClick = (reviewId: string) => {
  const { setPages, isVisible, setIsVisible, entryContainerRef } =
    useInterface();
  const { setThreadcrumbs } = useThreadcrumb();

  const handleEntryClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        key: uuidv4(),
        name: "entry",
        threadcrumbs: [reviewId],
        dimensions: {
          width: 576,
          height: 576,
        },
        scrollPosition: 0,
      },
    ]);
    setThreadcrumbs([reviewId]);
    window.history.pushState(null, "");
  };

  return handleEntryClick;
};
