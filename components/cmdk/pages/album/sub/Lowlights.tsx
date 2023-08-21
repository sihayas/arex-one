import React from "react";
import { Session } from "next-auth/core/types";

import { useReviewsQuery } from "@/lib/api/albumAPI";
import { SelectedSound } from "@/lib/global/interfaces";
import { EntryAlbum } from "./EntryAlbum";

interface LowlightsProps {
  selectedSound: SelectedSound;
  user: Session["user"];
}

const Lowlights: React.FC<LowlightsProps> = ({ selectedSound, user }) => {
  const sortOrder = "rating_low_to_high";
  const reviewsQuery = useReviewsQuery(selectedSound, user, sortOrder);

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = reviewsQuery;

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <>
      <div className="w-full"></div>
      <div className="flex flex-col gap-8 h-full w-full">
        {flattenedReviews?.length > 0 ? (
          flattenedReviews.map((review) => (
            <EntryAlbum key={review.id} review={review} />
          ))
        ) : (
          <div className="text-xs text-gray2 p-2">surrender the sound.</div>
        )}
      </div>
    </>
  );
};

export default Lowlights;
