import React from "react";
import { ReviewData } from "@/lib/global/interfaces";
import { EntryAlbum } from "./EntryAlbum";

interface RenderReviewsProps {
  reviews: ReviewData[];
  isActive: boolean;
}

const RenderReviews: React.FC<RenderReviewsProps> = ({ reviews, isActive }) => {
  return (
    <div className={`flex flex-col gap-8 overflow-visible h-full`}>
      {reviews?.length > 0 ? (
        reviews.map((review) => <EntryAlbum key={review.id} review={review} />)
      ) : (
        <div className="text-xs text-gray2 p-2">surrender the sound.</div>
      )}
    </div>
  );
};

export default RenderReviews;
