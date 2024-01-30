import React, { useEffect } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useUserDataQuery } from "@/lib/apiHelper/user";
import Essentials from "@/components/interface/user/render/Essentials";
import Entries from "@/components/interface/user/render/Entries";
import Avatar from "@/components/global/Avatar";

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
      <div
        className={`pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-visible bg-[#F4F4F4]/50 backdrop-blur-2xl`}
      />

      <Essentials essentials={userData.essentials} />

      <div
        className={`sticky top-8 z-10 mt-[88px] flex flex-col items-center gap-2`}
      >
        <Avatar
          className="rounded-max border-silver border"
          imageSrc={userData.image}
          altText={`avatar`}
          width={64}
          height={64}
          user={userData}
        />
        {!activePage.isOpen && (
          <p
            className={`text-xl font-semibold leading-[15px] tracking-tighter`}
          >
            {userData.username}
          </p>
        )}
      </div>

      <Entries userId={user.id} />
    </>
  );
};

export default User;
