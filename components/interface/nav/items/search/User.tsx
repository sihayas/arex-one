import { UserType } from "@/types/dbTypes";
import Image from "next/image";
import { Command } from "cmdk";
import { useUser } from "@/hooks/usePage";

const UserItem = ({ user }: { user: UserType }) => {
  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full border-b p-4 border-silver"
      key={user.id}
    >
      <div className="flex w-full items-center gap-4">
        <Image
          id={user.id}
          className="rounded-full shadow-shadowKitLow"
          src={user.image || "/images/placeholder.png"}
          alt={`${user.username}'s avi`}
          width={36}
          height={36}
          draggable="false"
        />

        <div className="flex font-medium text-base">{user.username}</div>
      </div>
    </Command.Item>
  );
};
export default UserItem;
