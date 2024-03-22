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
  const { replyTarget } = useNavContext();
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

  const isNotifications = activeAction === "notifications";
  const isForm = activeAction === "form";
  const isReply = activeAction === "reply";

  const pageHasData = activePage.sound || activePage.artifact;

  const inputVariants = {
    collapsed: {
      x: 8,
      y: 36,
      width: 56,
      height: 32,
      borderRadius: 24,
      outline: "rgba(0,0,0,0.0)",
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
      width: isNotifications ? 56 : 368,
      height: isForm ? "auto" : 40,
      borderRadius: isReply ? 20 : 24,
      outline: "rgba(0,0,0,0.05)",
      backgroundColor: isReply ? "#FFFFFF" : "transparent",
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 400,
      },
    },
  };

  const contentVariants = {
    collapsed: {
      opacity: 0,
      scale: 0,
      boxShadow:
        "0px 0px 0px 0px rgba(0, 0, 0, 0.0), 0px 0px 0px 0px rgba(0, 0, 0,0.0)",
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
      },
    },
    expanded: {
      opacity: 1,
      scale: 1,
      height: 472,
      boxShadow:
        "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
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
        !notificationButtonRef.current.contains(target)
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

  return (
    <>
      <AnimatePresence>
        {isNotifications && expandInput && <Notifications />}
      </AnimatePresence>

      <motion.div
        variants={contentVariants}
        animate={
          expandInput && !isNotifications && !isReply ? "expanded" : "collapsed"
        }
        className={`absolute bottom-0 left-0 z-40 flex h-[472px] w-[368px] origin-bottom-left -translate-x-10 translate-y-10 flex-col rounded-[20px] bg-[#F4F4F4A9] ${
          !expandInput && "mix-blend-darken"
        }`}
      >
        <AnimatePresence>
          {isForm && expandInput && <Form />}
          {!isForm && !isReply && expandInput && <Results searchData={data} />}
        </AnimatePresence>
      </motion.div>

      {/* Text Input */}
      <motion.div
        className={`absolute bottom-0 left-0 z-50 flex w-full items-center justify-center bg-transparent p-[9px] mix-blend-darken ${
          isReply ? "pl-3 pr-[44px]" : "pl-[40px]"
        }`}
        variants={inputVariants}
        animate={expandInput ? "expanded" : "collapsed"}
      >
        {isReply && expandInput && replyTarget && (
          <>
            <div className={`absolute right-2 top-2`}>
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
      </motion.div>

      {/* Iconography */}
      <motion.div
        variants={barVariants}
        animate={expandInput ? "expanded" : "collapsed"}
        className={`absolute bottom-0 left-0 z-50 flex flex-col gap-2 bg-transparent mix-blend-darken`}
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
          <div className={`rounded-full bg-[#F4F4F4] px-[11px] py-3`}>
            <NotificationIcon />
          </div>
        </motion.button>

        <div className={`flex items-center gap-2`}>
          {/* Target Container */}
          <button
            className={`relative flex h-10 w-10 items-center justify-center`}
          >
            {/* Avatar */}
            <motion.div
              className={`shadow-notification absolute rounded-full`}
              animate={expandInput ? { scale: 0.5 } : { opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 24, stiffness: 400 }}
            >
              <Avatar
                imageSrc={user!.image}
                altText={`${user!.username}'s avatar`}
                width={40}
                height={40}
                user={user!}
              />
            </motion.div>

            <AnimatePresence>
              {/* Search Results */}
              {expandInput && activeAction === "none" && !pageHasData && (
                <motion.div
                  className={`center-x center-y absolute rounded-full bg-[#CCC] p-1.5`}
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
                    className={`center-x center-y absolute rounded-full bg-[#CCC] p-1.5`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <TargetCommandIcon />
                  </motion.div>
                ) : (
                  <motion.div
                    className={`center-x center-y absolute rounded-full bg-[#CCC] p-1.5`}
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
                    className={`center-x center-y absolute rounded-full bg-[#CCC] p-1.5`}
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
                    className={`center-x center-y absolute rounded-full bg-[#CCC] p-1.5`}
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
                  className={`center-x center-y absolute rounded-full bg-[#CCC] w-6 h-6 flex items-center justify-center`}
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 2 }}
                >
                  <p
                    className={`text-xs font-semibold text-white leading-[8px]`}
                  >
                    99
                  </p>
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
            className="flex cursor-pointer items-center justify-center rounded-full px-[20px] py-2 bg-[#F4F4F4]"
          >
            <SearchIcon />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Nav;
