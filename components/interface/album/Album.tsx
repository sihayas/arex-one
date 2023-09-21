import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useSound } from "@/context/Sound";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import Albums from "./sub/Albums";
import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";

import TabBar from "./sub/TabBar";
import Songs from "./sub/Songs";

const Album = ({ scale }: any) => {
  // Hooks
  const { selectedSound } = useSound();
  const { data: session } = useSession();

  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const artworkUrl = selectedSound?.artworkUrl;

  const handleActiveTabChange = (newActiveTabId: string | null) => {
    setActiveTabId(newActiveTabId);
  };

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

  const [scope, animate] = useAnimate();

  useMotionValueEvent(scale, "change", () => {
    animate(scope.current, {
      scale: scale.get(),
      transition: {
        type: "spring",
      },
    });
  });

  const borderRadius = useTransform(scale, [0, 1], [20, 8]);

  // Initializes album and loads full details into selectedSound
  const { isLoading } = useAlbumQuery();

  // Load and error handling
  if (!selectedSound || isLoading) {
    return <div>loading...</div>; // Replace with your preferred loading state
  }

  return (
    <>
      {/* Top Section */}
      <motion.div className="sticky z-20 pt-4 -top-[318px]">
        <motion.div style={{ borderRadius, overflow: "hidden" }}>
          <Image
            ref={scope}
            src={artworkUrl || "/public/images/default.png"}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={512}
            height={512}
            quality={100}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </motion.div>
        <div className="absolute bottom-12 left-1/2 flex w-full -translate-x-1/2 transform flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-white">
              {selectedSound.sound.attributes.name}
            </div>
            <div className="text-sm font-medium text-white">
              {selectedSound.sound.attributes.artistName}
            </div>
          </div>

          <div
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white"
            style={{ borderWidth: "1px" }}
          >
            <span className="text-xl font-bold text-white"></span>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center">
            {"relationships" in selectedSound.sound && (
              <TabBar
                songs={selectedSound.sound.relationships.tracks.data}
                onActiveTabChange={handleActiveTabChange}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Section Two / Entries  */}
      <div className="h-full w-full pb-96">
        {!activeTabId ? (
          <Albums albumId={selectedSound.sound.id} user={session!.user} />
        ) : (
          <Songs songId={activeTabId} user={session!.user} />
        )}
      </div>

      <div className="gradient-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Album;
