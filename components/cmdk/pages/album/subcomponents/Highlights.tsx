import React from "react";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import { AlbumData } from "@/lib/global/interfaces";
import { EntryAlbum } from "./EntryAlbum";
import { Session } from "next-auth/core/types";

interface HighlightsProps {
  selectedAlbum: AlbumData;
  user: Session["user"];
}

const Highlights: React.FC<HighlightsProps> = ({ selectedAlbum, user }) => {
  const sortOrder = "rating_high_to_low";
  const reviewsQuery = useReviewsQuery(selectedAlbum, user, sortOrder);

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = reviewsQuery;

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <div className="flex flex-col gap-8 overflow-visible h-full">
      {flattenedReviews?.length > 0 ? (
        flattenedReviews.map((review) => (
          <EntryAlbum key={review.id} review={review} />
        ))
      ) : (
        <div className="text-xs text-gray2 p-2">surrender the sound.</div>
      )}
    </div>
  );
};

export default Highlights;
