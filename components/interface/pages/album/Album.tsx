import { useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { useSound } from "@/context/Sound";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import Albums from "./sub/Albums";
import { motion, useAnimate, useMotionValueEvent } from "framer-motion";

import TabBar from "./sub/TabBar";
import Songs from "./sub/Songs";

const Album = ({ scale }) => {
  // Hooks
  const { selectedSound } = useSound();
  const { data: session, status } = useSession();

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
    console.log(scale.get());
  });

  // Initializes album and loads full details into selectedSound
  const { isLoading } = useAlbumQuery();

  // Load and error handling
  if (!selectedSound || isLoading) {
    return <div>loading...</div>; // Replace with your preferred loading state
  }

  return (
    <>
      {/* Top Section */}
      <motion.div className="sticky -top-[318px] pt-4 z-20">
        <Image
          ref={scope}
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={512}
          height={512}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          style={{ boxShadow: boxShadow }}
        />
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="font-bold text-sm text-white">
              {selectedSound.sound.attributes.name}
            </div>
            <div className="font-medium text-sm text-white">
              {selectedSound.sound.attributes.artistName}
            </div>
          </div>

          <div
            className="w-12 h-12 rounded-full border border-white flex items-center justify-center"
            style={{ borderWidth: "1px" }}
          >
            <span className="font-bold text-xl text-white"></span>
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
      <div className="w-full h-full pb-96">
        {!activeTabId ? (
          <Albums albumId={selectedSound.sound.id} user={session!.user} />
        ) : (
          <Songs songId={activeTabId} user={session!.user} />
        )}
      </div>
    </>
  );
};

export default Album;
