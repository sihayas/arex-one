import React, { useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "../random-bullshit-go/Avatar";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import SearchAlbums from "@/lib/api/searchAPI";
import Search from "./Search";
import { useSpring, animated } from "@react-spring/web";

const Nav: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  // Search functionality
  const [navText, setNavText] = useState("");
  const { data, isLoading, isFetching, error } = SearchAlbums(navText);
  const handleNavTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNavText(event.target.value);

  // React Spring
  const searchStyle = useSpring({
    height: session && navText.length > 0 && data ? "554px" : "36px",
    from: { height: "36px" },
    config: { tension: 700, friction: 60 }, // Increase tension for faster animation
  });

  let left;

  if (!session) {
    left = (
      <div className="flex items-center justify-between rounded-full h-8">
        <Link data-active={isActive("/")} href="/">
          <div className="text-sm text-black">rx</div>
        </Link>
        <Link data-active={isActive("/signup")} href="/api/auth/signin">
          <div className="text-xs">google join</div>
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
      <div className="flex w-full h-full justify-end gap-2">
        <div className="flex flex-col relative ">
          {/* Quick Search  */}
          <animated.div
            className="absolute flex flex-col bottom-[54px] -left-[480px] w-[512px] bg-silver backdrop-blur-xl rounded-[22px]"
            style={searchStyle}
          >
            <div
              className={`flex flex-col overflow-y-scroll max-h-[554px] ${
                navText.length > 0 && data ? "border-b border-white" : ""
              }`} // Conditional border
            >
              <Search
                searchData={data}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
              />
            </div>

            <TextareaAutosize
              id="entryText"
              className="w-full p-2 pl-3 bg-transparent resize-none text-white text-sm focus:outline-none hoverable-medium"
              minRows={1}
              maxRows={12}
              disabled={!session}
              value={navText}
              onChange={handleNavTextChange}
              placeholder="+"
            />
          </animated.div>
          <Circle20 />
          <Circle12 />
          <Avatar />
        </div>
        {/* <button className="absolute" onClick={() => signOut()}>
          <Image
            src="/images/icons/nav/log-out.svg"
            width={15}
            height={15}
            alt="logout-button"
          />
        </button> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-16 fixed left-2/4 bottom-0 transform translate-x-[700%] -translate-y-[44px] z-50">
      {left}
    </div>
  );
};

export default Nav;

// SVG circle components
const Circle12 = () => (
  <svg className="-translate-x-3" height="12" width="12">
    <circle
      cx="6"
      cy="6"
      r="6"
      fill="rgba(0, 0, 0, 0.05)"
      style={{ backdropFilter: "blur(16px)" }}
    />
  </svg>
);

const Circle20 = () => (
  <svg className="-translate-x-8" height="20" width="20">
    <defs>
      <clipPath id="halfCircleClip">
        <rect x="0" y="10" width="20" height="10" />
      </clipPath>
    </defs>
    <circle
      cx="10"
      cy="10"
      r="10"
      fill="rgba(0, 0, 0, 0.05)"
      style={{ backdropFilter: "blur(16px)" }}
      clipPath="url(#halfCircleClip)"
    />
  </svg>
);
