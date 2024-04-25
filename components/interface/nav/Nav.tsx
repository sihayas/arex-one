import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import TextareaAutosize from "react-textarea-autosize";

import Results from "./render/Results";
import Form from "./render/Form";
import {
  TargetAddIcon,
  TargetGoIcon,
  TargetEntryIcon,
  TargetCommandIcon,
  TargetExpandIcon,
} from "@/components/icons";
import { useNavContext } from "@/context/Nav";
import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/Interface";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Keybinds } from "@/components/global/Keybinds";
import Notifications from "@/components/interface/nav/render/Notifications";
import Image from "next/image";
import { createReply } from "@/lib/helper/interface/nav";
import { Search } from "@/lib/helper/interface/nav";
import { Author } from "@/types/global";

const Nav = () => {
  const { replyTarget } = useNavContext();
  const { user, activePage, notifs } = useInterfaceContext();
  const {
    inputValue,
    setInputValue,
    expandInput,
    setExpandInput,
    inputRef,
    activeAction,
    setActiveAction,
  } = useNavContext();
  const { formSound } = useNavContext();
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const firstKey = Object.keys(notifs)[0];

  const isFirstNotifRead =
    //   @ts-ignore
    firstKey && notifs[firstKey].notifications.length > 0
      ? //   @ts-ignore
        notifs[firstKey].notifications[0].isRead
      : null;

  const isNotifications = activeAction === "notifications";
  const isEssential = activeAction === "essential";
  const isForm = activeAction === "form";
  const isReply = activeAction === "reply";

  const pageHasData = activePage.data;

  // Debounce the search query
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = debounce(setSearchQuery, 150);
  const handleInputTextChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearchQuery(value);
  };

  // Render search results
  const { data } = Search(searchQuery);

  const handleReplySubmit = () => {
    // toast.promise(
    //   createReply(replyTarget, inputValue, user!.id).then(() => {
    //     setInputValue("");
    //   }),
    //   {
    //     loading: "Sending reply...",
    //     success: "Reply sent successfully!",
    //     error: "Error submitting reply",
    //   },
    // );
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
    setActiveAction(formSound ? "form" : replyTarget ? "reply" : "none");
  }, [formSound, replyTarget, setActiveAction]);

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
        variants={{
          collapsed: {
            opacity: 0,
            scale: 0,
            height: 0,
            boxShadow:
              "0px 0px 0px 0px rgba(0, 0, 0, 0.0), 0px 0px 0px 0px rgba(0, 0, 0,0.0)",
          },
          expanded: {
            opacity: 1,
            scale: 1,
            height: 472,
            boxShadow:
              "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
          },
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 250,
        }}
        animate={
          expandInput && !isNotifications && !isReply ? "expanded" : "collapsed"
        }
        className={`absolute -bottom-10 -left-10 z-40 flex h-[472px] w-[368px] origin-bottom-left flex-col rounded-[20px] bg-[#FFFFFFF5]`}
      >
        <AnimatePresence>
          {isForm && expandInput && <Form />}
          {!isForm && !isReply && expandInput && <Results searchData={data} />}
        </AnimatePresence>
      </motion.div>

      {/* Text Input */}
      <motion.div
        className={`absolute -bottom-8 left-1 z-50 flex w-full items-center justify-center bg-transparent mix-blend-darken h-8`}
        variants={{
          collapsed: {
            width: 32,
            borderRadius: 24,
            transition: {
              type: "spring",
              damping: 24,
              stiffness: 180,
            },
          },
          expanded: {
            width: isNotifications ? 56 : 368,
            transition: {
              type: "spring",
              damping: 40,
              stiffness: 400,
            },
          },
        }}
        animate={expandInput ? "expanded" : "collapsed"}
      >
        {isReply && expandInput && replyTarget && (
          // Reply Target Avatar
          <div className={`absolute right-2 top-2`}>
            <Image
              src={replyTarget?.entry.author.image}
              alt={`${replyTarget?.entry.author.username}'s avatar`}
              width={24}
              height={24}
              className={`rounded-full`}
            />
          </div>
        )}
        {!expandInput && (
          <motion.div
            className={`flex-shrink-0 absolute left-1 pointer-events-none w-4 h-4 bg-gray3 rounded`}
          />
        )}
        <TextareaAutosize
          id="entryText"
          className={`w-full resize-none bg-transparent text-base text-black outline-none `}
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

      {/* Icon / Indicator / Avatar */}
      <div
        className={`absolute -bottom-8 -left-8 z-50 flex flex-col bg-transparent mix-blend-darken`}
      >
        {/* Notification Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          animate={expandInput ? { scale: 0, opacity: 0 } : { scale: 1 }}
          ref={notificationButtonRef}
          onClick={handleNotificationsClick}
          className={`p-2`}
        >
          {/*<motion.div*/}
          {/*  animate={{*/}
          {/*    backgroundColor: isFirstNotifRead ? "#999" : "#24FF00",*/}
          {/*    scale: isFirstNotifRead ? 1 : [1, 0.8, 1],*/}
          {/*  }}*/}
          {/*  transition={{*/}
          {/*    scale: isFirstNotifRead*/}
          {/*      ? {}*/}
          {/*      : {*/}
          {/*          // duration: 2,*/}
          {/*          // repeat: Infinity,*/}
          {/*          // repeatType: "loop",*/}
          {/*          // ease: "easeInOut",*/}
          {/*        },*/}
          {/*  }}*/}
          {/*  className={`rounded-full w-4 h-4`}*/}
          {/*/>*/}
        </motion.button>
        {/* Dynamic Icons */}
        <button className={`relative flex h-8 w-8 items-center justify-center`}>
          {/* Avatar */}
          <motion.div
            className={`shadow-notification absolute rounded-full`}
            animate={expandInput ? { scale: 0.5 } : { opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 24, stiffness: 400 }}
          >
            <Avatar
              imageSrc={user!.image}
              altText={`${user!.username}'s avatar`}
              width={32}
              height={32}
              user={user as Author}
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
                  <TargetExpandIcon />
                </motion.div>
              ))}

            {/* User is on a Sound page */}
            {expandInput &&
              activeAction === "none" &&
              activePage.type === "sound" &&
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
              activePage.type === "entry" &&
              !inputValue && (
                <motion.div
                  className={`center-x center-y absolute rounded-full bg-[#CCC] p-1.5`}
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <TargetEntryIcon />
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
                <p className={`text-xs font-semibold text-white leading-[8px]`}>
                  99
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
};

export default Nav;

// {/* Search Button */}
// {/*<motion.button*/}
// {/*  whileHover={{*/}
// {/*    scale: 1.1,*/}
// {/*  }}*/}
// {/*  animate={expandInput ? "exit" : "initial"}*/}
// {/*  variants={iconVariants}*/}
// {/*  onClick={() => setExpandInput((prev) => !prev)}*/}
// {/*  className="flex cursor-pointer items-center justify-center rounded-full px-[12px] py-2 bg-[#F4F4F4]"*/}
// {/*>*/}
// {/*  <SearchIcon />*/}
// {/*</motion.button>*/}
