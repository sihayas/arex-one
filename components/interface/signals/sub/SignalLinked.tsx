import UserAvatar from "@/components/global/UserAvatar";

import { Follows } from "@/types/interfaces";
import { formatDistanceToNow } from "date-fns";

interface SignalInterlinkedProps {
  follows: Follows;
  date: Date;
}

const SignalInterlinked = ({ follows, date }: SignalInterlinkedProps) => {
  const timeSince = formatDistanceToNow(new Date(date));

  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      {/* notification time since */}
      <div className="uppercase text-gray2 text-[10px]">{timeSince}</div>

      {/* follower */}
      <UserAvatar
        className={`!border-2 border-white shadow-md`}
        imageSrc={follows.follower.image}
        altText={`${follows.follower.name}'s avatar`}
        width={24}
        height={24}
        userId={follows.follower.id}
      />

      {/* red dot  */}
      <div className="flex items-center gap-1">
        <div className="w-[4px] h-[4px] rounded-full bg-[#FFEA00]" />
        <div className="w-[4px] h-[4px] rounded-full bg-[#FFEA00]" />
      </div>
    </div>
  );
};
export default SignalInterlinked;
