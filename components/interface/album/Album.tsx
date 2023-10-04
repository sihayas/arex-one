import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useSound } from "@/context/Sound";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import Albums from "./sub/Albums";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import Songs from "./sub/Songs";
import { StarOneIcon } from "@/components/icons";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Album = () => {
  // Hooks
  const { selectedSound } = useSound();
  const { data: session } = useSession();

  const { scrollContainerRef } = useInterfaceContext();

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const handleActiveTabChange = (newActiveTabId: string | null) => {
    setActiveTabId(newActiveTabId);
  };

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  let x = useTransform(scrollY, [0, 48], [0, 480]);
  let springX = useSpring(x, { damping: 80, stiffness: 800 });

  const borderRadius = useTransform(scrollY, [0, 120], ["20px", "8px"]);

  // Rating footer opacity
  const opacity = useTransform(scrollY, [0, 160], [0, 1]);
  const blurOpacity = useTransform(scrollY, [0, 160], [0, 1]);

  // Initializes album and loads full details into selectedSound context
  const { isLoading } = useAlbumQuery();

  const boxShadow = useMemo(() => {
    if (selectedSound?.colors[0]) {
      return `0px 3px 6px 0px ${selectedSound.colors[0]}, 0.15),
        0px 11px 11px 0px ${selectedSound.colors[0]}, 0.13),
        0px 26px 16px 0px ${selectedSound.colors[0]}, 0.08),
        0px 46px 18px 0px ${selectedSound.colors[0]}, 0.02),
        0px 72px 20px 0px ${selectedSound.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedSound?.colors]);

  return (
    <div className="w-full h-full">
      {!selectedSound || isLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <motion.div
            style={{
              x: springX,
              boxShadow: boxShadow,
              borderRadius: borderRadius,
            }}
            className="pointer-events-none overflow-hidden"
          >
            <Image
              className="outline outline-1 outline-silver"
              src={selectedSound.artworkUrl || "/public/images/default.png"}
              alt={`${selectedSound.sound.attributes.name} artwork`}
              width={480}
              height={480}
              quality={100}
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          </motion.div>
          {/* Section Two / Entries */}
          <div className="h-full w-full pb-[100vh]">
            {!activeTabId ? (
              <Albums albumId={selectedSound.sound.id} user={session!.user} />
            ) : (
              <Songs songId={activeTabId} user={session!.user} />
            )}
            <motion.div
              style={{ opacity: blurOpacity }}
              className="gradient-blur"
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </motion.div>
          </div>
          {/* Rating */}
          <motion.div
            style={{ opacity }}
            className="fixed flex bottom-0 left-1/2 transform -translate-x-1/2 w-full p-8 z-10"
          >
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray2 leading-none w-[128px]">
                STARS
              </div>

              <div className="flex items-end mt-2">
                <div className="mb-2">
                  <StarOneIcon color={"black"} />
                </div>
                <div className="tracking-tighter text-[22px] leading-[75%] w-12">
                  4.5
                </div>
                <div className="tracking-tighter text-xs leading-[75%] w-12 text-black">
                  / 24 444
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Album;
