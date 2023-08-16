import { UserAvatar } from "@/components/generics/UserAvatar";
import { generateArtworkUrl } from "@/components/generics/generateArtworkUrl";
import { getAlbumById } from "@/lib/global/musicKit";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LikeData } from "@/lib/global/interfaces";

interface SignalLikedProps {
  like: LikeData;
}
const SignalLiked = ({ like }: SignalLikedProps) => {
  // Extract the albumId from the like object
  const albumId = like.review?.albumId || like.reply?.review?.albumId;

  // Fetch the album information with the extracted albumId, if present
  const { data, isLoading } = useQuery(
    ["album", albumId],
    () => getAlbumById(albumId!),
    {
      enabled: !!albumId, // Only enable the query if albumId is present
    }
  );

  if (!albumId || isLoading) {
    return <div>Loading or no album information available</div>;
  }

  const url = generateArtworkUrl(data.attributes.artwork.url, "96");

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {/* notification time since */}
      <div className="text-gray2 text-[10px]">5 MINS AGO</div>

      {/* album art */}
      <Image
        className="rounded"
        src={url}
        alt={`${data.attributes.name}'s artwork`}
        width={48}
        height={48}
        draggable="false"
      />

      {/* red dot  */}
      {/* Conditional dots depending on the like's type */}
      {like.review ? (
        <div className="w-[4px] h-[4px] rounded-full bg-[#FF0000]" />
      ) : (
        <div className="flex items-center gap-1">
          <div className="mr-1 w-[4px] h-[4px] rounded-full bg-[#FF0000]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#CCC]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#CCC]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#CCC]" />
        </div>
      )}

      {/* likers */}
      <UserAvatar
        className={`!border-2 border-white shadow-md`}
        imageSrc={like.author.image}
        altText={`${like.author.name}'s avatar`}
        width={24}
        height={24}
      />
    </div>
  );
};
export default SignalLiked;
