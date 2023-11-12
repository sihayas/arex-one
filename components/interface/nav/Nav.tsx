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
import { IndexIcon } from "@/components/icons";

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
      { width: expandInput ? "384px" : "40px" },
      { type: "spring", stiffness: 240, damping: 24 },
    );
  }, [expandInput, inputAnimate, inputScope]);

  // Animate the height of the Form/Results below the input
  const [scope, animate] = useAnimate();
  useEffect(() => {
    let height = "0px";
    if (expandInput) {
      if (selectedFormSound) {
        height =
          selectedFormSound.sound.type === "songs"
            ? "120px"
            : selectedFormSound.sound.type === "albums"
            ? "394px"
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

  // Animate the width of the Signals icon
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
      <UserAvatar
        className="shadow-shadowKitLow"
        imageSrc={user.image}
        altText={`${user.username}'s avatar`}
        width={36}
        height={36}
        user={user}
      />
    );

    // Search/Form/Input
    middle = (
      <motion.div
        ref={inputScope}
        className={`flex flex-col justify-end overflow-hidden`}
      >
        {/* Input */}
        <div
          className={`p-2 flex items-center relative ${
            // Push input to the right to make space for the dial
            selectedFormSound && expandInput ? "ml-8" : ""
          } `}
        >
          {/* Absolute placeholder text */}
          <div className="absolute left-2 top-0 flex items-center h-full pointer-events-none -z-10 text-sm text-gray2 font-medium">
            {!expandInput ? (
              <IndexIcon />
            ) : !inputValue && !selectedFormSound ? (
              "Explore RX..."
            ) : selectedFormSound && !inputValue ? (
              "Arrow & type to create, Enter to view."
            ) : null}
          </div>
          {/*Input */}
          <TextareaAutosize
            id="entryText"
            className={`w-full bg-transparent text-sm outline-none resize-none text-black`}
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

    // Form & Search
    right = (
      <div
        onClick={() => setExpandSignals(!expandSignals)}
        onBlur={() => setExpandSignals(false)}
        ref={signalsScope}
        className={`cursor-pointer flex flex-col items-center`}
      >
        <div
          className={
            "w-2 h-2 bg-action absolute left-0 top-0" +
            " rounded-full" +
            " outline outline-white"
          }
        />

        {expandSignals && <Signals />}
      </div>
    );
  }

  // Define the initial and animate values for framer-motion
  const initialPosition = { x: 0, y: 0 };
  const centerPosition = {
    x: 0,
    y: 0,
  };

  return (
    <motion.div
      className="fixed z-50 flex items-start -bottom-9 -left-9 max-h-9"
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
