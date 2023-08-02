import Image from "next/image";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { ReviewData } from "../../../../lib/interfaces";
import { UserAvatar, ReplyInput } from "../../generics";
import { RenderReplies } from "./subcomponents/RenderReplies";
import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useQuery } from "@tanstack/react-query";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { EntryPreview } from "../album/subcomponents/EntryPreview";
import useFetchArtworkUrl from "@/hooks/useFetchArtworkUrl";

export const Entry = () => {
  const { data: session } = useSession();
  // Context
  const { selectedAlbum } = useCMDKAlbum();
  const { activePage } = useCMDK();
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumb();

  // const boxShadow = useMemo(() => {
  //   if (selectedAlbum?.shadowColor) {
  //     return `0px 0px 0px 0px ${selectedAlbum?.shadowColor},0.025),
  //    0px 5px 12px 0px ${selectedAlbum.shadowColor},0.25),
  //    0px 22px 22px 0px ${selectedAlbum.shadowColor},0.22),
  //    0px 49px 29px 0px ${selectedAlbum.shadowColor},0.13),
  //    0px 87px 35px 0px ${selectedAlbum.shadowColor},0.04),
  //    0px 136px 38px 0px ${selectedAlbum.shadowColor},0.00)`;
  //   }
  //   return undefined;
  // }, [selectedAlbum?.shadowColor]);

  const firstThreadcrumb = activePage.threadcrumbs?.[0];

  // If reviewId changes [first item in threadcrumb] changes, re-render Entry
  useEffect(() => {
    if (activePage.threadcrumbs && firstThreadcrumb) {
      setThreadcrumbs(activePage.threadcrumbs);
    }
  }, [activePage.threadcrumbs, firstThreadcrumb, setThreadcrumbs]);

  const reviewId = threadcrumbs ? threadcrumbs[0] : null;

  // Get review data
  const {
    data: review,
    error,
    isLoading,
  } = useQuery(
    ["review", reviewId, session?.user?.id],
    async () => {
      const response: AxiosResponse<ReviewData> = await axios.get(
        `/api/review/getById?id=${reviewId}&userId=${session?.user?.id || ""}`
      );
      return response.data;
    },
    {
      enabled: !!reviewId, // <- Here, only fetch if reviewId is truthy
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (review) {
      setReplyParent(review);
    }
  }, [review, setReplyParent]);

  // If review album is different from selected album, fetch artwork
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    review?.albumId,
    "440"
  );

  if (!review) return null;

  return (
    <div className="flex flex-col rounded-[32px] w-full h-full overflow-scroll scrollbar-none relative bg-white border border-silver">
      <div className="flex items-end p-8 pb-0 gap-8">
        <EntryPreview review={review} />

        {/* Art  */}
        <Image
          className="rounded-[12px]"
          src={
            artworkUrl || selectedAlbum?.artworkUrl || "/images/default.webp"
          }
          alt={`${selectedAlbum?.attributes.name} artwork`}
          width={220} // Set this to a low value
          height={220} // Set this to the same low value
          onDragStart={(e) => e.preventDefault()}
          // style={{ boxShadow: boxShadow }}
          draggable="false"
        />
      </div>

      {/* Replies  */}
      <RenderReplies threadcrumbs={threadcrumbs} />

      {/* Reply Input  */}
      <div className="w-[482px] fixed bottom-8 left-8 flex items-center gap-2 bg-blurEntry backdrop-blur-sm p-2 rounded-full shadow-reply z-20 border border-silver">
        <UserAvatar
          className="border-2 border-white rounded-full"
          imageSrc={review.author?.image}
          altText={`${review.author?.name}'s avatar`}
          width={28}
          height={28}
        />
        <ReplyInput />
      </div>
    </div>
  );
};

export default Entry;
