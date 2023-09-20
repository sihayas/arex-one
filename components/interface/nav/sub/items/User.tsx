import { UserData } from "@/lib/global/interfaces";
import Image from "next/image";
import { Command } from "cmdk";
import { useHandleUserClick } from "@/hooks/useInteractions/useHandlePageChange";

const User = ({ user }: { user: UserData }) => {
  const handleUserClick = useHandleUserClick(user.id);
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
          className="rounded-full shadow-index"
          src={user.image || "/images/placeholder.png"}
          alt={`${user.name}'s avi`}
          width={36}
          height={36}
          draggable="false"
        />

        <div className="flex text-sm font-medium text-black">{user.name}</div>
      </div>
    </Command.Item>
  );
};
export default User;
