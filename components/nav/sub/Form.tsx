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
    "960"
  );
  const soundArtworkUrl = generateArtworkUrl(
    selectedSound.sound.attributes.artwork.url,
    "200"
  );

  // If user selects an album, load immersive form, if song, mini form.
  return (
    <>
      {selectedSound.sound.type === "albums" ? (
        <div className="flex flex-col gap-2 p-4 w-full">
          <Image
            id={selectedSound.sound.id}
            className="rounded-lg shadow-index"
            src={albumArtworkUrl}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={480}
            height={480}
            draggable="false"
          />

          <div className="flex flex-col justify-center items-center text-black text-xs">
            <div className="font-medium">
              {selectedSound.sound.attributes.name}
            </div>
            <div>{selectedSound.sound.attributes.artistName}</div>
          </div>
        </div>
      ) : selectedSound.sound.type === "songs" ? (
        <div>Songs Placeholder</div>
      ) : null}
    </>
  );
};

export default Form;
