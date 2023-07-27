import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import Love from "./buttons/Love";
import Listened from "./buttons/Listened";
import Slider from "./buttons/Slider";
import { useSession } from "next-auth/react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { toast } from "sonner";

// Fetch user review for the album and signed-in user
const fetchUserReview = async (albumId: string, userId: string) => {
  try {
    const response = await axios.get(
      `/api/review/formCheck?albumId=${albumId}&userId=${userId}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error fetching user review:", error);
    return false;
  }
};

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

  // Handle form field changes
  const handleLovedChange = () => setLoved((prevLoved) => !prevLoved);

  const handleListenedChange = () =>
    setListened((prevListened) => !prevListened);

  const handleEntryTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => setEntryText(event.target.value);

  const handleRatingChange = (newValue: React.SetStateAction<number>) => {
    console.log("Rating changed: ", newValue); // This line will log every change
    setRating(newValue);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Define your async function
    const postReview = async () => {
      const response = await axios.post("/api/review/postReview", {
        listened,
        rating,
        loved,
        reviewText: entryText,
        isReReview: hasReviewed,
        authorId: userId,
        albumId: selectedAlbum?.id,
        albumName: selectedAlbum?.attributes.name,
      });

      if (response.status === 201) {
        console.log("Review submitted successfully", response.data);
      } else {
        throw new Error("Unexpected response status");
      }
    };

    // Use toast.promise
    toast.promise(postReview(), {
      loading: "Submitting review...",
      success: "Review submitted successfully",
      error: "Error submitting review",
    });
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
            <Slider onValueChange={handleRatingChange} />
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
