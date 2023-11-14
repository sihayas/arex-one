import { User } from "@/types/dbTypes";
import Image from "next/image";
import { Command } from "cmdk";
import { useHandleUserClick } from "@/hooks/useInteractions/useHandlePageChange";

const UserItem = ({ user }: { user: User }) => {
  const handleUserClick = useHandleUserClick(user);

  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full border-b p-4 border-silver"
      key={user.id}
      onSelect={handleUserClick}
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

        <div className="flex text-sm font-medium text-black">
          {user.username}
        </div>
      </div>
    </Command.Item>
  );
};
export default UserItem;
