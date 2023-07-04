import Image from "next/image";
import { useState, useEffect, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { LoveIcon, DividerIcon } from "../../../icons";
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
import AnimatedGradient from "@/components/random-bullshit-go/AnimatedGradient";
import { useQuery } from "@tanstack/react-query";

export const Entry = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { selectedAlbum } = useCMDKAlbum();
  const { selectedReviewId } = useCMDKContext();
  const { threadcrumbs, addToThreadcrumbs, setReplyParent } = useThreadcrumbs();

  // Review initial state
  const [review, setReview] = useState<ReviewData | null>(null);

  // Review interaction
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchArtworkUrl = async (albumId: string) => {
    const response = await axios.get(
      `/api/album/getAlbumById?albumId=${albumId}`
    );
    console.log("Artwork url: ", response.data.artworkUrl);
    return response.data;
  };

  const { data: artworkUrl, isLoading: isArtworkLoading } = useQuery(
    ["albumArtworkUrl", review?.albumId],
    () => fetchArtworkUrl(review?.albumId),
    {
      enabled: !!review?.albumId && selectedAlbum?.id !== review?.albumId,
    }
  );

  useEffect(() => {
    // Track whether component is mounted
    let isMounted = true;

    (async () => {
      const reviewData: AxiosResponse<ReviewData> = await axios.get(
        `/api/review/getById?id=${selectedReviewId}`
      );

      // Only update state if component is still mounted
      if (isMounted && selectedReviewId) {
        setReview(reviewData.data);
        setLiked(reviewData.data.likedByUser);
        setLikeCount(reviewData.data.likes.length);
        addToThreadcrumbs(selectedReviewId);
        setReplyParent(reviewData.data);
        console.log("reviewData.data", reviewData.data);
      }
    })();

    // Cleanup function to run when component unmounts
    return () => {
      isMounted = false;
    };
  }, [selectedReviewId]);

  const handleLikeClick = async (event: MouseEvent<HTMLButtonElement>) => {
    // This will stop the click event from propagating up to the parent components
    event.stopPropagation();

    if (!session) return;

    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post("/api/review/postLike", {
        selectedReviewId: selectedReviewId,
        userId,
        action,
      });

      if (response.data.success) {
        setLikeCount(response.data.likes);
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (!review) return null;

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
            src={artworkUrl || selectedAlbum?.artworkUrl}
            alt={`${selectedAlbum?.attributes.name} artwork`}
            width={40} // Set this to a low value
            height={40} // Set this to the same low value
            priority
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
          {/* <AnimatedGradient
            color1={"#443F49"}
            color2={"#425756"}
            color3={"#79BEB8"}
            bgColor={"#4DB1AA"}
          />*/}
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
                <DividerIcon color={"white"} width={5} height={5} />
                {review.loved && (
                  <LoveIcon width={16} height={16} color={"#FFF"} />
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
        <RenderReplies replyIds={threadcrumbs} reviewId={selectedReviewId} />
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
