import Image from "next/image";
import { Command } from "cmdk";
import { AlbumData, SongData } from "@/types/apple";
import { useNavContext } from "@/context/Nav";
import { PageSound } from "@/context/Interface";

const Sound = ({ sound }: { sound: AlbumData | SongData }) => {
  const { setFormSound, inputValue, setInputValue, setStoredInputValue } =
    useNavContext();

  const soundType = sound.type;
  const artwork = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    48 * 2.5,
    48 * 2.5,
  );

  const album = soundType === "albums" && (sound as AlbumData);
  const song = soundType === "songs" && (sound as SongData);
  const identifier = song
    ? song.attributes.isrc
    : album
    ? album.attributes.upc
    : null;

  if (!identifier) return null;

  const pageSound: PageSound = {
    apple_id: sound.id,
    type: soundType,
    name: sound.attributes.name,
    artist_name: sound.attributes.artistName,
    release_date: sound.attributes.releaseDate,
    artwork: MusicKit.formatArtworkURL(
      sound.attributes.artwork,
      320 * 2.5,
      320 * 2.5,
    ),
    identifier: identifier,
    song_relationships: {
      album_id: (song && song.relationships.albums.data[0].id) || "",
    },
  };

  const onSelect = async () => {
    setFormSound(pageSound);
    setStoredInputValue(inputValue);
    setInputValue("");
  };

  return (
    <Command.Item
      value={sound.id}
      onMouseDown={(e) => e.preventDefault()}
      className="z-10 flex w-full items-center gap-4 p-4 will-change-transform"
      onSelect={() => onSelect()}
    >
      <Image
        id={sound.id}
        className="rounded-lg"
        src={artwork}
        alt={`${sound.attributes.name} artwork`}
        width={38}
        height={38}
        draggable="false"
      />

      <div className="flex flex-col justify-center overflow-hidden">
        <div className="text-gray flex items-center gap-1 text-sm">
          <div className={`line-clamp-1`}>{sound.attributes.artistName}</div>
          {song && (
            <>
              <div>&middot;</div>
              <div className="line-clamp-1">{song.attributes.albumName}</div>
            </>
          )}
        </div>
        <div className="line-clamp-1 text-base font-medium text-black">
          {sound.attributes.name}
        </div>
      </div>
    </Command.Item>
  );
};

export default Sound;
