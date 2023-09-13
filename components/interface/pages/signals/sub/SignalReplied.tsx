import Image from "next/image";

import { getAlbumById } from "@/lib/global/musicKit";
import { ReplyData } from "@/lib/global/interfaces";

import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import UserAvatar from "@/components/global/UserAvatar";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface SignalRepliedProps {
  reply: ReplyData;
  date: Date;
}

const SignalReplied = ({ reply, date }: SignalRepliedProps) => {
  // Extract the albumId conditionally based on the reply's data
  const albumId = reply.review?.albumId;

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

      {/* album art */}
      <Image
        className="rounded shadow-index"
        src={url}
        alt={`${data.attributes.name}'s artwork`}
        width={48}
        height={48}
        draggable="false"
      />

      {/* Reply to a review = 3 dots, Reply to a Reply = 3 x 3 dots */}
      {reply.replyTo ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
            <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
            <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
            <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
            <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
          <div className="w-[4px] h-[4px] rounded-full bg-[#000]" />
        </div>
      )}

      {/* likers */}
      <UserAvatar
        className={`!border-2 border-white shadow-md`}
        imageSrc={reply.author.image}
        altText={`${reply.author.name}'s avatar`}
        width={24}
        height={24}
        userId={reply.author.id}
      />
    </div>
  );
};
export default SignalReplied;
