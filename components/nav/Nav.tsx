import React, { useCallback, useState } from "react";
import { useSession } from "next-auth/react";

import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import GetSearchResults from "@/lib/api/searchAPI";
import { useSpring, animated } from "@react-spring/web";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Search from "./sub/Search";
import Avatar from "./Avatar";
import Form from "./sub/Form";

const Nav: React.FC = () => {
  const { data: session, status } = useSession();
  const { inputValue, setInputValue, expandInput, setExpandInput, inputRef } =
    useInterface();
  const { selectedFormSound } = useSound();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 350);

  const handleNavTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  const { data, isInitialLoading, isFetching, error } =
    GetSearchResults(searchQuery);

  const searchStyle = useSpring({
    height: expandInput
      ? !selectedFormSound
        ? "500"
        : selectedFormSound.sound.type === "songs"
        ? "120px"
        : selectedFormSound.sound.type === "albums"
        ? "562px"
        : "0px"
      : "0px",
    from: { height: "0px" },
    config: { tension: 675, friction: 70 },
  });

  const inputWidthStyle = useSpring({
    width: expandInput ? "502px" : "44px",
    transform: expandInput ? "translateX(44px)" : "translateX(0px)",
    from: { width: "44px", transform: "translateX(0px)" },
    config: { tension: 675, friction: 70 },
  });

  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  const onBlur = useCallback(() => {
    setExpandInput(false);
  }, [setExpandInput]);

  // New line creation
  const handleKeyDown = (e: any) => {
    if (
      e.key === "Enter" &&
      expandInput &&
      selectedFormSound &&
      inputRef.current?.value !== ""
    ) {
      e.preventDefault(); // Prevent the default behavior
      const cursorPosition = e.target.selectionStart;
      const value = e.target.value;
      const newValue =
        value.substring(0, cursorPosition) +
        "\n" +
        value.substring(cursorPosition);
      handleNavTextChange(newValue); // Update the input value with the new line
    }
    // ... handle other keys or default behavior
  };

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
        {/* Input Container */}
        <animated.div
          style={inputWidthStyle}
          className="absolute flex flex-col justify-end bottom-[64px] right-[44px] bg-nav backdrop-blur-xl rounded-[22px] shadow-nav hoverable-small"
        >
          {/* Form / Search Results */}
          <animated.div
            className={`flex flex-col relative ${
              selectedFormSound ? "overflow-visible" : "overflow-scroll"
            }`}
            style={searchStyle}
          >
            {!selectedFormSound ? (
              <Search
                searchData={data}
                isInitialLoading={isInitialLoading}
                isFetching={isFetching}
                error={error}
              />
            ) : (
              <Form />
            )}
          </animated.div>

          {/* Input */}
          <div
            className={`${
              //Make space for the dial
              selectedFormSound && expandInput ? "ml-10" : "translate-x-0"
            } transition-all p-4 py-3 flex items-center`}
          >
            <TextareaAutosize
              id="entryText"
              className={`w-full bg-transparent text-violet text-[13px] outline-none resize-none`}
              placeholder={`${
                selectedFormSound && expandInput ? "type..." : "rx"
              }`}
              value={inputValue}
              onChange={(e) => handleNavTextChange(e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              ref={inputRef}
              onKeyDown={handleKeyDown}
            />
          </div>
        </animated.div>

        <Circle12 />
        <Avatar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-16 fixed -right-[66px] -bottom-[84px] z-50">
      {left}
    </div>
  );
};

export default Nav;

const Circle12 = () => (
  <svg className="-translate-x-3" height="12" width="12">
    <circle cx="6" cy="6" r="6" fill="rgba(250,250,250,.65)" />
  </svg>
);
