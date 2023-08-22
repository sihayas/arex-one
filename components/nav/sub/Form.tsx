import { useCMDKAlbum } from "@/context/CMDKAlbum";
import Image from "next/image";
import generateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import { useState } from "react";
import { SendIcon, ArrowIcon } from "@/components/icons";
import Dial from "./items/Dial";

interface FormProps {
  inputValue: string;
}

const Form = ({ inputValue }: FormProps) => {
  const { selectedSound, setSelectedSound } = useCMDKAlbum();
  const [rating, setRating] = useState(0);

  if (!selectedSound) return;

  const albumArtworkUrl = generateArtworkUrl(
    selectedSound.sound.attributes.artwork.url,
    "928"
  );
  const soundArtworkUrl = generateArtworkUrl(
    selectedSound.sound.attributes.artwork.url,
    "260"
  );

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  return (
    <>
      {selectedSound.sound.type === "albums" ? (
        <div className="flex flex-col gap-4 p-6 w-full">
          <Image
            id={selectedSound.sound.id}
            className="rounded-xl shadow-album"
            src={albumArtworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
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
              <div className="font-semibold">
                {selectedSound.sound.attributes.name}
              </div>
              <div className="">
                {selectedSound.sound.attributes.artistName}
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
      ) : selectedSound.sound.type === "songs" ? (
        <div className="flex items-center gap-6 p-6 py-4 w-full relative">
          <Image
            id={selectedSound.sound.id}
            className="rounded-[6px] shadow-index"
            src={soundArtworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={80}
            height={80}
            quality={100}
            draggable="false"
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col text-sm text-black">
              <div className="font-semibold">
                {selectedSound.sound.attributes.name}
              </div>
              <div className="flex gap-1">
                <div className="">
                  {selectedSound.sound.attributes.artistName}
                </div>
                <div>&ndash;</div>
                <div className="">
                  {selectedSound.sound.attributes.albumName}
                </div>
              </div>
            </div>
            {!inputValue ? (
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
            ) : (
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
            )}
          </div>
        </div>
      ) : null}
      <Dial setRatingValue={handleRatingChange} />
    </>
  );
};

export default Form;
