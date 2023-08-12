import React from "react";
import { ReviewData } from "@/lib/global/interfaces";
import { EntryUser } from "./EntryUser";

type SoundtrackProps = {
  reviews: ReviewData[];
};

// EntrySection Component
const Soundtrack: React.FC<SoundtrackProps> = ({ reviews }) => {
  return (
    <div className="flex flex-col mt-[80px] pb-32 p-6 gap-4 w-full">
      {reviews.map((review: ReviewData, i: number) => (
        <EntryUser key={i.toString()} review={review} /> // Note the change here
      ))}
    </div>
  );
};

export default Soundtrack;
