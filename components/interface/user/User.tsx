import React, { useEffect } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
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
      <Essentials essentials={userData.essentials} />

      <div
        className={`sticky top-8 z-10 mt-8 flex w-full flex-col items-center gap-2 px-16`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="text-gray2 text-base font-medium tracking-tighter">
              Sounds
            </p>
            <p className="text-gray2 text-base font-bold tracking-tighter">
              42
            </p>

            <p className="text-gray2 pt-[18px] text-base font-medium tracking-tighter">
              Entries
            </p>
            <p className="text-gray2 text-base font-bold tracking-tighter">
              {userData._count.artifact}
            </p>

            <p className="text-gray2 pt-[18px] text-base font-medium tracking-tighter">
              Links
            </p>
            <p className="text-gray2 text-base font-bold tracking-tighter">
              {userData._count.followedBy}
            </p>
          </div>

          <div className="center-x center-y absolute">
            <Avatar
              className="rounded-max border-silver min-h-[80px] min-w-[80px] border"
              imageSrc={userData.image}
              altText={`avatar`}
              width={80}
              height={80}
              user={userData}
            />
            <p
              className={`text-gray2 center-x absolute bottom-[-20px] text-xl font-semibold leading-[15px] tracking-tighter`}
            >
              {userData.username}
            </p>
          </div>

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
