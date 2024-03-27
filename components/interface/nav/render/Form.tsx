import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";

import RatingDial from "@/components/interface/nav/items/search/RatingDial";
import { useNavContext } from "@/context/Nav";
import { useInterfaceContext } from "@/context/Interface";
import { AnimatePresence, motion } from "framer-motion";
import { useSound } from "@/hooks/usePage";
import { createEntry } from "../../../../lib/helper/interface/nav";

const Form = () => {
  const { user } = useInterfaceContext();
  const {
    inputRef,
    inputValue,
    setInputValue,
    selectedFormSound,
    setSelectedFormSound,
  } = useNavContext();
  const { handleSelectSound } = useSound();

  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);
  const [loved, setLoved] = useState(false);

  const userId = user!.id;

  const appleData = selectedFormSound;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement> | null) => {
      event?.preventDefault();

      const gatherSubmissionData = () => {
        return {
          text: inputValue,
          rating,
          loved,
          userId,
          sound: appleData,
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
        // @ts-ignore
        createEntry(submissionData).then(() => {
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
      setSelectedFormSound,
      setInputValue,
      appleData,
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

  if (!appleData) return;

  const artwork = MusicKit.formatArtworkURL(
    appleData.attributes.artwork,
    322 * 2.5,
    322 * 2.5,
  );
  const name = appleData.attributes.name;
  const artist = appleData.attributes.artistName;

  // handle sound click and prevent default
  const handleSoundClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    handleSelectSound(selectedFormSound);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`-z-10 flex w-full flex-col overflow-visible `}
    >
      <form ref={formRef} onSubmit={handleSubmit} className={`flex p-8`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ scale: 0.75, opacity: 0, filter: "blur(8px)", rotate: 0 }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)", rotate: -2 }}
          transition={{
            type: "spring",
            stiffness: 48,
            damping: 12,
            mass: 1.5,
          }}
          className={`relative flex h-[304px] w-[304px] origin-center flex-col overflow-hidden rounded-2xl bg-white shadow-test will-change-transform`}
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
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.24 }}
                key={rating}
                className={`center-x center-y absolute text-2xl font-bold leading-[16px] tracking-tighter text-white`}
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
    </motion.div>
  );
};

export default Form;
