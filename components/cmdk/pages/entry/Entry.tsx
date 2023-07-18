import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { ReviewData } from "../../../../lib/interfaces";
import { UserAvatar, ReplyInput, generateArtworkUrl } from "../../generics";
import { RenderReplies } from "./subcomponents/RenderReplies";
import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useQuery } from "@tanstack/react-query";
import { getAlbumById } from "@/lib/musicKit";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { EntryPreview } from "../album/subcomponents/EntryPreview";

const fetchArtworkUrl = async (albumId: string | undefined) => {
  if (!albumId) {
    console.log("fetchArtworkURl didnt get an albumId");
    return null;
  }

  const albumData = await getAlbumById(albumId);
  const artworkUrl = generateArtworkUrl(
    albumData.attributes.artwork.url,
    "440"
  );

  return artworkUrl;
};

export const Entry = () => {
  const { data: session } = useSession();

  // Context
  const { selectedAlbum } = useCMDKAlbum();
  const { pages } = useCMDK();
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumb();

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.shadowColor) {
      return `0px 0px 0px 0px ${selectedAlbum?.shadowColor},0.025),
     0px 5px 12px 0px ${selectedAlbum.shadowColor},0.25),
     0px 22px 22px 0px ${selectedAlbum.shadowColor},0.22),
     0px 49px 29px 0px ${selectedAlbum.shadowColor},0.13),
     0px 87px 35px 0px ${selectedAlbum.shadowColor},0.04),
     0px 136px 38px 0px ${selectedAlbum.shadowColor},0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.shadowColor]);

  const activePage = pages[pages.length - 1];
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
  const { data: artworkUrl, isLoading: isArtworkLoading } = useQuery(
    ["albumArtworkUrl", review?.albumId],
    () => fetchArtworkUrl(review?.albumId),
    {
      enabled: !!review?.albumId && selectedAlbum?.id !== review?.albumId,
    }
  );

  if (!review) return null;

  return (
    <div className="flex flex-col rounded-[32px] w-full h-full overflow-scroll scrollbar-none relative bg-white border border-silver">
      <div className="flex items-end p-8 gap-8">
        <EntryPreview review={review} />

        {/* Art  */}
        <Image
          className="rounded-[16px]"
          src={
            artworkUrl || selectedAlbum?.artworkUrl || "/images/default.webp"
          }
          alt={`${selectedAlbum?.attributes.name} artwork`}
          width={220} // Set this to a low value
          height={220} // Set this to the same low value
          onDragStart={(e) => e.preventDefault()}
          style={{ boxShadow: boxShadow }}
        />
      </div>

      {/* Replies  */}
      <RenderReplies threadcrumbs={threadcrumbs} />

      {/* Reply Input  */}
      <div className="w-[482px] fixed bottom-8 left-8 flex items-center gap-2 bg-[#F5F5F5] p-2 rounded-xl">
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
