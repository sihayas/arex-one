import React, { useCallback, useEffect, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import GetSearchResults from "@/lib/apiHelper/search";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Results from "./render/Results";
import Form from "./render/Form";
import {
  TargetIndexIcon,
  TargetAddIcon,
  TargetGoIcon,
  TargetArtifactIcon,
  NotificationIcon,
  AmperesandIcon,
  TargetFormIcon,
  TargetCommandIcon,
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

const iconVariants = {
  exit: {
    scale: 0,
  },
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
  },
};

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
      x: activeAction === "notifications" ? -212 : 0,
      transition: {
        type: "spring",
        damping: 32,
        stiffness: 280,
        x: {
          type: "spring",
          stiffness: 180,
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
      width: activeAction !== "notifications" ? 384 : 320,
      borderRadius: 18,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 380,
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
    if (activeAction === "notifications") setActiveAction("none");
  }, [setExpandInput, activeAction, setActiveAction]);

  const onFocus = useCallback(() => {
    setExpandInput(true);
  }, [setExpandInput]);

  const handleNotificationsClick = useCallback(() => {
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
      className="center-x absolute -bottom-[50px] z-50 flex flex-col -space-y-[42px]"
    >
      {/* Content */}
      <motion.div
        className={`scrollbar-none outline-silver relative -z-10 flex w-full flex-col overflow-scroll rounded-3xl bg-[#F4F4F4] outline outline-1`}
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
        className={`relative flex max-h-[40px] items-center justify-between bg-transparent p-2 px-1.5`}
      >
        {/* Left, Notification Button, Target/Action Icon */}
        <>
          <button
            onClick={handleNotificationsClick}
            className={`mr-2 flex items-center justify-center rounded-full bg-[#E5E5E5] px-3 py-2`}
          >
            <NotificationIcon />
          </button>
          {/* Target Container */}
          <motion.button
            className={`relative flex min-h-[28px] min-w-[28px] items-center justify-center`}
            whileHover={{ scale: 1.1 }}
          >
            {/* Avatar / Default Target */}
            <AnimatePresence>
              {!expandInput && (
                <motion.div
                  exit="exit"
                  initial="initial"
                  animate="animate"
                  className="h-max w-max"
                >
                  <Avatar
                    className="border-silver border"
                    imageSrc={user.image}
                    altText={`${user.username}'s avatar`}
                    width={28}
                    height={28}
                    user={user}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Target */}
            <AnimatePresence>
              {activeAction === "none" && (
                <>
                  {/* Target Nothing */}
                  {!activePage.sound &&
                    !activePage.artifact &&
                    expandInput &&
                    !inputValue && (
                      <motion.div
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        variants={iconVariants}
                      >
                        <TargetIndexIcon />
                      </motion.div>
                    )}

                  {/* Target Search Result */}
                  {inputValue && expandInput && (
                    <motion.div
                      exit="exit"
                      initial="initial"
                      animate="animate"
                      variants={iconVariants}
                    >
                      <TargetGoIcon />
                    </motion.div>
                  )}

                  {/* Target, Active Page is Sound */}
                  {!inputValue && activePage.sound && expandInput && (
                    <motion.div
                      exit="exit"
                      initial="initial"
                      animate="animate"
                      variants={iconVariants}
                    >
                      <TargetAddIcon color="#FFF" />
                    </motion.div>
                  )}

                  {/* Target, Active Page is Artifact */}
                  {!inputValue && activePage.artifact && expandInput && (
                    <motion.div
                      exit="exit"
                      initial="initial"
                      animate="animate"
                      variants={iconVariants}
                      className="center-x center-y absolute z-10"
                    >
                      <TargetArtifactIcon />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Target Active Action is Form, No Input Value, Icon */}
            <AnimatePresence>
              {activeAction === "form" &&
                expandInput &&
                (!inputValue ? (
                  <motion.div
                    exit="exit"
                    initial="initial"
                    animate="animate"
                    variants={iconVariants}
                  >
                    <TargetFormIcon color={`#999`} />
                  </motion.div>
                ) : (
                  <motion.div
                    exit="exit"
                    initial="initial"
                    animate="animate"
                    variants={iconVariants}
                  >
                    <TargetCommandIcon color={`#999`} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.button>
        </>

        {/* Right, Text Input */}
        <div className={`relative flex w-full items-center p-2 pr-0`}>
          {/* Input */}
          <TextareaAutosize
            id="entryText"
            className={`absolute left-2 w-full resize-none bg-transparent text-base text-black outline-none ${!expandInput && "pointer-events-none"}`}
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
          {/* Discover & */}
          <motion.div
            whileHover={{ scale: 0.75 }}
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
            className="origin-center cursor-pointer"
            onClick={() => setExpandInput((prev) => !prev)}
          >
            <button
              className={`flex items-center justify-center rounded-full bg-[#E5E5E5] p-2`}
            >
              <AmperesandIcon />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Nav;
