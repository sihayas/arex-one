import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchUserReview, postReview } from "@/lib/api/formAPI";
import { useCMDKAlbum } from "@/context/Sound";
import { useCMDK } from "@/context/Interface";

import generateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { SendIcon, ArrowIcon } from "@/components/icons";
import Dial from "./items/Dial";

const Form = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { selectedFormSound, setSelectedFormSound } = useCMDKAlbum();
  const { inputRef, inputValue, setInputValue, expandInput } = useCMDK();
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);
  const [loved, setLoved] = useState(false);

  const replay = useQuery(
    ["userReview", selectedFormSound?.sound.id, userId],
    () =>
      selectedFormSound && userId
        ? fetchUserReview(selectedFormSound.sound.id, userId)
        : null,
    {
      enabled: !!selectedFormSound && !!userId,
    }
  ).data;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement> | null) => {
      event?.preventDefault();

      const gatherSubmissionData = () => {
        let albumId = undefined;
        let trackId = undefined;

        if (selectedFormSound?.sound.type === "albums") {
          albumId = selectedFormSound.sound.id;
        } else if (selectedFormSound?.sound.type === "songs") {
          trackId = selectedFormSound.sound.id;
        }

        return {
          rating: rating,
          loved: loved,
          content: inputValue,
          replay: replay,
          userId: userId,
          albumId: albumId,
          trackId: trackId,
        };
      };

      const submissionData = gatherSubmissionData();

      toast.promise(
        postReview(submissionData).then(() => {
          setSelectedFormSound(null); // Set selectedFormSound to null on success
          setInputValue(""); // Reset input value on success
        }),
        {
          loading: "Submitting review...",
          success: "Review submitted successfully", // Just a string message
          error: "Error submitting review",
        }
      );
    },
    [
      rating,
      loved,
      inputValue,
      replay,
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
    replay,
    userId,
    selectedFormSound,
    handleSubmit,
    inputRef,
  ]);

  if (!selectedFormSound) return;

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  const albumArtworkUrl = generateArtworkUrl(
    selectedFormSound.sound.attributes.artwork.url,
    "928"
  );
  const soundArtworkUrl = generateArtworkUrl(
    selectedFormSound.sound.attributes.artwork.url,
    "260"
  );

  const renderAlbumSection = () => (
    <div className="flex flex-col gap-4 p-6 w-full">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-xl shadow-stars"
        src={albumArtworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={464}
        height={464}
        quality={100}
        draggable="false"
        priority={true}
      />

      <div className="grid grid-cols-3 items-center text-center">
        {/* Left / Back */}
        {!inputValue ? (
          <div className="flex items-center">
            <ArrowIcon color={"#999"} width={16} height={16} />
            <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
              backspace
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {/* Center / Names */}
        <div className="flex flex-col gap-1 text-sm text-gray items-center">
          <div className="font-semibold line-clamp-1">
            {selectedFormSound.sound.attributes.name}
          </div>
          <div className="line-clamp-1">
            {selectedFormSound.sound.attributes.artistName}
          </div>
        </div>
        {/* Right / Send */}
        {inputValue || rating > 0 ? (
          <div className="justify-self-end flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
                enter / send
              </div>
              <SendIcon color={"#999"} width={16} height={16} />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
                ⌘ enter / send love
              </div>
              <SendIcon color={"#999"} width={16} height={16} />
            </div>
          </div>
        ) : (
          <div className="justify-self-end flex items-center">
            <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
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

  const renderSongSection = () => (
    <div className="flex items-center gap-6 p-6 py-4 w-full relative">
      <Image
        id={selectedFormSound.sound.id}
        className="rounded-[6px] shadow-index"
        src={soundArtworkUrl}
        alt={`${selectedFormSound.sound.attributes.name} artwork`}
        width={80}
        height={80}
        quality={100}
        draggable="false"
      />
      <div className="flex items-center justify-between w-full">
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
              <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
                enter / send
              </div>
              <SendIcon color={"#999"} width={16} height={16} />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
                ⌘ enter / send love
              </div>
              <SendIcon color={"#999"} width={16} height={16} />
            </div>
          </div>
        ) : (
          <div className="justify-self-end flex items-center">
            <div className="text-xs text-gray1 px-1 rounded border border-silver w-fit font-semibold">
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
