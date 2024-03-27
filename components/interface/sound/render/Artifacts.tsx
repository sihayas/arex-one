import React, { useEffect, useState } from "react";
import { useArtifactsQuery } from "@/lib/helper/interface/sound";
import { useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName } from "@/context/Interface";
import { SortOrder } from "@/components/interface/sound/Sound";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { useArtifact } from "@/hooks/usePage";
import Avatar from "@/components/global/Avatar";
import Tilt from "react-parallax-tilt";
import { StarIcon } from "@/components/icons";
import Image from "next/image";
import { AlbumData, SongData } from "@/types/appleTypes";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

const cardBackMask = {
  maskImage: "url('/images/mask_card_back.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_back.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

const Artifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
  range = null,
}) => {
  const { user, activePage } = useInterfaceContext();
  const { data, fetchNextPage, hasNextPage } = useArtifactsQuery(
    soundId,
    user?.id,
    sortOrder,
    range,
  );
  const { handleSelectArtifact } = useArtifact();

  const [sound, setSound] = useState<AlbumData | SongData | null>(null);

  // Capture the state of the virtuoso list
  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.sound?.snapshot?.state,
  );
  const key = activePage.sound?.snapshot?.key;

  const { target } = GetDimensions(activePage.name as PageName);

  const artifacts = data
    ? data.pages.flatMap((page) => page.data.map((item: any) => item.artifact))
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

  if (!artifacts || !sound) return null;

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
      data={artifacts}
      overscan={200}
      restoreStateFrom={state.current}
      computeItemKey={(key: number) => `item-${key.toString()}`}
      endReached={handleEndReached}
      itemContent={(index, artifact) => (
        <div
          onClick={() => {
            ref.current?.getState((snapshot) => {
              activePage.sound!.snapshot = {
                state: snapshot,
                key: index,
              };
            });
            handleSelectArtifact({
              ...artifact,
              sound: {
                data: activePage.sound?.data,
              },
            });
          }}
          className={`cloud-shadow ${index % 2 !== 0 ? "mr-[128px]" : "mr-8"} ${
            index === 0 && "pt-8"
          }`}
        >
          {/* Scene */}
          <Tilt
            perspective={1000}
            tiltMaxAngleX={6}
            tiltMaxAngleY={6}
            tiltReverse={true}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareBorderRadius={"32px"}
            scale={1.02}
            transitionEasing={"cubic-bezier(0.23, 1, 0.32, 1)"}
            className={`transform-style-3d relative ml-auto h-[432px] w-[304px]`}
          >
            {/* Back */}
            <div
              style={{
                ...cardBackMask,
              }}
              className="flex h-full w-full cursor-pointer flex-col bg-white p-6 pb-0 "
            >
              <div className={`flex flex-shrink-0 justify-between`}>
                <StarIcon color={"#000"} />

                <Image
                  className={`shadow-shadowKitHigh rounded-xl`}
                  src={url}
                  alt={` - artwork`}
                  quality={100}
                  width={88}
                  height={88}
                  draggable={false}
                />
              </div>

              <div className={`flex items-center gap-2 pt-2`}>
                <Avatar
                  className={`border-silver border`}
                  imageSrc={artifact.author.image}
                  altText={`${artifact.author.username}'s avatar`}
                  width={32}
                  height={32}
                  user={artifact.author}
                />
                <div
                  className={`text-base font-semibold leading-[10px] text-black`}
                >
                  {artifact.author.username}
                </div>
              </div>

              <p className={`line-clamp-[11] pt-[9px] text-base`}>
                {artifact.content?.text}
              </p>
            </div>
          </Tilt>
        </div>
      )}
      components={{
        Footer: () => <div className={`p-4`} />,
        // EmptyPlaceholder: () => <div>No artifacts available</div>,
      }}
    />
  );
};

export default Artifacts;

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//     artifact.heartedByUser,
//     artifact._count.hearts,
//     "/api/artifact/entry/post/",
//     "recordId",
//     artifact.id,
//     artifact.author.id,
//     user?.id,
// );
