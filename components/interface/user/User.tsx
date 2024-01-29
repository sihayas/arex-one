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
  const [activeSection, setActiveSection] =
    React.useState<Section>("essentials");

  const pageUser = activePage.user;
  const { data, isLoading, isError, followState, handleFollowUnfollow } =
    useUserDataQuery(user?.id, pageUser?.id);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 1) {
      setActiveSection("sounds");
      pages[pages.length - 1].isOpen = true;
    } else {
      setActiveSection("essentials");
    }
  });

  const { userData } = data || {};

  useEffect(() => {
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);

  if (!user || isLoading || isError) return <div>log in</div>;

  return (
    <>
      <div
        className={`absolute bg-[#F4F4F4]/50 w-full h-full top-0 left-0 backdrop-blur-2xl overflow-visible -z-10 pointer-events-none`}
      />

      <div className={`flex items-start justify-between w-full`}>
        <div className={`flex items-center gap-4 z-10 p-8`}>
          <Avatar
            className="rounded-max border border-silver"
            imageSrc={userData.image}
            altText={`avatar`}
            width={64}
            height={64}
            user={userData}
          />
          <p className={`text-xl leading-[15px]`}>{userData.username}</p>
        </div>

        <Essentials essentials={userData.essentials} />
      </div>

      <Entries userId={user.id} />
    </>
  );
};

export default User;
