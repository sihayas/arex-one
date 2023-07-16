import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";

export const useHandleEntryClick = (reviewId: string) => {
  const { setPages, bounce } = useCMDK();
  const { setThreadcrumbs } = useThreadcrumb();

  const handleEntryClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "entry",
        threadcrumbs: [reviewId],
      },
    ]);
    setThreadcrumbs([reviewId]);
    bounce();
  };

  return handleEntryClick;
};
