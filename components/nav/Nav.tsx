import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import GetSearchResults from "@/lib/api/searchAPI";
import { useSpring, animated } from "@react-spring/web";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Search from "./sub/Search";
import Avatar from "./Avatar";
import Form from "./sub/Form";
import Dial from "./sub/items/Dial";

const Nav: React.FC = () => {
  const { data: session, status } = useSession();
  const { inputValue, setInputValue, expandInput, setExpandInput, inputRef } =
    useCMDK();
  const { selectedSound } = useCMDKAlbum();

  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);

  const debouncedSetSearchQuery = debounce(setSearchQuery, 350);

  const handleNavTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  // Get search results based on debounced search query
  const { data, isInitialLoading, isFetching, error } =
    GetSearchResults(searchQuery);

  const searchStyle = useSpring({
    height:
      (data.length !== 0 && expandInput) || selectedSound
        ? !selectedSound
          ? "500"
          : selectedSound.sound.type === "songs"
          ? "120px"
          : selectedSound.sound.type === "albums"
          ? "562px"
          : "0px"
        : "0px",
    from: { height: "36px" },
    config: { tension: 675, friction: 70 },
  });

  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  const onBlur = useCallback(() => {
    setExpandInput(false);
  }, [setExpandInput]);

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
      <div className="flex flex-col">
        <div className="absolute h-fit flex flex-col justify-end bottom-[54px] right-0 w-[502px] bg-nav backdrop-blur-xl rounded-[22px] shadow-nav">
          <animated.div
            className={`flex flex-col relative ${
              selectedSound ? "overflow-visible" : "overflow-scroll"
            }`}
            style={searchStyle}
          >
            {!selectedSound ? (
              <Search
                searchData={data}
                isInitialLoading={isInitialLoading}
                isFetching={isFetching}
                error={error}
              />
            ) : (
              <Form inputValue={inputValue} />
            )}
          </animated.div>

          {/* Input */}
          <div
            className={`${
              //Make space for the dial
              selectedSound ? "ml-10" : "translate-x-0"
            } transition-all  p-4 py-3 flex items-center`}
          >
            <TextareaAutosize
              id="entryText"
              className={`w-full bg-transparent text-violet text-sm focus:outline-none hoverable-medium resize-none`}
              placeholder={`${selectedSound ? "type to log" : "rx"}`}
              value={inputValue}
              onChange={(e) => handleNavTextChange(e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              ref={inputRef}
            />
          </div>
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
