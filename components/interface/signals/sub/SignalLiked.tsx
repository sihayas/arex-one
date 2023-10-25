import Image from "next/image";

import { getAlbumById } from "@/lib/global/musicKit";
import { HeartData } from "@/types/interfaces";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import UserAvatar from "@/components/global/UserAvatar";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface SignalHeartdProps {
  heart: HeartData;
  date: Date;
}
const SignalHeartd = ({ heart, date }: SignalHeartdProps) => {
  // Extract the albumId from the heart object
  const albumId = heart.review?.albumId || heart.reply?.review?.albumId;

  // Fetch the album information with the extracted albumId, if present
  const { data, isLoading } = useQuery(
    ["album", albumId],
    () => getAlbumById(albumId!),
    {
      enabled: !!albumId,
    }
  );

  if (!albumId || isLoading) {
    return <div>Loading or no album information available</div>;
  }

  const url = GenerateArtworkUrl(data.attributes.artwork.url, "96");
  const timeSince = formatDistanceToNow(new Date(date));

  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <div className="uppercase text-gray2 text-[10px]">{timeSince}</div>

      <Image
        className="rounded shadow-index"
        src={url}
        alt={`${data.attributes.name}'s artwork`}
        width={48}
        height={48}
        draggable="false"
      />

      {/* Conditional dots depending on the heart's type */}
      {heart.review ? (
        <div className="w-[4px] h-[4px] rounded-full bg-[#FF0000]" />
      ) : (
        <div className="flex items-center gap-1">
          <div className="mr-1 w-[4px] h-[4px] rounded-full bg-[#FF0000]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
        </div>
      )}

      <UserAvatar
        className={`!border-2 border-white shadow-md`}
        imageSrc={heart.author.image}
        altText={`${heart.author.name}'s avatar`}
        width={24}
        height={24}
        userId={heart.author.id}
      />
    </div>
  );
};
export default SignalHeartd;
