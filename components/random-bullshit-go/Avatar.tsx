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
      {/* <Image
        className=""
        src={
          session && session.user && session.user.gender === "male"
            ? "/images/icons/avatar/avatar-male.svg"
            : session && session.user && session.user.gender === "female"
            ? "/images/icons/avatar/avatar-female.svg"
            : session && session.user && session.user.gender === "trans"
            ? "/images/icons/avatar/avatar-trans.svg"
            : session && session.user && session.user.gender === "non-binary"
            ? "/images/icons/avatar/avatar-nb.svg"
            : "/images/icons/avatar/avatar-none.svg"
        }
        height={50}
        width={50}
        alt={"avatar-border"}
      /> */}
    </div>
  );
}
