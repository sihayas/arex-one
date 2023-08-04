import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";

export const useHandleEntryClick = (reviewId: string) => {
  const { setPages } = useCMDK();
  const { setThreadcrumbs } = useThreadcrumb();

  const handleEntryClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "entry",
        threadcrumbs: [reviewId],
        dimensions: {
          width: 800,
          height: 800,
        },
      },
    ]);
    setThreadcrumbs([reviewId]);
  };

  return handleEntryClick;
};
