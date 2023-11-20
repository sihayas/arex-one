import React, { useCallback, useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHandlers/searchAPI";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import RenderResults from "./sub/RenderResults";
import Form from "./sub/Form";
import { ChainIcon } from "@/components/icons";
import { useNavContext } from "@/context/NavContext";
import Avatar from "@/components/global/Avatar";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import Image from "next/image";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { Record, Reply } from "@/types/dbTypes";
import { addReply } from "@/lib/apiHandlers/recordAPI";
import { toast } from "sonner";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import { AnimatePresence, motion } from "framer-motion";

const isRecord = (
  replyParent: Record | Reply | null,
): replyParent is Record => {
  return (replyParent as Record).appleAlbumData !== undefined;
};

const Nav = () => {
  let left;
  let middle;
  let right;

  // For record page/reply input
  const { replyParent, record, setReplyParent } = useThreadcrumb();
  const { user, pages } = useInterfaceContext();
  const {
    inputValue,
    setInputValue,
    expandInput,
    setExpandInput,
    inputRef,
    storedInputValue,
    setStoredInputValue,
    activeAction,
    setActiveAction,
  } = useNavContext();
  const { selectedFormSound, setSelectedFormSound } = useSound();
  const { handleSelectSound } = useHandleSoundClick();

  // Determine current page
  const activePage: Page = pages[pages.length - 1];

  const handleReplySubmit = () => {
    if (!replyParent || !inputValue || !user?.id || !record) return;

    const type = isRecord(replyParent) ? "record" : "reply";

    // Wrap the addReply call in toast.promise
    toast.promise(
      addReply(record?.author.id, replyParent, inputValue, user?.id, type).then(
        () => {
          setInputValue("");
        },
      ),
      {
        loading: "Sending reply...",
        success: "Reply sent successfully!",
        error: "Error submitting reply",
      },
    );
  };

  // Width expansion variants
  const widthVariants = {
    collapsed: {
      width: 0,
    },
    expanded: {
      width: 354,
    },
  };

  const heightVariants = {
    collapsed: {
      height: 33,
    },
    expanded: {
      height: expandInput
        ? activeAction === "none" && inputValue
          ? 481
          : activeAction === "form"
          ? 222
          : activeAction === "reply"
          ? 36
          : 33
        : 33,
    },
  };

  // Debounce the search query
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 250);
  const handleInputTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  // RenderResults results
  const { data, isInitialLoading, isFetching, error } =
    GetSearchResults(searchQuery);

  const onBlur = useCallback(() => {
    setExpandInput(false);
  }, [setExpandInput]);
  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);
  const handleNavClick = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  // Key bindings for input
  const handleKeyDown = (e: any) => {
    // New line if Form is expanded or ReplyParent is selected
    if (
      e.key === "Enter" &&
      expandInput &&
      selectedFormSound &&
      inputRef.current?.value !== ""
    ) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const value = e.target.value;
      const newValue =
        value.substring(0, cursorPosition) +
        "\n" +
        value.substring(cursorPosition);
      handleInputTextChange(newValue);
    }
    //Submit reply with cmd/ctrl + enter
    else if (
      e.key === "Enter" &&
      (e.metaKey || e.ctrlKey) &&
      inputRef.current === document.activeElement &&
      replyParent
    ) {
      handleReplySubmit();
    }
    // Switch to album page from form
    else if (e.key === "Enter" && selectedFormSound && inputValue === "") {
      e.preventDefault();
      handleSelectSound(selectedFormSound.sound, selectedFormSound.artworkUrl);
      inputRef?.current?.blur();
      window.history.pushState(null, "");
    } else if (
      // Wipe selectedFormSound and replyParent
      e.key === "Backspace" &&
      inputValue === "" &&
      activeAction !== "none"
    ) {
      e.preventDefault();
      setSelectedFormSound(null);
      setReplyParent(null);
      setInputValue(storedInputValue);
      setStoredInputValue("");
      inputRef?.current?.focus();
    }
    // Prepare form if on sound page
    else if (
      e.key === "Enter" &&
      activePage.sound &&
      activeAction === "none" &&
      !inputValue
    ) {
      e.preventDefault();
      const sound = activePage.sound.sound;
      const artworkUrl = activePage.sound.artworkUrl;
      setSelectedFormSound({ sound, artworkUrl });
    }
    // Prepare reply parent
    else if (
      e.key === "Enter" &&
      activePage.record &&
      activeAction === "none" &&
      !inputValue
    ) {
      e.preventDefault();
      setReplyParent(activePage.record);
    }
  };

  // Determine the action indicator (takes precedence over page indicator)
  useEffect(() => {
    if (selectedFormSound) {
      setActiveAction("form");
    } else if (replyParent) {
      setActiveAction("reply");
    } else {
      setActiveAction("none");
    }
  }, [selectedFormSound, setActiveAction, replyParent]);

  if (user) {
    left = (
      <Avatar
        className="shadow-shadowKitLow"
        imageSrc={user.image}
        altText={`${user.username}'s avatar`}
        width={36}
        height={36}
        user={user}
      />
    );

    // Input & RenderResults Results/Form
    middle = (
      <div
        onClick={handleNavClick}
        className={`flex flex-col rounded-[18px] w-full relative`}
      >
        {/* Input Outer */}
        <div
          className={`bg-[#F4F4F4]/90 flex flex-col items-end absolute bottom-1 left-0 rounded-[18px] shadow-shadowKitMedium outline outline-silver outline-1`}
        >
          {/* Top / Form / RenderResults Results */}
          {expandInput && !replyParent && (selectedFormSound || inputValue) && (
            <motion.div
              className={`flex flex-col relative w-full p-3 pb-[6px] overflow-scroll scrollbar-none`}
              variants={heightVariants}
              animate={expandInput ? "expanded" : "collapsed"}
            >
              {/* If no selected form sound render search results */}
              {selectedFormSound && expandInput ? (
                <Form />
              ) : (
                !selectedFormSound &&
                inputValue && (
                  <RenderResults
                    searchData={data}
                    isInitialLoading={isInitialLoading}
                    isFetching={isFetching}
                    error={error}
                  />
                )
              )}
            </motion.div>
          )}

          {/* Input & Icons */}
          <div
            className={`px-3 pt-[6px] pb-[7px] flex items-center w-full relative`}
          >
            {/* Context Icons */}
            <AnimatePresence>
              {activeAction === "none" && (!expandInput || !inputValue) && (
                <motion.button
                  exit={{ scale: 0, width: 0 }}
                  initial={{ scale: 0, width: 0 }}
                  animate={{ scale: 1, width: expandInput ? 22 : 18 }}
                  onClick={handleNavClick}
                  className="h-[18px] relative"
                >
                  {activePage.record ? (
                    <>
                      <ChainIcon />
                      <Image
                        className="absolute top-0 left-0 rounded-full border border-gray6"
                        src={activePage.record.author.image}
                        alt="artwork"
                        width={16}
                        height={16}
                      />
                    </>
                  ) : activePage.sound ? (
                    <Image
                      className="rounded-[6px] border border-gray3"
                      src={activePage.sound.artworkUrl}
                      alt="artwork"
                      width={18}
                      height={18}
                    />
                  ) : null}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Active Form Icon */}
            {activeAction !== "none" &&
              activeAction === "form" &&
              selectedFormSound &&
              !expandInput && (
                <button onClick={handleNavClick} className="w-[18px] h-[18px]">
                  {/* Sound */}
                  {selectedFormSound.sound && (
                    <Image
                      className="rounded-[6px] border border-gray3"
                      src={selectedFormSound.artworkUrl}
                      alt="artwork"
                      width={18}
                      height={18}
                    />
                  )}
                </button>
              )}

            {/* TextArea */}
            <motion.div
              variants={widthVariants}
              animate={expandInput ? "expanded" : "collapsed"}
              className={`flex items-center relative`}
            >
              <TextareaAutosize
                id="entryText"
                className={`bg-transparent text-sm outline-none resize-none text-gray5 w-full`}
                value={expandInput ? inputValue : ""}
                onChange={(e) => handleInputTextChange(e.target.value)}
                onBlur={onBlur}
                onFocus={onFocus}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                minRows={1}
                maxRows={6}
                tabIndex={0}
              />
              {/* Placeholder text */}
              {expandInput && !inputValue && (
                <div
                  className={`absolute left-0 top-0 flex items-center h-full pointer-events-none text-sm text-gray5 min-w-[32rem]`}
                >
                  {activeAction === "none"
                    ? activePage.sound
                      ? "Enter to create record, type to explore"
                      : activePage.record
                      ? "Press enter to reply, type to explore"
                      : "Type to explore"
                    : activeAction === "form"
                    ? "Arrow UP/DOWN to dial, Backspace to cancel"
                    : activeAction === "reply"
                    ? "Creating chain"
                    : null}
                </div>
              )}
            </motion.div>

            <AnimatePresence>
              {activeAction !== "none" &&
                activeAction === "reply" &&
                replyParent && (
                  <motion.button
                    exit={{ scale: 0, width: 0 }}
                    initial={{ scale: 0, width: 0 }}
                    animate={{ scale: 1, width: 18 }}
                    onClick={handleNavClick}
                    className="w-[18px] h-[18px] relative"
                    aria-label="Reply with selected parent"
                  >
                    <ChainIcon />
                    <Image
                      className="absolute top-0 left-0 rounded-full border border-gray6"
                      src={replyParent.author.image}
                      alt="artwork"
                      width={16}
                      height={16}
                    />
                  </motion.button>
                )}
            </AnimatePresence>
          </div>

          {/* Bubbles */}
          <div className={`w-3 h-3 absolute -bottom-1 -left-1 -z-10`}>
            <div
              className={`bg-[#F4F4F4] w-2 h-2 absolute top-0 right-0 rounded-full`}
            />
            <div
              className={`bg-[#F4F4F4] w-1 h-1 absolute bottom-0 left -0 rounded-full`}
            />
          </div>
          {/*  */}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 flex items-start gap-1 -bottom-6 -left-6 max-h-9">
      {left}
      {middle}
      {right}
    </div>
  );
};

export default Nav;
