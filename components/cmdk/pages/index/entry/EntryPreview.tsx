import { UserAvatar, generateArtworkUrl } from "@/components/cmdk/generics";
import { ReviewData } from "@/lib/interfaces";
import Image from "next/image";
import { getAlbumById } from "@/lib/musicKit";
import { useQuery } from "@tanstack/react-query";
import { Stars } from "@/components/cmdk/generics";

const fetchArtworkUrl = async (albumId: string | undefined) => {
  if (!albumId) {
    console.log("fetchArtworkURl didnt get an albumId");
    return null;
  }

  const albumData = await getAlbumById(albumId);
  const artworkUrl = generateArtworkUrl(
    albumData.attributes.artwork.url,
    "672"
  );

  return artworkUrl;
};

export const EntryPreview = ({
  entry,
  index,
}: {
  entry: ReviewData;
  index: number;
}) => {
  // If review album is different from selected album, fetch artwork
  const { data: artworkUrl, isLoading: isArtworkLoading } = useQuery(
    ["albumArtworkUrl", entry.albumId],
    () => fetchArtworkUrl(entry.albumId)
  );

  return (
    <div className="w-full flex items-start pb-8">
      <div className="relative">
        <Image
          className="rounded-2xl shadow-medium"
          src={artworkUrl || "/images/placeholder.png"}
          alt={`${entry.album.name} artwork`}
          width={336} // Set this to a low value
          height={336} // Set this to the same low value
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />

        <Stars
          className={
            "absolute -bottom-4 -right-4 p-2 bg-white border border-silver rounded-full shadow-rating"
          }
          rating={entry.rating}
          color="#000"
        />
      </div>

      {/* Entry Data  */}
      {/* MT 17.5 to align with image */}
      <div className="flex flex-col justify-end gap-1 mt-[17.375rem]">
        <div className="pl-4 text-gray2 text-xs font-medium">
          {entry.album.name}
        </div>
        <div className="pl-4 text-gray2 text-xs pb-4">{entry.album.artist}</div>
        {/* Entry Text  */}
        <div
          className={`w-[484px] text-[13px] leading-normal px-4 py-2 text-black border border-silver rounded-2xl rounded-bl-[4px] break-words line-clamp-6`}
        >
          {entry.content}
        </div>
        {/* Attribution */}
        <div className="flex items-center gap-2">
          {/* Image & Star  */}
          <UserAvatar
            imageSrc={entry.author?.image}
            altText={`${entry.author?.name}'s avatar`}
            width={24}
            height={24}
          />
          {/* Name  */}
          <div
            className={`font-medium text-[13px] leading-normal text-black  transition-all duration-300 hover:text-[#000]`}
          >
            {entry.author?.name}
          </div>
        </div>
      </div>
    </div>
  );
};
