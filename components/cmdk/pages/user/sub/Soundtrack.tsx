import React from "react";
import { ReviewData } from "@/lib/global/interfaces";
import { EntryUser } from "./EntryUser";

type SoundtrackProps = {
  reviews: ReviewData[];
};

// EntrySection Component
const Soundtrack: React.FC<SoundtrackProps> = ({ reviews }) => {
  return (
    <div className="flex flex-col mt-[80px] pt-7 gap-8 w-full items-center">
      {reviews.map((review: ReviewData, i: number) => (
        <>
          <EntryUser key={i.toString()} review={review} />
          <div className="w-[90%] h-[1px] bg-silver"></div>
        </>
      ))}
    </div>
  );
};

export default Soundtrack;
