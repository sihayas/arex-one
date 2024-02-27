import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import GetSearchResults from "@/lib/helper/search";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Results from "./render/Results";
import Form from "./render/Form";
import {
  TargetAddIcon,
  TargetGoIcon,
  TargetArtifactIcon,
  NotificationIcon,
  SearchIcon,
  TargetFormIcon,
  TargetCommandIcon,
} from "@/components/icons";
import { useNavContext } from "@/context/NavContext";
import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { createReply } from "@/lib/helper/artifact";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Keybinds } from "@/components/interface/nav/sub/Keybinds";
import Notifications from "@/components/interface/nav/render/Notifications";
import Search from "@/lib/helper/search";

const iconVariants = {
  exit: {
    scale: 0,
  },
  initial: {
    scale: 1,
  },
};

const notificationTransition = {
  type: "spring",
  damping: 72,
  stiffness: 800,
};

const searchTransition = {
  type: "spring",
  damping: 34,
  stiffness: 500,
};

const Nav = () => {
  const { replyTarget } = useThreadcrumb();
  const { user, activePage } = useInterfaceContext();
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
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const pageObject = activePage.sound || activePage.artifact;
  // isNone = activeAction === "none";
  const isNotifications = activeAction === "notifications";

  const contentVariants = {
    collapsed: {
      opacity: 0,
      x: -32,
      y: 32,
      width: 124,
      height: 32,
      backgroundColor: "#F4F4F4A9",
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
      },
    },
    expanded: {
      opacity: 1,
      backgroundColor: "#F4F4F4A9",
      outline: "1px solid rgba(0,0,0,0.05)",
      x: -32,
      y: 32,
      width: isNotifications ? 320 : 384,
      height: !expandInput
        ? 32 // base
        : activeAction === "none" && inputValue
        ? 472 // search
        : activeAction === "form"
        ? "auto" // form
        : activeAction === "notifications"
        ? 610 // notifications
        : 32,
      transition:
        activeAction === "notifications"
          ? notificationTransition
          : searchTransition,
    },
  };

  const barVariants = {
    collapsed: {
      x: -40,
      y: 40,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
      },
    },
    expanded: {
      x: -40,
      y: 40,
      transition:
        activeAction === "notifications"
          ? notificationTransition
          : searchTransition,
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

  const handleReplySubmit = () => {
    if (!replyTarget || !inputValue || !user) return;

    toast.promise(
      createReply(replyTarget, inputValue, user.id).then(() => {
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

  // Active Action
  useEffect(() => {
    setActiveAction(
      selectedFormSound ? "form" : replyTarget ? "reply" : "none",
    );
  }, [selectedFormSound, replyTarget, setActiveAction]);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(target) &&
        contentContainerRef.current &&
        !contentContainerRef.current.contains(target)
      ) {
        if (isNotifications) {
          setExpandInput(false);
          setActiveAction("none");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifications, setExpandInput, setActiveAction]);

  if (!user) return null;

  return (
    <>
      {/* Content / Shifter */}
      <div
        className={`absolute bottom-0 left-0 flex flex-col  ${
          !expandInput && "mix-blend-darken"
        }`}
      >
        {/* Top / Content */}
        <motion.div
          ref={contentContainerRef}
          className={`relative flex w-full flex-col items-end justify-end rounded-2xl`}
          variants={contentVariants}
          animate={expandInput ? "expanded" : "collapsed"}
        >
          {activeAction === "form" && expandInput && <Form />}
          {activeAction === "none" && inputValue && expandInput && (
            <Results searchData={data} />
          )}
          {activeAction === "notifications" && expandInput && <Notifications />}

          {!isNotifications && (
            <div
              className={`flex w-full items-center justify-center bg-transparent p-[5px] pl-[40px]`}
            >
              <TextareaAutosize
                id="entryText"
                className={`w-full resize-none bg-transparent text-base text-black outline-none ${
                  !expandInput && "pointer-events-none "
                }`}
                value={expandInput ? inputValue : ""}
                onChange={(e) => handleInputTextChange(e.target.value)}
                onBlur={onBlur}
                onFocus={onFocus}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                minRows={1}
                maxRows={6}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom / Bar */}
      <motion.div
        variants={barVariants}
        animate={expandInput ? "expanded" : "collapsed"}
        className={`absolute bottom-0 left-0 flex flex-wrap max-w-[68px] items-center gap-3 bg-transparent`}
      >
        {/* Notification Icon */}
        <motion.button
          whileHover={{
            scale: 1.1,
          }}
          animate={expandInput ? { scale: 0.8, opacity: 0.1 } : { scale: 1 }}
          ref={notificationButtonRef}
          onClick={handleNotificationsClick}
          className={`flex items-center justify-center rounded-full px-4 py-0`}
        >
          <NotificationIcon />
        </motion.button>

        {/* Target Container */}
        <button
          className={`relative flex h-10 w-10 items-center justify-center`}
        >
          {/* Avatar */}
          <motion.div
            className={`origin-top-right absolute`}
            animate={!expandInput ? { opacity: 1, scale: 1 } : { scale: 0.8 }}
            transition={{ type: "spring", damping: 24, stiffness: 400 }}
          >
            <Avatar
              imageSrc={user.image}
              altText={`${user.username}'s avatar`}
              width={40}
              height={40}
              user={user}
            />
          </motion.div>

          {/* User is on Search results */}
          <AnimatePresence>
            {expandInput && activeAction === "none" && (
              <motion.div
                className={`absolute top-0 right-0 p-3 bg-white rounded-full`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <TargetGoIcon />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form is Active */}
          <AnimatePresence>
            {expandInput &&
              activeAction === "form" &&
              (inputValue ? (
                <motion.div
                  className={`absolute top-0 right-0 p-3 bg-white rounded-full`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <TargetCommandIcon />
                </motion.div>
              ) : (
                <motion.div
                  className={`absolute top-0 right-0 p-3 bg-white rounded-full`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <TargetFormIcon />
                </motion.div>
              ))}
          </AnimatePresence>

          {/* User is on a Sound page */}
          <AnimatePresence>
            {expandInput &&
              activeAction === "none" &&
              activePage.sound &&
              !inputValue && (
                <motion.div
                  className={`absolute top-0 right-0 p-3 bg-white rounded-full`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <TargetAddIcon />
                </motion.div>
              )}
          </AnimatePresence>

          {/* User is on an Artifact page */}
          <AnimatePresence>
            {expandInput &&
              activeAction === "none" &&
              activePage.artifact &&
              !inputValue && (
                <motion.div
                  className={`absolute top-0 right-0 p-3 bg-white rounded-full`}
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 2 }}
                >
                  <TargetArtifactIcon />
                </motion.div>
              )}
          </AnimatePresence>

          {/* User is viewing notifications */}
          <AnimatePresence>
            {expandInput && activeAction === "notifications" && (
              <motion.div
                className={`absolute top-0 right-0 px-3 py-2 bg-white rounded-full`}
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2 }}
              >
                <NotificationIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Search Icon */}
        <motion.button
          whileHover={!expandInput ? { scale: 1.5 } : undefined}
          animate={expandInput ? "exit" : "initial"}
          variants={iconVariants}
          onClick={() => setExpandInput((prev) => !prev)}
          className="flex cursor-pointer items-center justify-center rounded-full"
        >
          <SearchIcon />
        </motion.button>
      </motion.div>
    </>
  );
};

export default Nav;
