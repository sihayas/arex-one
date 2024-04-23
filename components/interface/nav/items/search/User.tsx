import Image from "next/image";
import { Command } from "cmdk";
import { useUser } from "@/hooks/usePage";
import { Author } from "@/types/global";

const UserItem = ({ user }: { user: Author }) => {
  const { openUserPage } = useUser();
  return (
    <Command.Item
      value={user.id}
      onMouseDown={(e) => e.preventDefault()}
      className="w-full p-4 cursor-pointer"
      onSelect={() => openUserPage(user)}
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
