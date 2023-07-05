import React, { useState } from "react";
import { ReviewData } from "@/lib/interfaces";

export type ReviewDetailsContextType = {
  selectedReview: ReviewData | null;
  setSelectedReview: React.Dispatch<React.SetStateAction<ReviewData | null>>;
};

type ReviewDetailsProviderProps = {
  children: React.ReactNode;
};

export const ReviewDetailsContext = React.createContext<
  ReviewDetailsContextType | undefined
>(undefined);

export const ReviewDetailsProvider = ({
  children,
}: ReviewDetailsProviderProps) => {
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  return (
    <ReviewDetailsContext.Provider
      value={{
        selectedReview,
        setSelectedReview,
      }}
    >
      {children}
    </ReviewDetailsContext.Provider>
  );
};
