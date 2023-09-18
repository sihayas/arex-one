import React from "react";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import { EntryAlbum } from "./EntryAlbum";
import { Session } from "next-auth/core/types";

interface SongsProps {
  songId: string;
  user: Session["user"];
}

const Songs: React.FC<SongsProps> = ({ songId, user }) => {
  const sortOrder = "rating_high_to_low";
  const reviewsQuery = useReviewsQuery(songId, user, sortOrder);

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = reviewsQuery;

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <div className="flex h-full w-full flex-col gap-8 pb-96">
      {flattenedReviews?.length > 0 ? (
        flattenedReviews.map((review) => (
          <EntryAlbum key={review.id} review={review} />
        ))
      ) : (
        <div className="p-2 text-xs uppercase text-gray2">
          {/* surrender the sound */}
        </div>
      )}
    </div>
  );
};

export default Songs;
