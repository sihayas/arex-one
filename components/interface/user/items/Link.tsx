import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { followUser, unfollowUser } from "@/lib/helper/user";
import { useInterfaceContext } from "@/context/Interface";

type LinkButtonProps = {
  followingAtoB: boolean;
  followingBtoA: boolean;
  setFollowingAtoB: (value: boolean) => void;
  pageUserId: string;
};

export default function Link({
  followingAtoB,
  followingBtoA,
  setFollowingAtoB,
  pageUserId,
}: LinkButtonProps) {
  const { user } = useInterfaceContext();
  const [hovering, setHovering] = React.useState(false);

  const isUnlinked = !followingAtoB && !followingBtoA;
  const isLinked =
    (followingAtoB && !followingBtoA) || (!followingAtoB && followingBtoA);
  const isInterlinked = followingAtoB && followingBtoA;

  if (!user) return null;

  const handleLink = async () => {
    if (isUnlinked) {
      await followUser(user.id, pageUserId);
      setFollowingAtoB(true);
      console.log("followed");
    } else {
      await unfollowUser(user.id, pageUserId);
      setFollowingAtoB(false);
      console.log("unfollowed");
    }
  };

  return (
    <motion.button
      onClick={handleLink}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      animate={{
        backgroundColor: isUnlinked
          ? "#CCCCCC"
          : isLinked
          ? "#FFE500"
          : "#24FF00",
      }}
      className={`py-0.5 px-2 rounded-full`}
    >
      <AnimatePresence>
        {/* Status Text */}
        {!hovering && (
          <motion.div className="text-base font-semibold text-white uppercase">
            {isLinked && "linked"}
            {isUnlinked && "unlinked"}
            {isInterlinked && "interlinked"}
          </motion.div>
        )}

        {/* Action Text*/}
        {hovering && (
          <motion.div className="text-base font-semibold text-white uppercase">
            {isLinked && "unlink"}
            {isUnlinked && "link"}
            {isInterlinked && "unlink"}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
