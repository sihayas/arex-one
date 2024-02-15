import React, { useEffect } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useUserDataQuery } from "@/lib/helper/user";
import Essentials from "@/components/interface/user/render/Essentials";
import Entries from "@/components/interface/user/render/Entries";
import Avatar from "@/components/global/Avatar";
import { SettingsIcon } from "@/components/icons";

export type Section = "essentials" | "sounds" | "entries" | "wisps";

const User = () => {
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
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

  if (!user || isLoading || isError) return <div>log in</div>;

  return (
    <>
      <div className={`flex flex-col w-full p-8`}>
        <div className="flex items-center gap-4">
          <Avatar
            className="rounded-max border-silver min-h-[64px] min-w-[64px] border"
            imageSrc={userData.image}
            altText={`avatar`}
            width={64}
            height={64}
            user={userData}
          />
          <p className={`text-gray2 text-xl font-semibold  tracking-tighter`}>
            {userData.username}
          </p>
        </div>
        <div className="flex ml-20 gap-[29px] ">
          <div className={`flex flex-col`}>
            <p className="text-gray2 text-base font-medium tracking-tighter">
              Sounds
            </p>
            <p className="text-gray2 text-base font-bold tracking-tighter">
              42
            </p>
          </div>

          <div className={`flex flex-col`}>
            <p className="text-gray2 text-base font-medium tracking-tighter">
              Entries
            </p>
            <p className="text-gray2 text-base font-bold tracking-tighter">
              {userData._count.artifact}
            </p>
          </div>

          <div className={`flex flex-col`}>
            <p className="text-gray2 text-base font-medium tracking-tighter">
              Links
            </p>
            <p className="text-gray2 text-base font-bold tracking-tighter">
              {userData._count.followedBy}
            </p>
          </div>
        </div>
        {/* <Essentials essentials={userData.essentials} /> */}

        <div className="flex w-full items-center justify-between">
          <div className="shadow-shadowKitLow flex items-center justify-center rounded-full bg-white p-2 opacity-0">
            <SettingsIcon />
          </div>
        </div>
      </div>

      <Entries userId={user.id} />
    </>
  );
};

export default User;
