// Followed back notification
import { UserAvatar } from "@/components/generics/UserAvatar";
import { generateArtworkUrl } from "@/components/generics/generateArtworkUrl";
import { getAlbumById } from "@/lib/global/musicKit";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Follows } from "@/lib/global/interfaces";
interface SignalInterlinkedProps {
  follows: Follows;
}

const SignalInterlinked = ({ follows }: SignalInterlinkedProps) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {/* notification time since */}
      <div className="text-gray2 text-[10px]">5 MINS AGO</div>

      {/* follower */}
      <UserAvatar
        className={`!border-2 border-white shadow-md`}
        imageSrc={follows.follower.image}
        altText={`${follows.follower.name}'s avatar`}
        width={24}
        height={24}
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
