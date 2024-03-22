import React, { useEffect, useState } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useUserDataQuery } from "@/lib/helper/user";
import Essentials from "@/components/interface/user/render/Essentials";
import Entries from "@/components/interface/user/render/Entries";
import Avatar from "@/components/global/Avatar";

const User = () => {
  const [isFollowingAtoB, setIsFollowingAtoB] = useState(false);
  const [isFollowingBtoA, setIsFollowingBtoA] = useState(false);

  const { user, activePage, pages, scrollContainerRef } = useInterfaceContext();

  const pageUser = activePage.user;
  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });

  const { userData } = data || {};

  useEffect(() => {
    if (userData) {
      setIsFollowingAtoB(userData.isFollowingAtoB);
      setIsFollowingBtoA(userData.isFollowingBtoA);
    }
  }, [userData]);

  useEffect(() => {
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

  if (!userData || !user) return;

  return (
    <>
      <div className="flex h-full w-full gap-4 p-8">
        <div className={`flex flex-col`}>
          {/* Page Username & Avatar*/}
          <div className={`flex items-center gap-8`}>
            <div className={`relative flex-shrink-0`}>
              <Avatar
                className="rounded-max"
                imageSrc={userData.image}
                altText={`avatar`}
                width={72}
                height={72}
                user={userData}
              />
              <div
                className={`absolute center-x center-y w-[98px] h-[98px] outline outline-3 outline-white rounded-max shadow-shadowKitHigh`}
              />
            </div>

            <p className={`text-gray2 text-3xl font-bold`}>
              {userData.username}
            </p>
          </div>
          {/*  Signed User */}
          <div className={`pl-[72px] flex items-center gap-8 relative`}>
            <div className={`relative`}>
              <div
                className={`absolute center-x center-y w-[60px] h-[60px] outline outline-3 outline-white rounded-max shadow-shadowKitHigh`}
              />
              <Avatar
                className="rounded-max flex-shrink-0"
                imageSrc={user.image}
                altText={`avatar`}
                width={32}
                height={32}
                user={userData}
              />
            </div>
          </div>
        </div>

        <Essentials essentials={userData.essentials} />
      </div>

      <div className={`-mt-[242px] flex flex-col -space-y-4 p-12 w-full`}>
        <Entries userId={user!.id} />
      </div>
    </>
  );
};

export default User;

// {/*<div className={`flex gap-[29px]`}>*/}
// {/*  <div className={`flex flex-col`}>*/}
// {/*    <p className="text-gray2 text-base lowercase tracking-tighter">*/}
// {/*      Sounds*/}
// {/*    </p>*/}
// {/*    <p className="text-gray2 text-base font-bold tracking-tighter">*/}
// {/*      42*/}
// {/*    </p>*/}
// {/*  </div>*/}
//
// {/*  <div className={`flex flex-col`}>*/}
// {/*    <p className="text-gray2 text-base lowercase tracking-tighter">*/}
// {/*      Entries*/}
// {/*    </p>*/}
// {/*    <p className="text-gray2 text-base font-bold tracking-tighter">*/}
// {/*      {userData._count.artifact}*/}
// {/*    </p>*/}
// {/*  </div>*/}
// {/*</div>*/}
