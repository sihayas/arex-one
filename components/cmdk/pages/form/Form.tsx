import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import Love from "./buttons/Love";
import Listened from "./buttons/Listened";
// import Slider from "./buttons/Slider";
import { useSession } from "next-auth/react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { toast } from "sonner";
import { fetchUserReview } from "@/lib/api/formAPI";
import { postReview } from "@/lib/api/formAPI";

export default function Form() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { selectedAlbum } = useCMDKAlbum();

  const hasReviewed = useQuery(
    ["userReview", selectedAlbum?.id, userId],
    () => (userId ? fetchUserReview(selectedAlbum!.id, userId) : null),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!userId,
    }
  ).data;

  // Manage form values using state
  const [rating, setRating] = useState(0);
  const [loved, setLoved] = useState(false);
  const [listened, setListened] = useState(false);
  const [entryText, setEntryText] = useState("");

  const handleLovedChange = () => setLoved((prevLoved) => !prevLoved);
  const handleListenedChange = () =>
    setListened((prevListened) => !prevListened);
  const handleEntryTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => setEntryText(event.target.value);
  const handleRatingChange = (newValue: React.SetStateAction<number>) => {
    setRating(newValue);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.promise(
      postReview(
        listened,
        rating,
        loved,
        entryText,
        hasReviewed,
        userId,
        selectedAlbum?.id,
        selectedAlbum?.attributes.name
      ),
      {
        loading: "Submitting review...",
        success: "Review submitted successfully",
        error: "Error submitting review",
      }
    );
  };

  // Render the form
  return (
    <form
      className="w-full h-full bg-white rounded-2xl"
      onSubmit={handleSubmit}
    >
      <div className="flex w-full h-full">
        <Image
          className="rounded-2xl rounded-tr-none rounded-br-none"
          src={selectedAlbum?.artworkUrl || `/images/placeholder.png`}
          alt={`${selectedAlbum?.attributes.name} artwork`}
          width={480}
          height={480}
          draggable="false"
        />
        <div className="p-8 mt-4 flex flex-col gap-4 w-full">
          {/* Names */}
          <div className="flex items-center justify-center">
            <div className="text-xs text-grey">
              {selectedAlbum?.attributes.name} -{" "}
              {selectedAlbum?.attributes.artistName}
            </div>
          </div>
          <div className="-mt-4">
            {/* <Slider onValueChange={handleRatingChange} /> */}
          </div>
          <TextareaAutosize
            id="entryText"
            className="w-full bg-transparent border rounded-[4px] p-2 resize-none focus:border-transparent focus:outline-none transition-colors duration-150 text-greyTitle text-sm"
            minRows={12}
            maxRows={12}
            disabled={!session}
            value={entryText}
            onChange={handleEntryTextChange}
          />
          <div className="flex gap-2 justify-between items-center">
            <div className="flex">
              <Listened
                isLoggedIn={session ? true : false}
                handleListenedChange={handleListenedChange}
              />
              <Love
                isLoggedIn={session ? true : false}
                handleLovedChange={handleLovedChange}
              />
            </div>

            <button
              type="submit"
              className="px-2 border border-silver text-xs text-grey rounded-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
