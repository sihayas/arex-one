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
import Image from "next/image";

const iconVariants = {
  exit: {
    opacity: 0,
    scale: 0,
  },
  initial: {
    opacity: 1,
    scale: 1,
  },
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

  const isNotifications = activeAction === "notifications";
  const isForm = activeAction === "form";
  const isReply = activeAction === "reply";

  const pageHasData = activePage.sound || activePage.artifact;

  const contentVariants = {
    collapsed: {
      x: 8,
      y: 36,
      width: 56,
      height: 32,
      borderRadius: 24,
      boxShadow:
        "0px 0px 0px 0px rgba(0, 0, 0, 0.0), 0px 0px 0px 0px rgba(0, 0, 0,0.0)",
      backgroundColor: "#F4F4F4A9",
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
      },
    },

    expanded: {
      x: isReply ? 16 : -40,
      y: isReply ? -16 : 40,
      width: isNotifications ? 448 : 384,
      height: !expandInput
        ? 40 // base
        : activeAction === "none" && inputValue
        ? 472 // search
        : isForm || isReply
        ? "auto" // form
        : isNotifications
        ? 780 // notifications
        : 40,
      borderRadius: isReply ? 20 : isNotifications ? 24 : 16,
      boxShadow:
        "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
      backgroundColor: isReply ? "#FFFFFF" : "#F4F4F4",
      outline: "1px solid rgba(0,0,0,0.05)",
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 400,
      },
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
      x: isReply ? -32 : -40,
      y: isReply ? 32 : 40,
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 400,
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
        className={`absolute bottom-0 left-0 flex flex-col ${
          !expandInput && "mix-blend-darken"
        }`}
      >
        {/* Top / Content */}
        <motion.div
          ref={contentContainerRef}
          className={`flex w-full flex-col items-end justify-end`}
          variants={contentVariants}
          animate={expandInput ? "expanded" : "collapsed"}
        >
          {/* Content */}
          <AnimatePresence>
            {isForm && expandInput && <Form />}
            {!isForm && !isReply && expandInput && (
              <Results searchData={data} />
            )}
            {isNotifications && expandInput && <Notifications />}
          </AnimatePresence>

          {/* Text Input */}
          {!isNotifications && (
            <div
              className={`flex w-full items-center justify-center bg-transparent p-[9px] relative ${
                isReply ? "pr-[44px] pl-3" : "pl-[40px]"
              }`}
            >
              {isReply && expandInput && replyTarget && (
                <>
                  <div className={`absolute top-2 right-2`}>
                    <Image
                      src={replyTarget?.artifact.author.image}
                      alt={`${replyTarget?.artifact.author.username}'s avatar`}
                      width={24}
                      height={24}
                      className={`rounded-full`}
                    />
                  </div>

                  <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
                    <div
                      className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
                    />
                    <div
                      className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white`}
                    />
                  </div>
                </>
              )}
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

      {/* Iconography */}
      <motion.div
        variants={barVariants}
        animate={expandInput ? "expanded" : "collapsed"}
        className={`absolute bottom-0 left-0 flex flex-col gap-2 bg-transparent`}
      >
        {/* Notification Icon */}
        <motion.button
          whileHover={{
            scale: 1.1,
          }}
          animate={expandInput ? { scale: 0, opacity: 0 } : { scale: 1 }}
          ref={notificationButtonRef}
          onClick={handleNotificationsClick}
          className={`flex w-10 items-center justify-center`}
        >
          <div className={`px-[11px] py-3 bg-[#F4F4F4] rounded-full`}>
            <NotificationIcon />
          </div>
        </motion.button>

        <div className={`flex gap-2 items-center`}>
          {/* Target Container */}
          <button
            className={`relative flex h-10 w-10 items-center justify-center`}
          >
            {/* Avatar */}
            <motion.div
              className={`absolute`}
              animate={expandInput ? { scale: 0.5 } : { opacity: 1, scale: 1 }}
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

            <AnimatePresence>
              {expandInput && activeAction === "none" && !pageHasData && (
                <motion.div
                  className={`absolute center-x center-y p-1.5 bg-[#CCC] rounded-full`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <TargetGoIcon />
                </motion.div>
              )}

              {/* Form is Active */}
              {expandInput &&
                activeAction === "form" &&
                (inputValue ? (
                  <motion.div
                    className={`absolute center-x center-y p-1.5 bg-[#CCC] rounded-full`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <TargetCommandIcon />
                  </motion.div>
                ) : (
                  <motion.div
                    className={`absolute center-x center-y p-1.5 bg-[#CCC] rounded-full`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <TargetFormIcon />
                  </motion.div>
                ))}

              {/* User is on a Sound page */}
              {expandInput &&
                activeAction === "none" &&
                activePage.sound &&
                !inputValue && (
                  <motion.div
                    className={`absolute center-x center-y p-1.5 bg-[#CCC] rounded-full`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <TargetAddIcon />
                  </motion.div>
                )}

              {/* User is on an Artifact page */}
              {expandInput &&
                activeAction === "none" &&
                activePage.artifact &&
                !inputValue && (
                  <motion.div
                    className={`absolute center-x center-y p-1.5 bg-[#CCC] rounded-full`}
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <TargetArtifactIcon />
                  </motion.div>
                )}

              {/* User is viewing notifications */}
              {expandInput && activeAction === "notifications" && (
                <motion.div
                  className={`absolute top-0 right-0 px-[11px] py-2 bg-white rounded-full`}
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
            whileHover={{
              scale: 1.1,
            }}
            animate={expandInput ? "exit" : "initial"}
            variants={iconVariants}
            onClick={() => setExpandInput((prev) => !prev)}
            className="flex cursor-pointer items-center justify-center rounded-full py-2 px-[20px]"
          >
            <SearchIcon />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Nav;
