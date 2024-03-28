import React, { useEffect, useState } from "react";
import { useInterfaceContext } from "@/context/Interface";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useUserDataQuery } from "@/lib/helper/interface/user";
import Essentials from "@/components/interface/user/render/Essentials";
import Entries from "@/components/interface/user/render/Entries";
import Avatar from "@/components/global/Avatar";
import Link from "@/components/interface/user/items/Link";

const User = () => {
  const { user, activePage, pages, scrollContainerRef } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });
  const opacity = useSpring(useTransform(scrollY, [0, 1], [1, 0]), {
    stiffness: 100,
    damping: 20,
  });

  const [followingAtoB, setFollowingAtoB] = useState(false);
  const [followingBtoA, setFollowingBtoA] = useState(false);

  const pageUser = activePage.user;

  const circleVariants = {
    notFollowing: { pathLength: 0, stroke: "#E6E6E6" },
    following: {
      pathLength: 1,
      stroke: followingAtoB && followingBtoA ? "#24FF00" : "#FFFFFF",
    },
  };

  useEffect(() => {
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

  const { data, isLoading, isError } = useUserDataQuery(user?.id, pageUser?.id);

  useEffect(() => {
    if (data) {
      setFollowingAtoB(data.isFollowingAtoB);
      setFollowingBtoA(data.isFollowingBtoA);
    }
  }, [data]);

  if (!data || !user || !pageUser) return;

  const isSelf = user.id === pageUser.id;

  return (
    <>
      <motion.div style={{ opacity }} className="flex w-full gap-4 p-8">
        <div className={`flex flex-col`}>
          {/* Avatar & Interlink */}
          <div className={`flex items-center `}>
            <div className={`relative flex-shrink-0`}>
              <Avatar
                className="rounded-max border border-silver aspect-square"
                imageSrc={data.image}
                altText={`avatar`}
                width={isSelf ? 104 : 72}
                height={isSelf ? 104 : 72}
                user={data}
              />
              {!isSelf && (
                <>
                  <motion.svg
                    className={`absolute center-x center-y z-10`}
                    width={104}
                    height={104}
                    viewBox="0 0 104 104"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter
                        id="circleShadow"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                      >
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                        <feOffset dx="1" dy="1" result="offsetblur" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.1" />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <motion.circle
                      cx={52}
                      cy={52}
                      r={50.5}
                      strokeWidth={3}
                      strokeLinecap={"round"}
                      variants={circleVariants}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 40,
                      }}
                      initial="notFollowing"
                      animate={followingBtoA ? "following" : "notFollowing"}
                      filter="url(#circleShadow)"
                    />
                  </motion.svg>
                  <motion.svg
                    className={`absolute center-x center-y`}
                    width={104}
                    height={104}
                    viewBox="0 0 104 104"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx={52}
                      cy={52}
                      r={50.5}
                      stroke="#E6E6E6"
                      strokeWidth={3}
                    />
                  </motion.svg>
                </>
              )}
            </div>

            <p
              className={`text-gray2 text-3xl font-bold ${
                isSelf ? "pl-4" : "pl-8"
              }`}
            >
              {data.username}
            </p>
          </div>
          {/* SignedIn User */}
          {!isSelf && (
            <div
              className={`pl-[72px] pb-[22px] min-h-[54px] flex items-center gap-8 relative w-full`}
            >
              <>
                <div className={`relative flex-shrink-0`}>
                  <Avatar
                    className="rounded-max border border-silver"
                    imageSrc={user.image}
                    altText={`avatar`}
                    width={32}
                    height={32}
                    user={data}
                  />
                  <motion.svg
                    className={`absolute center-x center-y z-10 overflow-visible rotate-45`}
                    width={64}
                    height={64}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx={32}
                      cy={32}
                      r={30.5}
                      stroke="white"
                      strokeWidth={3}
                      strokeLinecap={"round"}
                      variants={circleVariants}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 40,
                      }}
                      initial="notFollowing"
                      animate={followingAtoB ? "following" : "notFollowing"}
                      filter="url(#circleShadow)"
                    />
                  </motion.svg>
                  <motion.svg
                    className={`absolute center-x center-y`}
                    width={64}
                    height={64}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx={32}
                      cy={32}
                      r={30.5}
                      stroke="#E6E6E6"
                      strokeWidth={3}
                    />
                  </motion.svg>
                </div>
                <Link
                  followingAtoB={followingAtoB}
                  followingBtoA={followingBtoA}
                  setFollowingAtoB={setFollowingAtoB}
                  pageUserId={pageUser.id}
                />
              </>
            </div>
          )}
          {/* Stats */}
          <div
            className={`grid grid-cols-[repeat(3,_104px)] ${
              isSelf && "pt-[22px]"
            }`}
          >
            <div className={`flex flex-col`}>
              <p className={`font-semibold text-gray3 text-sm`}>SOUND</p>
              <p className={`text-gray2 text-xl`}>
                {data._count.uniqueSounds || 0}
              </p>
            </div>
            <div className={`flex flex-col`}>
              <p className={`font-semibold text-gray3 text-sm`}>ENTRY</p>
              <p className={`text-gray2 text-xl`}>
                {data._count.artifact || 0}
              </p>
            </div>
          </div>
        </div>

        <div className={`ml-auto flex flex-col items-end -space-y-6`}>
          <Essentials essentials={data.essentials} />
        </div>
      </motion.div>

      <div className={`-mt-[242px] flex flex-col -space-y-5 w-[420px]`}>
        <Entries userId={pageUser.id} />
      </div>
    </>
  );
};

export default User;
