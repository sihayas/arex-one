import React, { useCallback, useEffect, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHelper/search";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import RenderResults from "./sub/RenderResults";
import Form from "./sub/Form";
import {
  TargetBackIcon,
  TargetIndexIcon,
  TargetAddIcon,
  TargetGoIcon,
  TargetArtifactIcon,
  NotificationIcon,
} from "@/components/icons";
import { useNavContext } from "@/context/NavContext";
import Avatar from "@/components/global/Avatar";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { addReply } from "@/lib/apiHelper/artifact";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Keybinds } from "@/components/interface/nav/sub/Keybinds";

const Nav = () => {
  let left;
  let middle;
  let right;

  const { replyParent } = useThreadcrumb();
  const { user, pages } = useInterfaceContext();
  const {
    inputValue,
    setInputValue,
    expandInput,
    setExpandInput,
    inputRef,
    activeAction,
    setActiveAction,
  } = useNavContext();
  const { selectedFormSound } = useSoundContext();

  const activePage: Page = pages[pages.length - 1];

  const widthVariants = {
    collapsed: {
      width: "fit-content",
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
      height: 42,
      transition: {
        type: "spring",
        damping: 21,
        stiffness: 180,
      },
    },
    expanded: {
      height: !expandInput
        ? 42 // base
        : activeAction === "none" && inputValue
        ? 432 // search
        : activeAction === "form"
        ? 370 // form
        : activeAction === "notifications"
        ? 610 // notifications
        : 42,
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
  const { data } = GetSearchResults(searchQuery);

  const onBlur = useCallback(() => {
    setExpandInput(false);
  }, [setExpandInput]);
  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);
  const handleNavClick = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  const handleReplySubmit = () => {
    if (!replyParent || !inputValue || !user?.id) return;

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

  const handleKeyDown = Keybinds(handleInputTextChange, handleReplySubmit);

  // Active Action
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
          className={`min-w-[24px] h-[24px] relative`}
          whileHover={{ scale: 1.1 }}
        >
          {/* Target */}
          <AnimatePresence>
            {activeAction === "none" && (
              <>
                {!expandInput && (
                  <motion.div
                    exit={{ scale: 0 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-fit h-fit"
                  >
                    <Avatar
                      className=""
                      imageSrc={user.image}
                      altText={`${user.username}'s avatar`}
                      width={24}
                      height={24}
                      user={user}
                    />
                  </motion.div>
                )}
                {/* Target Nothing */}
                {!activePage.sound &&
                  !activePage.artifact &&
                  expandInput &&
                  !inputValue && (
                    <>
                      <motion.div
                        exit={{ scale: 0, x: "-50%", y: "-50%" }}
                        initial={{ scale: 0, x: "-50%", y: "-50%" }}
                        animate={{ scale: 1, x: "-50%", y: "-50%" }}
                        className="absolute center-x center-y z-10"
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
                          damping: 16,
                          stiffness: 80,
                        }}
                        className="absolute left-1/2 top-1/2 bg-gray3 rounded-full w-6 h-6"
                      />
                    </>
                  )}

                {/* Target Search Result */}
                {inputValue && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2 z-10"
                    >
                      <TargetGoIcon />
                    </motion.div>

                    <motion.div
                      exit={{
                        scale: 0.75,
                        opacity: 0.75,
                        x: "-50%",
                        y: "-50%",
                      }}
                      initial={{
                        scale: 0.75,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      transition={{
                        type: "spring",
                        damping: 10,
                        stiffness: 80,
                      }}
                      className="absolute left-1/2 top-1/2 bg-gray3 rounded-full w-6 h-6"
                    />
                  </>
                )}

                {/* Target Sound */}
                {!inputValue && activePage.sound && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2 z-10"
                    >
                      <TargetAddIcon color="#FFF" />
                    </motion.div>

                    <motion.div
                      exit={{
                        scale: 0.5,
                        opacity: 0.5,
                        x: "-50%",
                        y: "-50%",
                      }}
                      initial={{
                        scale: 0.75,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      transition={{
                        type: "spring",
                        damping: 16,
                        stiffness: 80,
                      }}
                      className="absolute left-1/2 top-1/2 bg-gray3 rounded-full w-6 h-6"
                    />
                  </>
                )}

                {/* Target Artifact */}
                {!inputValue && activePage.artifact && (
                  <>
                    <motion.div
                      exit={{ scale: 0, x: "-50%", y: "-50%" }}
                      initial={{ scale: 0, x: "-50%", y: "-50%" }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      className="absolute left-1/2 top-1/2 z-10"
                    >
                      <TargetArtifactIcon />
                    </motion.div>

                    <motion.div
                      exit={{
                        scale: 0.5,
                        opacity: 0.5,
                        x: "-50%",
                        y: "-50%",
                      }}
                      initial={{
                        scale: 0.75,
                        opacity: 1,
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{ scale: 1, x: "-50%", y: "-50%" }}
                      transition={{
                        type: "spring",
                        damping: 16,
                        stiffness: 80,
                      }}
                      className="absolute left-1/2 top-1/2 bg-gray3 rounded-full w-6 h-6"
                    />
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
      <div className={`p-2 flex items-center w-full relative`}>
        {/* Input */}
        <TextareaAutosize
          id="entryText"
          className={`bg-transparent text-base outline-none resize-none text-gray5 w-full absolute left-2`}
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
        {/* Username */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            expandInput
              ? { opacity: 0, scale: 0 }
              : {
                  opacity: 1,
                  scale: 1,
                }
          }
          transition={{ duration: 0.2 }}
          exit={{ opacity: 0, scale: 0 }}
          className="text-gray5 text-base font-medium origin-center"
        >
          {user.username}
        </motion.div>
      </div>
    );

    right = (
      <div className={`flex items-center min-w-fit`}>
        <button>
          <NotificationIcon />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={widthVariants}
      animate={expandInput ? "expanded" : "collapsed"}
      className="absolute flex flex-col -bottom-[50px] center-x z-50 -space-y-[42px] overflow-hidden"
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
        className={`flex items-center p-2 bg-transparent max-h-[42px] justify-between relative`}
      >
        {left}
        {middle}
        {right}
      </motion.div>
    </motion.div>
  );
};

export default Nav;
