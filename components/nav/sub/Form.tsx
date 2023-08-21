import { useCMDKAlbum } from "@/context/CMDKAlbum";
import Image from "next/image";
import generateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface FormProps {
  inputValue: string;
}

const Form = ({ inputValue }: FormProps) => {
  const { selectedSound, setSelectedSound } = useCMDKAlbum();

  if (!selectedSound) return;

  const albumArtworkUrl = generateArtworkUrl(
    selectedSound.sound.attributes.artwork.url,
    "928"
  );
  const soundArtworkUrl = generateArtworkUrl(
    selectedSound.sound.attributes.artwork.url,
    "200"
  );

  return (
    <>
      {selectedSound.sound.type === "albums" ? (
        <div className="flex flex-col gap-4 p-6 w-full relative">
          <Image
            id={selectedSound.sound.id}
            className="rounded-[6px] shadow-index"
            src={albumArtworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={464}
            height={464}
            draggable="false"
          />

          <div className="absolute bottom-10 left-10 flex flex-col text-sm text-white">
            <div className="font-semibold">
              {selectedSound.sound.attributes.name}
            </div>
            <div className="">{selectedSound.sound.attributes.artistName}</div>
          </div>
        </div>
      ) : selectedSound.sound.type === "songs" ? (
        <div className="flex items-center gap-6 p-6 w-full relative">
          <Image
            id={selectedSound.sound.id}
            className="rounded-[6px] shadow-index"
            src={soundArtworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={80}
            height={80}
            draggable="false"
          />

          <div className="flex flex-col text-xs text-black">
            <div className="font-semibold">
              {selectedSound.sound.attributes.name}
            </div>
            <div className="flex gap-1">
              <div className="">
                {selectedSound.sound.attributes.artistName}
              </div>
              <div>&ndash;</div>
              <div className="">{selectedSound.sound.attributes.albumName}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Form;
