import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { postEntry } from "@/lib/apiHandlers/formAPI";
import { useSound } from "@/context/SoundContext";

import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import Dial from "./items/Dial";
import { useNavContext } from "@/context/NavContext";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Form = () => {
  const { user } = useInterfaceContext();

  const userId = user!.id;

  const { selectedFormSound, setSelectedFormSound } = useSound();

  const { inputRef, inputValue, setInputValue } = useNavContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);
  const [loved, setLoved] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement> | null) => {
      event?.preventDefault();

      const gatherSubmissionData = () => {
        let appleAlbumId = undefined;
        let appleTrackId = undefined;

        if (selectedFormSound?.sound.type === "albums") {
          appleAlbumId = selectedFormSound.sound.id;
        } else if (selectedFormSound?.sound.type === "songs") {
          appleTrackId = selectedFormSound.sound.id;
        }

        return {
          text: inputValue,
          rating: rating,
          loved: loved,
          userId: userId,
          appleAlbumId: appleAlbumId,
          appleTrackId: appleTrackId,
        };
      };

      const submissionData = gatherSubmissionData();

      toast.promise(
        postEntry(submissionData).then(() => {
          setSelectedFormSound(null); // Set selectedFormSound to null on success
          setInputValue(""); // Reset input value on success
        }),
        {
          loading: "sending...",
          success: "sent", // Just a string message
          error: "Error submitting review",
        },
      );
    },
    [
      rating,
      loved,
      inputValue,
      userId,
      selectedFormSound,
      setSelectedFormSound,
      setInputValue,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        (event.metaKey || event.ctrlKey) &&
        inputRef.current === document.activeElement
      ) {
        setLoved(true);
        handleSubmit(null);
      } else if (event.key.match(/^[a-zA-Z]$/)) {
        // Check if the key is a letter
        inputRef.current?.focus(); // Focus on the input if it is
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    rating,
    loved,
    inputValue,
    userId,
    selectedFormSound,
    handleSubmit,
    inputRef,
  ]);

  if (!selectedFormSound) return;

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  const artworkUrl = GenerateArtworkUrl(
    selectedFormSound.sound.attributes.artwork.url,
    "800",
  );

  // Album styles
  const renderAlbumSection = () => (
    <div className="flex w-full gap-2 p-4 pt-2">
      <div className="text-sm mt-auto ml-auto mb-2 text-gray4">
        {selectedFormSound.sound.attributes.name}
      </div>
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-2xl shadow-shadowKitLow outline outline-silver outline-1"
        src={artworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={160}
        height={160}
      />
    </div>
  );

  // Song styles
  const renderSongSection = () => (
    <div className="flex w-full relative items-center gap-4 p-4 py-4">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-lg shadow-shadowKitLow outline outline-silver outline-1"
        src={artworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={160}
        height={160}
        quality={100}
      />
    </div>
  );

  return (
    <div className={`h-full`}>
      <form ref={formRef} onSubmit={handleSubmit}>
        {selectedFormSound.sound.type === "albums" && renderAlbumSection()}
        {selectedFormSound.sound.type === "songs" && renderSongSection()}
        <Dial setRatingValue={handleRatingChange} />
      </form>
    </div>
  );
};

export default Form;
