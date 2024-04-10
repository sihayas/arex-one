import React, { useEffect, useState } from "react";
import { useEntriesQuery } from "@/lib/helper/interface/sound";
import { useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName } from "@/context/Interface";
import { SortOrder } from "@/components/interface/sound/Sound";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { useEntry } from "@/hooks/usePage";
import Avatar from "@/components/global/Avatar";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { AlbumData, SongData } from "@/types/appleTypes";
import { getStarComponent } from "@/components/global/Star";
import { motion } from "framer-motion";
import { cardBackMask } from "@/components/index/items/Entry";

interface RenderEntriesProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

const Entries: React.FC<RenderEntriesProps> = ({
  soundId,
  sortOrder = "newest",
  range = null,
}) => {
  const { user, activePage } = useInterfaceContext();
  const { data, fetchNextPage, hasNextPage } = useEntriesQuery(
    soundId,
    user?.id,
    sortOrder,
    range,
  );
  const { handleSelectEntry } = useEntry();
  const [sound, setSound] = useState<AlbumData | SongData | null>(null);

  // Capture the state of the virtuoso list
  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.sound?.snapshot?.state,
  );
  const key = activePage.sound?.snapshot?.key;
  const { target } = GetDimensions(activePage.name as PageName);

  const entries = data
    ? data.pages.flatMap((page) => page.data.map((item: any) => item.entry))
    : [];

  const handleEndReached = () => {
    if (hasNextPage) {
      fetchNextPage()
        .then(() => {})
        .catch((error) => {
          console.error("Error fetching next page:", error);
        });
    }
  };

  useEffect(() => {
    if (activePage.sound) {
      setSound(activePage.sound.data);
    }
  }, [activePage]);

  if (!entries || !sound) return null;

  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    88 * 2.5,
    88 * 2.5,
  );

  return (
    <Virtuoso
      key={key}
      ref={ref}
      style={{ height: target.height }}
      data={entries}
      overscan={200}
      restoreStateFrom={state.current}
      computeItemKey={(key: number) => `item-${key.toString()}`}
      endReached={handleEndReached}
      itemContent={(index, entry) => (
        <motion.div
          onClick={() => {
            ref.current?.getState((snapshot) => {
              activePage.sound!.snapshot = {
                state: snapshot,
                key: index,
              };
            });
            handleSelectEntry({
              ...entry,
              sound: {
                data: activePage.sound?.data,
              },
            });
          }}
          className={`cloud-shadow ${index % 2 !== 0 ? "mr-[128px]" : "mr-8"} ${
            index === 0 && "pt-8"
          }`}
        >
          <Tilt
            perspective={1000}
            tiltMaxAngleX={6}
            tiltMaxAngleY={6}
            tiltReverse={true}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareBorderRadius={"32px"}
            scale={1.05}
            transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
            className={`transform-style-3d relative ml-auto h-[432px] w-[304px]`}
          >
            {/* Back */}
            <div
              style={{ ...cardBackMask }}
              className="flex h-full w-full flex-col bg-white p-6 pb-0 "
            >
              <div className={`flex flex-shrink-0 justify-between`}>
                {getStarComponent(entry.content?.rating)}

                <Image
                  className={`shadow-shadowKitHigh rounded-xl`}
                  src={url}
                  alt={`artwork`}
                  quality={100}
                  width={88}
                  height={88}
                  draggable={false}
                />
              </div>

              <div className={`flex items-center gap-2 pt-2`}>
                <Avatar
                  className={`border-silver border`}
                  imageSrc={entry.author.image}
                  altText={`${entry.author.username}'s avatar`}
                  width={32}
                  height={32}
                  user={entry.author}
                />
                <div
                  className={`text-base font-semibold leading-[10px] text-black`}
                >
                  {entry.author.username}
                </div>
              </div>

              <p className={`line-clamp-[11] pt-[9px] text-base`}>
                {entry.content?.text}
              </p>
            </div>
          </Tilt>
        </motion.div>
      )}
      components={{
        Footer: () => <div className={`p-4`} />,
        // EmptyPlaceholder: () => <div>No artifacts available</div>,
      }}
    />
  );
};

export default Entries;

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//     artifact.heartedByUser,
//     artifact._count.hearts,
//     "/api/artifact/entry/post/",
//     "recordId",
//     artifact.id,
//     artifact.author.id,
//     user?.id,
// );
