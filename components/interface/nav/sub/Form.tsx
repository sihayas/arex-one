import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { postEntry } from "@/lib/apiHandlers/formAPI";
import { useSound } from "@/context/SoundContext";

import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import Dial from "./items/Dial";
import { useNavContext } from "@/context/NavContext";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion } from "framer-motion";

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

  const renderAlbumSection = () => (
    <div className="flex w-full flex-col gap-2 p-4 pl-[42px] pt-2">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-xl shadow-shadowKitHigh outline outline-silver outline-1"
        src={artworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={464}
        height={464}
        quality={100}
        draggable="false"
        priority={true}
      />

      {/* Center / Names */}
      <div className="flex flex-col text-sm text-black w-full text-end">
        <div className="line-clamp-1 text-xs text-gray2">
          {selectedFormSound.sound.attributes.artistName}
        </div>
        <div className="line-clamp-1 font-medium">
          {selectedFormSound.sound.attributes.name}
        </div>
      </div>
    </div>
  );

  const renderSongSection = () => (
    <div className="relative flex w-full items-center gap-4 p-4 py-4">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-lg shadow-shadowKitLow outline outline-silver outline-1"
        src={artworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={80}
        height={80}
        quality={100}
        draggable="false"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col text-sm text-black">
          <div className="font-semibold line-clamp-1">
            {selectedFormSound.sound.attributes.name}
          </div>
          <div className="line-clamp-1">
            {selectedFormSound.sound.attributes.artistName}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 60 }}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        {selectedFormSound.sound.type === "albums" && renderAlbumSection()}
        {selectedFormSound.sound.type === "songs" && renderSongSection()}
        <Dial setRatingValue={handleRatingChange} />
      </form>
    </motion.div>
  );
};

export default Form;
