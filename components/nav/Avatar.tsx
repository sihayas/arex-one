import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Avatar() {
  const { data: session } = useSession();

  return (
    <div className="relative">
      <Image
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
