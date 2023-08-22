import { UserData } from "@/lib/global/interfaces";
import Image from "next/image";
import { Command } from "cmdk";
import { useHandleUserClick } from "@/hooks/handlePageChange/useHandleUserClick";

const User = ({ user }: { user: UserData }) => {
  const handleUserClick = useHandleUserClick(user.id);
  return (
    <Command.Item
      onMouseDown={(e) => e.preventDefault()}
      className="w-full p-4 hoverable-small border-b border-silver"
      key={user.id}
      onSelect={handleUserClick}
    >
      <div className="flex gap-4 items-center w-full">
        <Image
          id={user.id}
          className="rounded-full shadow-index"
          src={user.image || "/images/placeholder.png"}
          alt={`${user.name}'s avi`}
          width={36}
          height={36}
          draggable="false"
        />

        <div className="flex text-sm text-black font-medium">{user.name}</div>
      </div>
    </Command.Item>
  );
};
export default User;
