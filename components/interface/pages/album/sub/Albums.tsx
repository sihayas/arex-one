import React from "react";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import { EntryAlbum } from "./EntryAlbum";
import { Session } from "next-auth/core/types";

interface AlbumsProps {
  albumId: string;
  user: Session["user"];
}

const Albums: React.FC<AlbumsProps> = ({ albumId, user }) => {
  const sortOrder = "rating_high_to_low";
  const reviewsQuery = useReviewsQuery(albumId, user, sortOrder);

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = reviewsQuery;

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <div className="flex flex-col gap-8 p-8 w-full h-full">
      {flattenedReviews?.length > 0 ? (
        flattenedReviews.map((review) => (
          <EntryAlbum key={review.id} review={review} />
        ))
      ) : (
        <div className="text-xs text-gray2 p-2 uppercase">
          {/* surrender the sound */}
        </div>
      )}
    </div>
  );
};

export default Albums;
