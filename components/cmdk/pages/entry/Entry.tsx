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
import useCMDKContext from "../../../../hooks/useCMDKContext";
import useCMDKAlbum from "../../../../hooks/useCMDKAlbum";
import useThreadcrumbs from "../../../../hooks/useThreadcrumbs";

export const Entry = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { selectedAlbum, artworkUrl } = useCMDKAlbum();
  const { selectedReviewId } = useCMDKContext();
  const { threadcrumbs, addToThreadcrumbs, replyParent, setReplyParent } =
    useThreadcrumbs();

  // Review init
  const [review, setReview] = useState<ReviewData | null>(null);

  // Review interaction
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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
        <Image
          className="rounded-t-2xl z-0 brightness-75"
          src={artworkUrl}
          alt={`${selectedAlbum?.attributes.name} artwork`}
          width={560}
          height={560}
          quality={100}
          priority
        />

        {/* Main Review */}
        <div className="flex flex-col h-fit w-full absolute bottom-0 ">
          {/* Review Text  */}
          <div className="flex gap-12">
            <div></div>
            <div className="backdrop-blur-md bg-blurEntry rounded-2xl rounded-r-none w-fill">
              <div className="text-sm text-white break-words p-4">
                {review.content}
              </div>
            </div>
          </div>
          {/* Attribution */}
          <div className="flex gap-4 items-center p-4">
            {/* Outer  */}
            <div className="flex items-center gap-2 backdrop-blur-md bg-blurEntry rounded-full pl-1 pr-2 py-1">
              {/* Name and Avatar  */}
              <div className="flex items-center gap-[6px]">
                <UserAvatar
                  imageSrc={review.author?.image}
                  altText={`${review.author?.name}'s avatar`}
                />
                <UserName color="white" username={review.author.username} />
              </div>
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Stars rating={review.rating} />
                <DividerIcon width={5} height={5} />
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
      <div className="w-full h-full flex flex-col p-5 pb-20">
        <RenderReplies replyIds={threadcrumbs} reviewId={selectedReviewId} />
      </div>

      {/* Reply Input  */}
      <div className="flex w-full items-center gap-2 fixed bottom-0 p-4 bg-blurEntry backdrop-blur-md rounded-b-2xl">
        <UserAvatar
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
