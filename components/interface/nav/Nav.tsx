import React, { useCallback, useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHandlers/searchAPI";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Search from "./sub/Search";
import Form from "./sub/Form";
import { useInputContext } from "@/context/InputContext";
import { useAnimate } from "framer-motion";
import UserAvatar from "@/components/global/UserAvatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { SignalsIcon, IndexIcon } from "@/components/icons";

const Nav: React.FC = () => {
  const { user } = useInterfaceContext();

  const {
    inputValue,
    setInputValue,
    expandInput,
    setExpandInput,
    inputRef,
    isChangingEssential,
  } = useInputContext();
  const { selectedFormSound, prevEssentialId } = useSound();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 350);

  const handleNavTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  const { data, isInitialLoading, isFetching, error } =
    GetSearchResults(searchQuery);

  const [scope, animate] = useAnimate();
  const [inputScope, inputAnimate] = useAnimate();

  useEffect(() => {
    // Define the height based on the conditions
    let height = "0px";
    if (expandInput) {
      if (selectedFormSound) {
        height =
          selectedFormSound.sound.type === "songs"
            ? "120px"
            : selectedFormSound.sound.type === "albums"
            ? "451px"
            : "0px";
      } else {
        height = inputValue ? "480px" : "0px";
      }
    }

    // Animate the height
    animate(
      scope.current,
      { height: height },
      { type: "spring", stiffness: 300, damping: 30 }
    );
  }, [expandInput, selectedFormSound, inputValue, animate, scope]);

  useEffect(() => {
    // Animate the width
    inputAnimate(
      inputScope.current,
      { width: expandInput ? "372px" : "40px" },
      { type: "spring", stiffness: 240, damping: 24 }
    );
  }, [expandInput, inputAnimate, inputScope]);

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
  };

  let left;
  let middle;
  let right;

  // if (!user) {
  //   left = (
  //     <div className="flex h-8 items-center justify-between rounded-full">
  //       log in
  //     </div>
  //   );
  // }

  if (user) {
    left = (
      // Search
      <div className="flex flex-col overflow-hidden rounded-3xl">
        {/* Input Container */}
        <div
          ref={inputScope}
          className={`flex flex-col justify-end backdrop-blur-xl outline outline-[.5px] outline-silver overflow-hidden ${
            expandInput && "bg-nav"
          }`}
        >
          {/* Form / Search Results / Top */}
          <div
            ref={scope}
            className={`flex flex-col relative ${
              selectedFormSound
                ? "overflow-visible"
                : "overflow-scroll" + " scrollbar-none"
            }`}
          >
            {/* If no selected form sound render search results */}
            {selectedFormSound && expandInput ? (
              <Form />
            ) : (
              !selectedFormSound &&
              inputValue && (
                <Search
                  searchData={data}
                  isInitialLoading={isInitialLoading}
                  isFetching={isFetching}
                  error={error}
                />
              )
            )}
          </div>

          {/* Input */}
          <div
            className={`${
              //Make space for the dial
              selectedFormSound && expandInput ? "ml-10" : ""
            } p-3 flex items-center`}
          >
            <TextareaAutosize
              id="entryText"
              className={`w-full bg-transparent text-xs outline-none resize-none text-black`}
              placeholder={`RX`}
              value={expandInput ? inputValue : ""}
              onChange={(e) => handleNavTextChange(e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              minRows={1}
            />
          </div>
        </div>
      </div>
    );
    middle = (
      <UserAvatar
        className="w-8- h-8 mb-2 outline outline-[.5px] outline-silver"
        imageSrc={user.image}
        altText={`${user.username}'s avatar`}
        width={32}
        height={32}
        user={user}
      />
    );
  }

  // Define the initial and animate values for framer-motion
  const initialPosition = { x: "-50%", y: 20 };
  const centerPosition = {
    x: "-50%",
    y: 20,
  };

  return (
    <motion.div
      className="fixed z-50 flex items-end -bottom-8 left-1/2 -translate-x-1/2"
      initial={initialPosition}
      animate={expandInput ? centerPosition : initialPosition}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {middle}
      {left}
    </motion.div>
  );
};

export default Nav;
