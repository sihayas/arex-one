import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const activePage: Page = pages[pages.length - 1];

  const contentVariants = {
    collapsed: {
      width: 124,
      boxShadow:
        "0px 0px 0px 0px rgba(0,0,0,0.0), 0px 0px 0px 0px rgba(0,0,0,0.0)",
      outline: "1px solid rgba(0,0,0,0.05)",
      height: 44,
      x: 0,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
      },
    },
    expanded: {
      width: activeAction !== "notifications" ? 384 : 320,
      boxShadow:
        "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
      outline: "1px solid rgba(0,0,0,0.0)",
      height: !expandInput
        ? 44 // base
        : activeAction === "none" && inputValue
          ? 432 // search
          : activeAction === "form"
            ? "auto" // form
            : activeAction === "notifications"
              ? 610 // notifications
              : 44,
      x: activeAction === "notifications" ? -174 : 0,
      transition: {
        type: "spring",
        damping: 32,
        stiffness: 280,
      },
    },
  };

  const barVariants = {
    collapsed: {
      x: 8,
      y: -6,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
      },
    },
    expanded: {
      x: activeAction === "notifications" ? 108 : 8,
      y: -6,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
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
    if (!replyTarget || !inputValue || !user) return;

    toast.promise(
      addReply(replyTarget, inputValue, user.id).then(() => {
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
    setActiveAction(
      selectedFormSound ? "form" : replyTarget ? "reply" : "none",
    );
  }, [selectedFormSound, replyTarget, setActiveAction]);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the button
      if (
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        if (activeAction === "notifications") {
          setExpandInput(false);
          setActiveAction("none");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <motion.div
      animate={expandInput ? "expanded" : "collapsed"}
      className={`center-x absolute -bottom-[52px] z-50 flex flex-col ${!expandInput && "mix-blend-darken"}`}
    >
      {/* Top / Content */}
      <motion.div
        className={`outline-silver relative -z-10 flex w-full flex-col items-end justify-end rounded-3xl bg-[#F4F4F4] outline outline-1`}
        variants={contentVariants}
        animate={expandInput ? "expanded" : "collapsed"}
      >
        {activeAction === "form" && expandInput && <Form />}
        {activeAction === "none" && inputValue && expandInput && (
          <Results searchData={data} />
        )}
        {activeAction === "notifications" && expandInput && <Notifications />}

        <div
          className={`flex w-full items-center justify-center bg-transparent p-[11px] pl-16`}
        >
          <TextareaAutosize
            id="entryText"
            className={`w-full resize-none bg-transparent text-base text-black outline-none ${!expandInput && "pointer-events-none "}`}
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
      </motion.div>

      {/* Bottom / Bar */}
      <motion.div
        variants={barVariants}
        animate={expandInput ? "expanded" : "collapsed"}
        className={`absolute bottom-0 left-0 flex w-fit items-center gap-2 bg-transparent`}
      >
        <motion.button
          whileHover={{
            scale: 1.1,
          }}
          ref={notificationButtonRef}
          onClick={handleNotificationsClick}
          className={`flex items-center justify-center rounded-full bg-[#E5E5E5] px-3 py-2`}
        >
          <NotificationIcon />
        </motion.button>
        {/* Target Container */}
        <motion.button
          className={`relative flex items-center justify-center`}
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

        <motion.div
          whileHover={{ scale: 1.1 }}
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
      </motion.div>
    </motion.div>
  );
};

export default Nav;

{
  /* Text Input */
}
// <div className={`relative flex w-fit items-center`}>
//   {/* Input */}

//   {/* Discover & */}

// </div>
