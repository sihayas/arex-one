import React, { useCallback, useState } from "react";
import { useSession } from "next-auth/react";

import { useSound } from "@/context/Sound";
import GetSearchResults from "@/lib/api/searchAPI";
import { useSpring, animated } from "@react-spring/web";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Search from "./sub/Search";
import Form from "./sub/Form";
import { useInputContext } from "@/context/InputContext";

const Nav: React.FC = () => {
  const { data: session, status } = useSession();
  const { inputValue, setInputValue, expandInput, setExpandInput, inputRef } =
    useInputContext();
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
        ? "480"
        : selectedFormSound.sound.type === "songs"
        ? "120px"
        : selectedFormSound.sound.type === "albums"
        ? "462px"
        : "0px"
      : "0px",
    from: { height: "0px" },
    config: { tension: 750, friction: 70 },
  });

  const inputWidthStyle = useSpring({
    width: expandInput ? "400px" : "44px",
    transform: expandInput ? "translateX(200px)" : "translateX(0px)",
    from: { width: "44px", transform: "translateX(0px)" },
    config: { tension: 750, friction: 70 },
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
      <div className="flex h-8 items-center justify-between rounded-full">
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
          className="absolute flex flex-col justify-end backdrop-blur-xl -bottom-0 -right-0 bg-nav rounded-3xl shadow-sm"
        >
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
        </animated.div>
      </div>
    );
  }

  // Define the initial and animate values for framer-motion
  const initialPosition = { bottom: 0, right: 0 };
  const centerPosition = {
    bottom: "50%",
    right: "50%",
    translateX: "50%",
    translateY: "50%",
  };

  return (
    <motion.div
      className="fixed z-50 flex flex-col"
      initial={initialPosition}
      animate={expandInput ? centerPosition : initialPosition}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {left}
    </motion.div>
  );
};

export default Nav;
