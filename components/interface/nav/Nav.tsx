import React, { useCallback, useEffect, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHelper/search";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import RenderResults from "./sub/RenderResults";
import Form from "./sub/Form";
import {
  TargetIcon,
  TargetBackIcon,
  TargetIndexIcon,
  TargetAddIcon,
  TargetGoIcon,
  TargetArtifactIcon,
} from "@/components/icons";
import { useNavContext } from "@/context/NavContext";
import Avatar from "@/components/global/Avatar";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import Image from "next/image";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { addReply } from "@/lib/apiHelper/artifact";
import { toast } from "sonner";
import { useSound } from "@/hooks/usePage";
import { AnimatePresence, motion } from "framer-motion";
import exp from "node:constants";

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
      width: 103,
      borderRadius: 18,
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
        stiffness: 300,
      },
    },
  };

  const borderVariants = {
    collapsed: {
      borderRadius: 18,
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
    }

    // Wipe selectedFormSound and replyParent
    else if (
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
      setReplyParent(activePage.artifact);
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

  // Determine the active action
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
        <motion.button
          onClick={handleNavClick}
          className="min-w-[18px] h-[18px] relative"
        >
          {/* Target */}
          <AnimatePresence>
            {activeAction === "none" && (
              <>
                {/* Target Nothing */}
                {!activePage.sound && !activePage.artifact && !inputValue && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute center-x center-y"
                    >
                      <TargetIndexIcon />
                    </motion.div>

                    <motion.div
                      exit={{
                        scale: 0.5,
                        opacity: 0.5,
                        x: "-50%",
                        y: "-50%",
                      }}
                      initial={{
                        scale: 0.5,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 220,
                      }}
                      className="absolute left-1/2 top-1/2"
                    >
                      <TargetIcon color={`#999`} />
                    </motion.div>
                  </>
                )}

                {/* Target Search Result */}
                {inputValue && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2"
                    >
                      <TargetGoIcon color="#999" />
                    </motion.div>

                    <motion.div
                      exit={{ scale: 0.5, opacity: 0.5, x: "-50%", y: "-50%" }}
                      initial={{
                        scale: 0.5,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2"
                      transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 220,
                      }}
                    >
                      <TargetIcon color={`#999`} />
                    </motion.div>
                  </>
                )}

                {/* Target Sound */}
                {!inputValue && activePage.sound && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2"
                    >
                      <TargetAddIcon color="#999" />
                    </motion.div>

                    <motion.div
                      exit={{ scale: 0.5, opacity: 0.5, x: "-50%", y: "-50%" }}
                      initial={{
                        scale: 0.5,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2"
                      transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 220,
                      }}
                    >
                      <TargetIcon color={`#999`} />
                    </motion.div>
                  </>
                )}

                {/* Target Artifact */}
                {!inputValue && activePage.artifact && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2"
                    >
                      <TargetArtifactIcon />
                    </motion.div>

                    <motion.div
                      exit={{ scale: 0.5, opacity: 0.5, x: "-50%", y: "-50%" }}
                      initial={{
                        scale: 0.5,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2"
                      transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 220,
                      }}
                    >
                      <TargetIcon color={`#999`} />
                    </motion.div>
                  </>
                )}
              </>
            )}
          </AnimatePresence>

          {/* Target Back Wrapper */}
          <AnimatePresence>
            {activeAction !== "none" && !inputValue && (
              <motion.div
                exit={{ scale: 0.5, opacity: 0.5, x: "-50%", y: "-50%" }}
                initial={{
                  scale: 0.5,
                  opacity: 1,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ scale: 1, x: "-50%", y: "-50%" }}
                className="absolute left-1/2 top-1/2"
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 220,
                }}
              >
                <TargetBackIcon color={`#999`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </>
    );

    // Textarea
    middle = (
      <div
        className={`px-2 pt-[6px] pb-[7px] flex items-center w-full relative`}
      >
        {/* Text Area */}
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
      className="absolute flex flex-col -bottom-[50px] center-x z-50 -space-y-[34px] overflow-hidden"
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
