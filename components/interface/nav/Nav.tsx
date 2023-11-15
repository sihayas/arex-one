import React, { useCallback, useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHandlers/searchAPI";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Search from "./sub/Search";
import Form from "./sub/Form";
import Signals from "./sub/Signals";
import { ChainIcon, AddIcon } from "@/components/icons";
import { useNavContext } from "@/context/NavContext";
import UserAvatar from "@/components/global/UserAvatar";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import Image from "next/image";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { Record, Reply } from "@/types/dbTypes";
import { addReply } from "@/lib/apiHandlers/recordAPI";
import { toast } from "sonner";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";

const isRecord = (
  replyParent: Record | Reply | null,
): replyParent is Record => {
  return (replyParent as Record).appleAlbumData !== undefined;
};

const Nav = () => {
  let left;
  let middle;
  let right;

  // For record page/reply
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
  } = useNavContext();
  const { selectedFormSound, setSelectedFormSound, selectedSound } = useSound();
  const { handleSelectSound } = useHandleSoundClick();

  // Determine current page
  const activePage: Page = pages[pages.length - 1];
  const isRecordPage = activePage.record;
  const isSoundPage = activePage.sound;

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

  // Debounce the search query
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 250);
  const handleInputTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  // Search results
  const { data, isInitialLoading, isFetching, error } =
    GetSearchResults(searchQuery);

  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  // Reset the nav context to its appropriate state relative to active page
  const onBlur = useCallback(() => {
    setExpandInput(false);
    // Show sound icon again
    if (isSoundPage && !selectedFormSound) {
      setSelectedFormSound(selectedSound);
    }
    // Show reply parent icon again
    else if (isRecordPage && !replyParent) {
      setReplyParent(record);
    }
  }, [
    setExpandInput,
    selectedFormSound,
    selectedSound,
    setSelectedFormSound,
    isSoundPage,
    isRecordPage,
    record,
    replyParent,
    setReplyParent,
  ]);

  // Focus input on click
  const handleNavClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

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
    }
    // Wipe selectedFormSound and replyParent if backspace is pressed and input is empty
    if (
      e.key === "Backspace" &&
      inputValue === "" &&
      (selectedFormSound || replyParent)
    ) {
      e.preventDefault();
      setSelectedFormSound(null);
      setReplyParent(null);
      setInputValue(storedInputValue);
      setStoredInputValue("");
      inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    // Prepare the Form if user is viewing a sound
    if (isSoundPage) {
      setSelectedFormSound(selectedSound);
    } else if (isRecordPage) {
      setSelectedFormSound(null);
    }
  }, []);

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

    // Input & Search Results/Form
    middle = (
      <div className={`flex flex-col rounded-[18px] w-[416px] relative`}>
        {/* Input Outer */}
        <div
          className={`bg-[#F4F4F4] flex flex-col items-center absolute bottom-1 left-0 rounded-[18px]`}
        >
          {/* Expanded Area */}
          {expandInput && !replyParent && (selectedFormSound || inputValue) && (
            <div
              className={`flex flex-col relative w-full p-3 pb-[6px] overflow-scroll`}
              style={{ height: 448 }}
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
          )}

          {/* Input */}
          <div className={`px-3 pt-[6px] pb-[7px] flex items-center w-full`}>
            {/* Sound Icon */}
            {!expandInput && isSoundPage && (
              <button onClick={handleNavClick} className={`w-5 h-5`}>
                {/* Sound */}
                {activePage.sound && selectedFormSound && (
                  <Image
                    className={`rounded-[6px] border border-gray3`}
                    src={selectedFormSound.artworkUrl}
                    alt={`artwork`}
                    width={20}
                    height={20}
                  />
                )}
              </button>
            )}

            {/* TextArea */}
            <div className={`relative flex items-center`}>
              <TextareaAutosize
                id="entryText"
                className={`bg-transparent text-sm outline-none resize-none text-gray5 ${
                  expandInput ? "w-[336px]" : "w-0"
                }`}
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
              {expandInput && (
                <div className="absolute left-0 top-0 flex items-center h-full pointer-events-none text-sm text-gray5 font-medium">
                  {!inputValue && !selectedFormSound
                    ? "Explore RX..."
                    : selectedFormSound && !inputValue
                    ? "Arrow & type to create, Enter to view."
                    : null}
                </div>
              )}
            </div>

            {/*Record / Reply Icon */}
            {isRecordPage && replyParent && (
              <button
                onClick={handleNavClick}
                className="w-5 h-5 relative"
                aria-label="Description of what the button does"
              >
                <ChainIcon />
                {activePage.record && (
                  <Image
                    className="absolute top-0 left-0 rounded-full border border-gray6"
                    src={activePage.record.author.image}
                    alt="artwork"
                    width={18}
                    height={18}
                  />
                )}
              </button>
            )}
          </div>

          {/* Bubbles */}
          <div className={`w-3 h-3 absolute -bottom-1 -left-1`}>
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

    // Form & Search
    right = (
      // <div
      //   onClick={() => setExpandSignals(!expandSignals)}
      //   onBlur={() => setExpandSignals(false)}
      //   ref={signalsScope}
      //   className={`cursor-pointer flex flex-col items-center`}
      // >
      //   <div
      //     className={
      //       "w-2 h-2 bg-action absolute left-0 top-0" +
      //       " rounded-full" +
      //       " outline outline-white"
      //     }
      //   />
      //
      //   {expandSignals && <Signals />}
      // </div>
      <></>
    );
  }

  return (
    <div className="fixed z-50 flex items-start gap-1 -bottom-6 -left-6 max-h-9">
      {left}
      {middle}
      {right}
    </div>
  );
};

<div></div>;
export default Nav;
{
  /* Form / Search Results / Bottom */
}
// {
//   /*<div*/
// }
// {
//   /*  className={`flex flex-col relative w-full ${*/
// }
// {
//   /*    selectedFormSound*/
// }
// {
//   /*      ? "overflow-visible"*/
// }
// {
//   /*      : "overflow-scroll scrollbar-none"*/
// }
// {
//   /*  }`}*/
// }
// {
//   /*  style={{ height: portalHeight, opacity: expandInput ? 1 : 0 }}*/
// }
// {
//   /*>*/
// }
// {
//   /*  /!* If no selected form sound render search results *!/*/
// }
// {
//   /*  {selectedFormSound && expandInput ? (*/
// }
// {
//   /*    <Form />*/
// }
// {
//   /*  ) : (*/
// }
// {
//   /*    !selectedFormSound &&*/
// }
// {
//   /*    inputValue && (*/
// }
// {
//   /*      <Search*/
// }
// {
//   /*        searchData={data}*/
// }
// {
//   /*        isInitialLoading={isInitialLoading}*/
// }
// {
//   /*        isFetching={isFetching}*/
// }
// {
//   /*        error={error}*/
// }
// {
//   /*      />*/
// }
// {
//   /*    )*/
// }
// {
//   /*  )}*/
// }
// {
//   /*</div>*/
// }
