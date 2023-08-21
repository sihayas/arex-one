import React, { useState } from "react";
import { useSession } from "next-auth/react";

import GetSearchResults from "@/lib/api/searchAPI";
import { useSpring, animated } from "@react-spring/web";
import { debounce } from "lodash";
import { Command } from "cmdk";

import Search from "./search/Search";
import Avatar from "./Avatar";

const Nav: React.FC = () => {
  const { data: session, status } = useSession();

  // Navigation text and search query state
  const [navText, setNavText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 300);

  // Handler for navigation text change
  const handleNavTextChange = (value: string) => {
    setNavText(value);
    debouncedSetSearchQuery(value); // Debounced search query update
  };

  // Get search results based on debounced search query
  const { data, isLoading, isFetching, error } = GetSearchResults(searchQuery);

  const searchStyle = useSpring({
    height: session && navText.length > 0 && data ? "554px" : "0px",
    from: { height: "36px" },
    config: { tension: 800, friction: 60 },
  });

  let left;

  if (!session) {
    left = (
      <div className="flex items-center justify-between rounded-full h-8">
        log in
      </div>
    );
  }

  if (status === "loading") {
    left = <p>logging in...</p>;
  }

  if (session) {
    left = (
      // Search
      <div className="flex flex-col relative ">
        <div className="absolute h-fit flex flex-col justify-end bottom-[54px] right-0 w-[502px] bg-white bg-opacity-50 backdrop-blur-3xl rounded-[22px] shadow-nav">
          <animated.div
            className={`flex flex-col overflow-y-scroll max-h-[554px] scrollbar-none`}
            style={searchStyle}
          >
            <Search
              searchData={data}
              isLoading={isLoading}
              isFetching={isFetching}
              error={error}
            />
          </animated.div>

          <Command.Input
            id="entryText"
            className="p-3 w-full rounded-b-[22px] bg-transparent  text-black text-sm focus:outline-none hoverable-medium resize-none"
            placeholder="+"
            onValueChange={handleNavTextChange}
          />
        </div>
        {/* Circles */}
        <Circle20 />
        <Circle12 />
        <Avatar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-16 fixed right-8 bottom-8 z-50">{left}</div>
  );
};

export default Nav;

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
