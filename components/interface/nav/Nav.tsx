import React, { useCallback, useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHandlers/searchAPI";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Search from "./sub/Search";
import Form from "./sub/Form";
import Signals from "./sub/Signals";
import { useNavContext } from "@/context/NavContext";
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
    expandSignals,
    setExpandSignals,
  } = useNavContext();
  const { selectedFormSound } = useSound();

  // Debounce the search query
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 500);
  const handleInputTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  // Get search results
  const { data, isInitialLoading, isFetching, error } =
    GetSearchResults(searchQuery);

  // RIGHT: Animate the width of the parent div of the input (right side)
  const [inputScope, inputAnimate] = useAnimate();
  useEffect(() => {
    inputAnimate(
      inputScope.current,
      { width: expandInput ? "316px" : "40px" },
      { type: "spring", stiffness: 240, damping: 24 },
    );
  }, [expandInput, inputAnimate, inputScope]);

  // RIGHT: Animate the height of the Form/Results below the input
  const [scope, animate] = useAnimate();
  useEffect(() => {
    let height = "0px";
    if (expandInput) {
      if (selectedFormSound) {
        height =
          selectedFormSound.sound.type === "songs"
            ? "120px"
            : selectedFormSound.sound.type === "albums"
            ? "359px"
            : "0px";
      } else {
        height = inputValue ? "480px" : "0px";
      }
    }

    // Animate the height
    animate(
      scope.current,
      { height: height },
      { type: "spring", stiffness: 300, damping: 30 },
    );
  }, [expandInput, selectedFormSound, inputValue, animate, scope]);

  // LEFT: Animate the width of the Signals icon
  const [signalsScope, signalsAnimate] = useAnimate();
  useEffect(() => {
    signalsAnimate(
      signalsScope.current,
      { width: expandSignals ? "316px" : "40px" },
      { type: "spring", stiffness: 240, damping: 24 },
    );
  }, [expandSignals, signalsAnimate, signalsScope]);

  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  const onBlur = useCallback(() => {
    setExpandInput(false);
  }, [setExpandInput]);

  // Enable new line on enter if Form is active
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
      handleInputTextChange(newValue); // Update the input value with the new line
    }
  };

  let left;
  let middle;
  let right;

  if (user) {
    left = (
      <div
        onClick={() => setExpandSignals(!expandSignals)}
        onBlur={() => setExpandSignals(false)}
        ref={signalsScope}
        className={`cursor-pointer flex flex-col items-center`}
      >
        {/* Heading/Icon */}
        <div className="p-3 flex items-center w-full ">
          <div
            className={`w-full h-[1.5px] bg-gray3 rounded-full transition-all mb-[1px] -mr-1`}
          />
          <SignalsIcon className={"min-w-[16px] min-h-[16px]"} />
        </div>
        {expandSignals && <Signals />}
      </div>
    );

    // User profile
    middle = (
      <div className={`w-10 h-10 flex items-center justify-center`}>
        <UserAvatar
          className="border border-gray3"
          imageSrc={user.image}
          altText={`${user.username}'s avatar`}
          width={32}
          height={32}
          user={user}
        />
      </div>
    );

    // Form & Search
    right = (
      <motion.div
        ref={inputScope}
        className={`flex flex-col justify-end overflow-hidden rounded-3xl`}
      >
        {/* Input */}
        <div
          className={`${
            // Push input to the right to make space for the dial
            selectedFormSound && expandInput ? "ml-10" : ""
          } p-3 flex items-center relative`}
        >
          {/* Input and placeholder text */}
          <div className="absolute left-3 top-0 flex items-center h-full pointer-events-none -z-10 text-xs text-gray3 font-bold">
            {!expandInput ? (
              <IndexIcon />
            ) : !inputValue && !selectedFormSound ? (
              "Explore RX..."
            ) : selectedFormSound && !inputValue ? (
              "Arrow & type to create, Enter to view."
            ) : null}
          </div>

          <TextareaAutosize
            id="entryText"
            className={`w-full bg-transparent text-xs outline-none resize-none text-black`}
            value={expandInput ? inputValue : ""}
            onChange={(e) => handleInputTextChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            minRows={1}
          />
        </div>

        {/* Form / Search Results / Bottom */}
        <div
          ref={scope}
          className={`flex flex-col relative w-full ${
            selectedFormSound
              ? "overflow-visible"
              : "overflow-scroll" + " scrollbar-none"
          }`}
          style={{ transformOrigin: "top" }}
        >
          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Define the initial and animate values for framer-motion
  const initialPosition = { x: "-50%", y: 0 };
  const centerPosition = {
    x: "-50%",
    y: 0,
  };

  return (
    <motion.div
      className="fixed z-50 flex items-start -bottom-[56px] left-1/2 -translate-x-1/2 gap-2 max-h-10"
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
