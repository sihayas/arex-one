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
            ? "392px"
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

  // Animate the width
  useEffect(() => {
    inputAnimate(
      inputScope.current,
      { width: expandInput ? "358px" : "40px" },
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
      <div className={`p-3`}>
        <SignalsIcon />
      </div>
    );
    right = (
      <motion.div
        ref={inputScope}
        className={`flex flex-col justify-end overflow-hidden rounded-3xl ${
          expandInput &&
          "outline-1 outline-silver outline bg-nav backdrop-blur-3xl"
        }`}
      >
        {/* Form / Search Results / Top */}
        <div
          ref={scope}
          className={`flex flex-col relative w-full ${
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
          } p-3 flex items-center relative`}
        >
          <div className="absolute left-3 top-0 flex items-center h-full pointer-events-none -z-10 text-xs text-gray3">
            {!expandInput ? (
              <IndexIcon />
            ) : !inputValue && !selectedFormSound ? (
              "Explore RX..."
            ) : selectedFormSound && !inputValue ? (
              "Arrows to dial; Type for entry; Enter to view."
            ) : null}
          </div>

          <TextareaAutosize
            id="entryText"
            className={`w-full bg-transparent text-xs outline-none resize-none text-black`}
            value={expandInput ? inputValue : ""}
            onChange={(e) => handleNavTextChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            minRows={1}
          />
        </div>
      </motion.div>
    );
    middle = (
      <UserAvatar
        className="w-8- h-8 outline outline-4 outline-gray3"
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
      className="fixed z-50 flex items-center -bottom-8 left-1/2 -translate-x-1/2 gap-2"
      initial={initialPosition}
      animate={expandInput ? centerPosition : initialPosition}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {left}
      {middle}
      {right}
    </motion.div>
  );
};

export default Nav;
