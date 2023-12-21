import React, { useCallback, useEffect, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHelper/search";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import RenderResults from "./sub/RenderResults";
import Form from "./sub/Form";
import {
  ReplyIcon,
  TargetIcon,
  TargetBackIcon,
  TargetIndexIcon,
  TargetAddIcon,
  TargetGoIcon,
} from "@/components/icons";
import { useNavContext } from "@/context/NavContext";
import Avatar from "@/components/global/Avatar";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import Image from "next/image";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { addReply } from "@/lib/apiHelper/artifact";
import { toast } from "sonner";
import { useSound } from "@/hooks/usePage";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

const Nav = () => {
  let left;
  let middle;
  let right;

  // For artifact page/reply input
  const { replyParent, setReplyParent } = useThreadcrumb();
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
  const { selectedFormSound, setSelectedFormSound } = useSoundContext();
  const { handleSelectSound } = useSound();

  const activePage: Page = pages[pages.length - 1];

  const widthVariants = {
    collapsed: {
      width: 112,
      borderRadius: 12,
      transition: {
        type: "spring",
        damping: 28,
        stiffness: 220,
      },
    },
    expanded: {
      width: 384,
      borderRadius: 18,
      transition: {
        type: "spring",
        damping: 21,
        stiffness: 240,
      },
    },
  };

  const borderVariants = {
    collapsed: {
      borderRadius: 12,
      transition: {
        type: "spring",
        damping: 28,
        stiffness: 220,
      },
    },
    expanded: {
      borderRadius: 18,
      transition: {
        type: "spring",
        damping: 21,
        stiffness: 240,
      },
    },
  };

  const heightVariants = {
    collapsed: {
      height: 34,
      transition: {
        type: "spring",
        damping: 21,
        stiffness: 180,
      },
    },
    expanded: {
      height: expandInput
        ? activeAction === "none" && inputValue
          ? 400
          : activeAction === "form"
          ? 370
          : activeAction === "reply"
          ? 36
          : 34
        : 34,
      transition: {
        type: "spring",
        damping: 32,
        stiffness: 280,
      },
    },
  };

  // Debounce the search query
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 250);
  const handleInputTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  // Render search results
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

  // Key bindings
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
      handleSelectSound(selectedFormSound);
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
      setSelectedFormSound(sound);
    }
    // Prepare reply parent
    else if (
      e.key === "Enter" &&
      activePage.artifact &&
      activeAction === "none" &&
      !inputValue
    ) {
      e.preventDefault();
      setReplyParent({ artifact: activePage.artifact });
    }
  };

  const handleReplySubmit = () => {
    if (!replyParent || !inputValue || !user?.id) return;

    // Wrap the addReply call in toast.promise
    toast.promise(
      addReply(replyParent, inputValue, user?.id).then(() => {
        setInputValue("");
      }),
      {
        loading: "Sending reply...",
        success: "Reply sent successfully!",
        error: "Error submitting reply",
      },
    );
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
      <>
        {/* Target Container */}
        <AnimatePresence>
          <motion.button
            exit={{ scale: 0, width: 0 }}
            initial={{ scale: 0, width: 0 }}
            animate={{ scale: 1, width: 18 }}
            onClick={handleNavClick}
            className="w-[18px] h-[18px] relative"
            aria-label="Reply with selected parent"
          >
            <TargetIcon color={`#CCC`} />
            {/* Target */}
            <div className={`absolute center-x center-y`}>
              <TargetIndexIcon />
            </div>
          </motion.button>
        </AnimatePresence>
      </>
    );

    // Textarea
    middle = (
      <div
        className={`px-3 pt-[6px] pb-[7px] flex items-center w-full relative`}
      >
        {/* TextArea */}
        <motion.div className={`flex items-center relative w-full`}>
          <TextareaAutosize
            id="entryText"
            className={`bg-transparent text-base outline-none resize-none text-gray5 w-full`}
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
          {!inputValue && (
            <div
              className={`absolute left-0 top-0 flex items-center h-full pointer-events-none text-base text-gray2 min-w-[32rem]`}
            >
              {activeAction === "none"
                ? activePage.sound
                  ? "Enter to create artifact, type to explore"
                  : activePage.artifact
                  ? "Press enter to reply, type to explore"
                  : "VOIR"
                : activeAction === "form"
                ? "Create..."
                : activeAction === "reply"
                ? "Creating chain"
                : null}
            </div>
          )}
        </motion.div>
      </div>
    );

    right = (
      <Avatar
        className="shadow-shadowKitLow"
        imageSrc={user.image}
        altText={`${user.username}'s avatar`}
        width={26}
        height={26}
        user={user}
      />
    );
  }

  return (
    <motion.div
      variants={widthVariants}
      animate={expandInput || inputValue ? "expanded" : "collapsed"}
      className="absolute flex flex-col -bottom-[50px] center-x z-50 -space-y-[34px] overflow-hidden "
    >
      {/* Content */}
      <motion.div
        className={`flex flex-col relative w-full overflow-scroll scrollbar-none bg-[#E5E5E5]/90 rounded-[18px] -z-10`}
        variants={heightVariants}
        animate={expandInput ? "expanded" : "collapsed"}
      >
        <div
          style={{
            background: `linear-gradient(to top, #E5E5E5, rgba(0,0,0,0)`,
            opacity: activeAction === "none" ? 1 : 0,
          }}
          className="fixed bottom-0 w-full h-44 rounded-b-[16px] z-10"
        />
        {/* If no selected form sound render search results */}
        {selectedFormSound && expandInput ? (
          <Form />
        ) : (
          !selectedFormSound &&
          inputValue &&
          expandInput && <RenderResults searchData={data} />
        )}
      </motion.div>
      {/* Bar */}
      <motion.div
        variants={borderVariants}
        animate={expandInput ? "expanded" : "collapsed"}
        className={`flex items-center pl-2 pr-1 py-1 bg-transparent max-h-[34px] justify-between relative`}
      >
        {left}
        {middle}
        {right}
      </motion.div>
    </motion.div>
  );
};

export default Nav;

// {expandInput && !replyParent && (selectedFormSound || inputValue) && (
//     <motion.div
//         className={`flex flex-col relative w-full p-3 pb-[6px]
// overflow-scroll scrollbar-none`}
//         variants={heightVariants}
//         animate={expandInput ? "expanded" : "collapsed"}
//     >
//       {/* If no selected form sound render search results */}
//       {selectedFormSound && expandInput ? (
//           <Form />
//       ) : (
//           !selectedFormSound &&
//           inputValue && (
//               <RenderResults
//                   searchData={data}
//                   isInitialLoading={isInitialLoading}
//                   isFetching={isFetching}
//                   error={error}
//               />
//           )
//       )}
//     </motion.div>
// )}

{
  /*<AnimatePresence>*/
}
{
  /*  {activeAction !== "none" &&*/
}
{
  /*      activeAction === "reply" &&*/
}
{
  /*      replyParent?.artifact && (*/
}
{
  /*          <motion.button*/
}
{
  /*              exit={{ scale: 0, width: 0 }}*/
}
{
  /*              initial={{ scale: 0, width: 0 }}*/
}
{
  /*              animate={{ scale: 1, width: 18 }}*/
}
{
  /*              onClick={handleNavClick}*/
}
{
  /*              className="w-[18px] h-[18px] relative"*/
}
{
  /*              aria-label="Reply with selected parent"*/
}
{
  /*          >*/
}
{
  /*            <ReplyIcon />*/
}
{
  /*            <Image*/
}
{
  /*                className="absolute top-0 left-0 rounded-full border border-gray6"*/
}
{
  /*                src={*/
}
{
  /*                  replyParent.reply*/
}
{
  /*                      ? replyParent.reply.author.image*/
}
{
  /*                      : replyParent.artifact.author.image*/
}
{
  /*                }*/
}
{
  /*                alt="artwork"*/
}
{
  /*                width={16}*/
}
{
  /*                height={16}*/
}
{
  /*            />*/
}
{
  /*          </motion.button>*/
}
{
  /*      )}*/
}
{
  /*</AnimatePresence>*/
}
