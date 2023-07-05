import Image from "next/image";
import { useState, useEffect, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { AsteriskIcon, DividerIcon } from "../../../icons";
import { ReviewData } from "../../../../lib/interfaces";
import {
  UserName,
  UserAvatar,
  LikeButton,
  ReplyInput,
  Stars,
} from "../../generics";
import { RenderReplies } from "./subcomponents/RenderReplies";
import useCMDKContext from "../../../../hooks/useCMDK";
import useCMDKAlbum from "../../../../hooks/useCMDKAlbum";
import useThreadcrumbs from "../../../../hooks/useThreadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { getAlbumById } from "@/lib/musicKit";

const generateArtworkUrl = (urlTemplate: String) => {
  return urlTemplate.replace("{w}", "2500").replace("{h}", "2500");
};

export const Entry = () => {
  const { data: session } = useSession();
  // Review interaction
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Context
  const { selectedAlbum } = useCMDKAlbum();
  const { pages } = useCMDKContext();
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumbs();

  const activePage = pages[pages.length - 1];
  const firstThreadcrumb = activePage.threadcrumbs?.[0];

  // If reviewId [first item in threadcrumb] changes, re-render Entry
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
      setLiked(review.likedByUser);
      setLikeCount(review.likes.length);
      setReplyParent(review);
    }
  }, [review, setReplyParent]);

  const fetchArtworkUrl = async (albumId: string | undefined) => {
    if (!albumId) {
      console.log("fetchArtworkURl didnt get an albumId");
      return null;
    }

    const albumData = await getAlbumById(albumId);
    const artworkUrl = generateArtworkUrl(albumData.attributes.artwork.url);

    return artworkUrl;
  };

  const { data: artworkUrl, isLoading: isArtworkLoading } = useQuery(
    ["albumArtworkUrl", review?.albumId],
    () => fetchArtworkUrl(review?.albumId),
    {
      enabled: !!review?.albumId && selectedAlbum?.id !== review?.albumId,
    }
  );

  const handleLikeClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!session) {
      // console.log("User not logged in");
      return;
    }

    const userId = session.user.id;
    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post("/api/review/postLike", {
        reviewId,
        action,
        userId,
      });

      if (response.data.success) {
        setLikeCount(response.data.likes);
        setLiked(!liked);
        console.log("like update response", response.data);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (!review) return null;

  console.log("rendered entry", activePage.threadcrumbs);

  return (
    <div className="flex flex-col rounded-2xl w-full h-full overflow-scroll scrollbar-none relative">
      {/* Section One */}
      <div className="w-full relative">
        {/* Art  */}
        <div
          className="relative overflow-visible"
          style={{ width: "560px", height: "560px" }}
        >
          <Image
            src={
              artworkUrl || selectedAlbum?.artworkUrl || "/images/default.webp"
            }
            alt={`${selectedAlbum?.attributes.name} artwork`}
            width={40} // Set this to a low value
            height={40} // Set this to the same low value
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(80px)",
              transform: "translate3d(0,0,0)",
            }}
          />
        </div>

        {/* Main Review */}
        <div className="flex flex-col h-fit w-full absolute bottom-0 ">
          {/* Review Text  */}
          <div className="flex gap-12 p-4 pb-0">
            <div className="backdrop-blur-md bg-blurEntry rounded-2xl  w-fill">
              <div className="text-sm text-white break-words p-4">
                {review.content}
              </div>
            </div>
          </div>
          {/* Attribution */}
          <div className="flex gap-4 items-center p-4">
            {/* Outer  */}
            <div className="flex items-center gap-2 backdrop-blur-md bg-blurEntry rounded-full pl-1 pr-2 py-1">
              <UserAvatar
                imageSrc={review.author?.image}
                altText={`${review.author?.name}'s avatar`}
                width={26}
                height={26}
              />
              <UserName color="white" username={review.author.username} />
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Stars color={"white"} rating={review.rating} />
                {review.loved && (
                  <>
                    <DividerIcon color={"#FFF"} width={5} height={5} />
                    <AsteriskIcon width={16} height={16} color={"#FFF"} />
                  </>
                )}
              </div>
            </div>

            <LikeButton
              handleLikeClick={(event) => handleLikeClick(event)}
              liked={liked}
              likeCount={likeCount}
            />
          </div>
        </div>
      </div>

      {/* Replies  */}
      <div className="w-full h-full flex flex-col p-4 pb-20">
        <RenderReplies replyIds={threadcrumbs} reviewId={reviewId!} />
      </div>

      {/* Reply Input  */}
      <div className="w-full fixed bottom-2 p-4 ">
        <div className="flex p-2 items-center gap-2 bg-blurEntry backdrop-blur-md rounded-full border border-silver">
          <UserAvatar
            imageSrc={review.author?.image}
            altText={`${review.author?.name}'s avatar`}
            width={28}
            height={28}
          />
          <ReplyInput />
        </div>
      </div>
    </div>
  );
};

export default Entry;
