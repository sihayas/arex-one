import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { postEntry } from "@/lib/apiHandlers/formAPI";
import { useSound } from "@/context/SoundContext";

import Dial from "./items/Dial";
import { useNavContext } from "@/context/NavContext";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AlbumData, SongData } from "@/types/appleTypes";

const Form = () => {
  const { user } = useInterfaceContext();
  const { selectedFormSound, setSelectedFormSound } = useSound();
  const { inputRef, inputValue, setInputValue } = useNavContext();

  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);
  const [loved, setLoved] = useState(false);

  const userId = user!.id;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement> | null) => {
      event?.preventDefault();

      const gatherSubmissionData = () => {
        const sound = selectedFormSound?.sound;
        if (!sound) return undefined;
        const type: "albums" | "songs" =
          sound.type === "albums" ? "albums" : "songs";
        return {
          text: inputValue,
          rating,
          loved,
          userId,
          sound: sound as AlbumData | SongData,
          type: type,
        };
      };

      const submissionData = gatherSubmissionData();

      if (!submissionData) {
        toast.error(
          "Error: Sound data is missing. Please make a valid selection.",
        );
        return;
      }

      toast.promise(
        postEntry(submissionData).then(() => {
          setSelectedFormSound(null); // Set selectedFormSound to null on success
          setInputValue(""); // Reset input value on success
        }),
        {
          loading: "Sending...",
          success: "Sent!",
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

  // CMD+Enter to Submit. Focus on input if letter is pressed.
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
  }, [handleSubmit, inputRef]);

  if (!selectedFormSound) return;

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  // Album styles
  const renderAlbumSection = () => (
    <Image
      id={selectedFormSound.sound.id}
      className="rounded-xl shadow-shadowKitHigh outline outline-silver outline-1"
      src={selectedFormSound.artworkUrl}
      alt={`${selectedFormSound.sound.attributes.name} artwork`}
      width={198}
      height={198}
    />
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={`flex`}>
      {renderAlbumSection()}
      <Dial setRatingValue={handleRatingChange} />
      {/*<NewDial />*/}
    </form>
  );
};

export default Form;
