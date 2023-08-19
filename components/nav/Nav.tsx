import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

import SearchAlbums from "@/lib/api/searchAPI";
import TextareaAutosize from "react-textarea-autosize";
import { useSpring, animated } from "@react-spring/web";

import Search from "./Search";
import Avatar from "./Avatar";

const Nav: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [navText, setNavText] = useState("");
  // Search functionality
  const { data, isLoading, isFetching, error } = SearchAlbums(navText);
  const handleNavTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNavText(event.target.value);

  // React Spring
  const searchStyle = useSpring({
    height: session && navText.length > 0 && data ? "554px" : "40px",
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

  if (session) {
    left = (
      <div className="flex w-full h-full justify-end gap-2">
        <div className="flex flex-col relative ">
          {/* Quick Search  */}
          <animated.div
            className="absolute flex flex-col bottom-[54px] right-0 w-[502px] bg-white bg-opacity-40 backdrop-blur-3xl rounded-[22px] shadow-nav"
            style={searchStyle}
          >
            <div
              className={`flex flex-col overflow-y-scroll max-h-[554px] scrollbar-none ${
                navText.length > 0 && data ? "border-b border-silver" : ""
              }`}
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
              className="w-full p-2.5 pl-3 pb-8 bg-transparent resize-none text-black text-sm focus:outline-none hoverable-medium"
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-16 fixed right-8 bottom-8 z-50">{left}</div>
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
