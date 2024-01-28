import React, { useCallback, useEffect, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHelper/search";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Results from "./render/Results";
import Form from "./render/Form";
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
import Notifications from "@/components/interface/nav/render/Notifications";

const Nav = () => {
  const { replyTarget } = useThreadcrumb();
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

  const containerVariants = {
    collapsed: {
      height: 43,
      x: 0,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
        x: {
          type: "spring",
          stiffness: 140,
          damping: 18,
        },
      },
    },
    expanded: {
      height: !expandInput
        ? 42 // base
        : activeAction === "none" && inputValue
        ? 432 // search
        : activeAction === "form"
        ? 420 // form
        : activeAction === "notifications"
        ? 610 // notifications
        : 42,
      x: activeAction === "notifications" ? -200 : 0,
      transition: {
        type: "spring",
        damping: 32,
        stiffness: 280,
        x: {
          type: "spring",
          stiffness: 140,
          damping: 20,
        },
      },
    },
  };

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
      width: activeAction !== "notifications" ? 384 : 240,
      borderRadius: 18,
      transition: {
        type: "spring",
        damping: 21,
        stiffness: 300,
      },
    },
  };

  const targetVariants = {
    exit: {
      scale: 0.75,
      opacity: 0.75,
      x: "-50%",
      y: "-50%",
    },
    initial: {
      scale: 0.75,
      opacity: 1,
      x: "-50%",
      y: "-50%",
    },
    animate: {
      scale: 1,
      x: "-50%",
      y: "-50%",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 160,
      },
    },
  };

  const iconVariants = {
    exit: {
      scale: 0,
      x: "-50%",
      y: "-50%",
    },
    initial: {
      scale: 0,
      x: "-50%",
      y: "-50%",
    },
    animate: {
      scale: 1,
      x: "-50%",
      y: "-50%",
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
    if (activeAction === "notifications") setActiveAction("none");
  }, [setExpandInput, activeAction, setActiveAction]);
  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);
  const handleNavClick = useCallback(() => {
    setExpandInput(true);
    setActiveAction("notifications");
  }, [setExpandInput, setActiveAction]);

  const handleReplySubmit = () => {
    if (!replyTarget || !inputValue || !user?.id) return;

    toast.promise(
      addReply(replyTarget, inputValue, user?.id).then(() => {
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
    } else if (replyTarget) {
      setActiveAction("reply");
    } else {
      setActiveAction("none");
    }
  }, [selectedFormSound, setActiveAction, replyTarget]);

  if (!user) return null;

  return (
    <motion.div
      variants={widthVariants}
      animate={expandInput ? "expanded" : "collapsed"}
      className="absolute flex flex-col -bottom-[50px] center-x z-50 -space-y-[42px]"
    >
      {/* Content */}
      <motion.div
        className={`flex flex-col relative w-full overflow-scroll scrollbar-none bg-[#F4F4F4]/80 outline outline-1 outline-silver rounded-3xl -z-10`}
        variants={containerVariants}
        animate={expandInput ? "expanded" : "collapsed"}
      >
        {activeAction === "form" && expandInput && <Form />}
        {activeAction === "none" && inputValue && expandInput && (
          <Results searchData={data} />
        )}
        {activeAction === "notifications" && expandInput && <Notifications />}
      </motion.div>

      {/* Bar */}
      <motion.div
        animate={expandInput ? "expanded" : "collapsed"}
        className={`flex items-center p-2 pl-1.5 bg-transparent max-h-[40px] justify-between relative`}
      >
        {/* Left */}
        <>
          <button
            onClick={handleNavClick}
            className={`px-3 py-2 mr-2 bg-[#E5E5E5] rounded-full flex items-center justify-center`}
          >
            <NotificationIcon color={`#7AFF00`} />
          </button>
          {/* Target Container */}
          <motion.button className={` relative`} whileHover={{ scale: 1.1 }}>
            {/* Target */}
            <AnimatePresence>
              {activeAction === "none" && (
                <>
                  {!expandInput && (
                    <motion.div
                      exit={{ scale: 0 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-max h-max"
                    >
                      <Avatar
                        className=""
                        imageSrc={user.image}
                        altText={`${user.username}'s avatar`}
                        width={32}
                        height={32}
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
                          exit="exit"
                          initial="initial"
                          animate="animate"
                          variants={iconVariants}
                          className="absolute center-x center-y z-10"
                        >
                          <TargetIndexIcon />
                        </motion.div>

                        <motion.div
                          exit="exit"
                          initial="initial"
                          animate="animate"
                          variants={targetVariants}
                          className="absolute left-1/2 top-1/2 bg-gray2 rounded-full w-6 h-6"
                        />
                      </>
                    )}

                  {/* Target Search Result */}
                  {inputValue && expandInput && (
                    <>
                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={iconVariants}
                        className="absolute center-x center-y z-10"
                      >
                        <TargetGoIcon />
                      </motion.div>

                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={targetVariants}
                        className="absolute left-1/2 top-1/2 bg-gray2 rounded-full w-6 h-6"
                      />
                    </>
                  )}

                  {/* Target Sound */}
                  {!inputValue && activePage.sound && expandInput && (
                    <>
                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={iconVariants}
                        className="absolute center-x center-y z-10"
                      >
                        <TargetAddIcon color="#FFF" />
                      </motion.div>

                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={targetVariants}
                        className="absolute left-1/2 top-1/2 bg-gray2 rounded-full w-6 h-6"
                      />
                    </>
                  )}

                  {/* Target Artifact */}
                  {!inputValue && activePage.artifact && expandInput && (
                    <>
                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={iconVariants}
                        className="absolute center-x center-y z-10"
                      >
                        <TargetArtifactIcon />
                      </motion.div>

                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={targetVariants}
                        className="absolute left-1/2 top-1/2 bg-gray2 rounded-full w-6 h-6"
                      />
                    </>
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Target Back Wrapper */}
            <AnimatePresence>
              {activeAction !== "none" &&
                !inputValue &&
                activeAction !== "notifications" && (
                  <motion.div
                    exit="exit"
                    initial="initial"
                    animate="animate"
                    variants={iconVariants}
                    className="absolute center-x center-y z-10"
                  >
                    <TargetBackIcon color={`#999`} />
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.button>
        </>
        {/* Right */}
        <div className={`p-2 pr-0 flex items-center w-full relative`}>
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
            className="text-black text-base origin-center leading-[11px]"
          >
            RX
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Nav;
