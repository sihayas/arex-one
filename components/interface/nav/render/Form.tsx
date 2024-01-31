import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { postEntry } from "@/lib/apiHelper/form";
import { useSoundContext } from "@/context/SoundContext";

// import Dial from "./search/Dial";

import RatingDial from "@/components/interface/nav/items/search/RatingDial";
import { useNavContext } from "@/context/NavContext";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { AlbumData, SongData } from "@/types/appleTypes";
import Heart from "@/components/global/Heart";
import { AnimatePresence, motion } from "framer-motion";
import { useSound } from "@/hooks/usePage";

const Form = () => {
  const { user } = useInterfaceContext();
  const { selectedFormSound, setSelectedFormSound } = useSoundContext();
  const { inputRef, inputValue, setInputValue } = useNavContext();
  const { handleSelectSound } = useSound();

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
    .replace("{w}", "780")
    .replace("{h}", "780");
  const name = selectedFormSound.attributes.name;
  const artist = selectedFormSound.attributes.artistName;

  // handle sound clikc and prevent default
  const handleSoundClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    handleSelectSound(selectedFormSound);
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit} className={`flex p-8`}>
      <motion.div
        initial={{
          scale: 0.75,
          // rotateX: -30,
          // rotateY: -15,
          opacity: 0,
          filter: "blur(8px)",
        }}
        animate={{
          scale: 1,
          // rotateX: 0,
          // rotateY: 0,
          rotateZ: -2,
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          type: "spring",
          stiffness: 48,
          damping: 12,
          mass: 2,
          delay: 0.24,
        }}
        className={`shadow-miniCard relative flex h-[322px] w-[322px] origin-center flex-col overflow-hidden rounded-3xl bg-white will-change-transform`}
        style={{ perspective: 1000 }}
      >
        <Image
          onClick={handleSoundClick}
          className={`cursor-pointer`}
          src={artwork}
          alt={`${name} artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />

        <div className={`absolute left-0 top-0 p-4`}>
          <RatingDial setRatingValue={handleRatingChange} />
          <AnimatePresence>
            <motion.div
              initial={{
                scale: 0.75,
                opacity: 0,
                filter: "blur(8px)",
              }}
              className={`center-x center-y absolute font-serif text-2xl leading-[16px] text-white`}
            >
              {rating}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={`absolute bottom-0 left-0 flex flex-col p-4 drop-shadow`}
        >
          <h3 className={`line-clamp-1 text-base font-bold text-white`}>
            {name}
          </h3>
          <h4 className={`line-clamp-1 text-base font-medium text-white`}>
            {artist}
          </h4>
        </div>
      </motion.div>
    </form>
  );
};

export default Form;
