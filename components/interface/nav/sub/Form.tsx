import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { postEntry } from "@/lib/apiHelper/form";
import { useSoundContext } from "@/context/SoundContext";

import Dial from "./items/Dial";
import { useNavContext } from "@/context/NavContext";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AlbumData, SongData } from "@/types/appleTypes";
import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { motion } from "framer-motion";

const Form = () => {
  const { user } = useInterfaceContext();
  const { selectedFormSound, setSelectedFormSound } = useSoundContext();
  const { inputRef, inputValue, setInputValue } = useNavContext();

  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);
  const [loved, setLoved] = useState(false);

  const userId = user!.id;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement> | null) => {
      event?.preventDefault();

      const gatherSubmissionData = () => {
        const sound = selectedFormSound;
        if (!sound) return undefined;
        return {
          text: inputValue,
          rating,
          loved,
          userId,
          sound: sound as AlbumData | SongData,
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
          setSelectedFormSound(null);
          setInputValue("");
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

  const artwork = selectedFormSound.attributes.artwork.url
    .replace("{w}", "1200")
    .replace("{h}", "1200");
  const name = selectedFormSound.attributes.name;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={`flex p-8`}>
      <motion.div
        initial={{ scale: 0.8, rotate: 8, opacity: 0 }}
        animate={{ scale: 1, rotate: -3, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.4 }}
        className={`flex flex-col rounded-3xl bg-white relative w-[223px] h-[288px] shadow-miniCard will-change-transform overflow-hidden`}
      >
        <Image
          className={`cursor-pointer `}
          src={artwork}
          alt={`${name} artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />
      </motion.div>
      <Dial setRatingValue={handleRatingChange} />
      {/*<NewDial />*/}
    </form>
  );
};

export default Form;
