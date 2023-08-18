import Image from "next/image";
import { useSession } from "next-auth/react";
import { useHandleUserClick } from "@/hooks/handlePageChange/useHandleUserClick";

export default function Avatar() {
  const { data: session } = useSession();

  const handleUserClick = useHandleUserClick(session.user.id);

  return (
    <div className="relative hoverable-medium">
      <Image
        onClick={handleUserClick}
        className="rounded-full"
        src={
          session && session.user && session.user.image
            ? session.user.image
            : "/images/icons/avatar/avatar-default.jpg"
        }
        height={32}
        width={32}
        alt={"avatar-image"}
      />
    </div>
  );
}
