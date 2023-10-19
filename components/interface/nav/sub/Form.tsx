import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { postEntry } from "@/lib/apiHandlers/formAPI";
import { useSound } from "@/context/SoundContext";

import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { SendIcon, ArrowIcon } from "@/components/icons";
import Dial from "./items/Dial";
import { useInputContext } from "@/context/InputContext";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Form = () => {
  const { user } = useInterfaceContext();

  const userId = user!.id;

  const { selectedFormSound, setSelectedFormSound } = useSound();

  const { inputRef, inputValue, setInputValue, expandInput } =
    useInputContext();
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
        }
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
    ]
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
    "800"
  );

  const renderAlbumSection = () => (
    <div className="flex w-full flex-col gap-4 p-4">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-lg shadow-feedArt"
        src={artworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={464}
        height={464}
        quality={100}
        draggable="false"
        priority={true}
      />

      {/* Center / Names */}
      <div className="flex flex-col gap-[9px] text-sm text-black w-full">
        <div className="line-clamp-1 text-xs leading-none">
          {selectedFormSound.sound.attributes.artistName}
        </div>
        <div className="line-clamp-1 leading-none">
          {selectedFormSound.sound.attributes.name}
        </div>
      </div>
    </div>
  );

  const renderSongSection = () => (
    <div className="relative flex w-full items-center gap-4 p-4 py-4">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-[6px] shadow-index"
        src={artworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={80}
        height={80}
        quality={100}
        draggable="false"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col text-sm text-black">
          <div className="font-semibold">
            {selectedFormSound.sound.attributes.name}
          </div>
          <div className="flex gap-1">
            <div className="">
              {selectedFormSound.sound.attributes.artistName}
            </div>
            <div>&ndash;</div>
            {/* <div className="">{selectedFormSound.sound.attributes.albumName}</div> */}
          </div>
        </div>
        {inputValue || rating > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-fit rounded border px-1 text-xs font-semibold text-gray1 border-silver">
                enter / send
              </div>
              <SendIcon color={"#999"} width={16} height={16} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-fit rounded border px-1 text-xs font-semibold text-gray1 border-silver">
                ⌘ enter / send love
              </div>
              <SendIcon color={"#999"} width={16} height={16} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-self-end">
            <div className="w-fit rounded border px-1 text-xs font-semibold text-gray1 border-silver">
              enter
            </div>
            <ArrowIcon
              className={"rotate-180"}
              color={"#999"}
              width={16}
              height={16}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form
      className="h-full overflow-hidden"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      {selectedFormSound.sound.type === "albums" && renderAlbumSection()}
      {selectedFormSound.sound.type === "songs" && renderSongSection()}
      {expandInput && <Dial setRatingValue={handleRatingChange} />}
    </form>
  );
};

export default Form;
