import React from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "./Avatar";
import Image from "next/image";
import Join from "./BtnJoin";

const Nav: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession(); // types/next-auth.d.ts
  const spotify = "/images/icons/nav/spotify.svg";
  const google = "/images/icons/nav/google.svg";

  let left;

  let mid;

  let right;
  //If user is logged out.
  if (!session) {
    left = (
      <div className="flex items-center justify-between rounded-full h-8">
        <Link data-active={isActive("/")} href="/">
          <div className="text-sm text-black">rx</div>
        </Link>
        <Link data-active={isActive("/signup")} href="/api/auth/signin">
          <Join icon={google} label={"google"} color={"text-[#f5c344]"} />
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    left = <p>logging in...</p>;
  }

  //If user is logged in.
  if (session) {
    left = (
      <div className="flex w-full h-full items-center justify-center gap-2">
        {/* Avi */}
        <Avatar />
        <div className="font-medium text-sm text-grey">{session.user.name}</div>
        <button onClick={() => signOut()}>
          <Image
            src="/images/icons/nav/log-out.svg"
            width={15}
            height={15}
            alt="logout-button"
          />
        </button>
      </div>
    );
  }

  console.log(session?.user.gender);
  return (
    <div className="flex w-full h-16 fixed top-[92%]">
      {/* Inner */}
      {left}
      {mid}
      {right}
    </div>
  );
};

export default Nav;
