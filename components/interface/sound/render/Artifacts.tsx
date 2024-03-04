import React, { forwardRef } from "react";
import { useArtifactsQuery } from "@/lib/helper/sound";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName } from "@/context/InterfaceContext";
import { SortOrder } from "@/components/interface/sound/Sound";
import {
  Virtuoso,
  StateSnapshot,
  VirtuosoHandle,
  VirtuosoGrid,
} from "react-virtuoso";
import { useArtifact } from "@/hooks/usePage";
import Avatar from "@/components/global/Avatar";
import Image from "next/image";
import { StarIcon } from "@/components/icons";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}
const cardMask = {
  maskImage: "url('/images/mask_card_back.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_back.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

const gridComponents = {
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "flex",
        flexWrap: "wrap",
        rowGap: "2rem",
        columnGap: "2rem",
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }) => (
    <div
      {...props}
      style={{
        // padding: "1rem",
        display: "flex",
      }}
    >
      {children}
    </div>
  ),
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

  // Capture the state of the virtuoso list
  const ref = React.useRef<VirtuosoHandle>(null);
  const sound = activePage.sound;
  const state = React.useRef<StateSnapshot | undefined>(sound?.snapshot?.state);
  const key = sound?.snapshot?.key;

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

  const url = MusicKit.formatArtworkURL(
    sound!.data.attributes.artwork,
    88 * 2.5,
    88 * 2.5,
  );

  if (!artifacts) return null;

  return (
    <div className={`mask mt-1 h-max w-full snap-start`}>
      <VirtuosoGrid
        key={key}
        ref={ref}
        className={`scrollbar-none`}
        style={{
          height: target.height,
          padding: "0 2rem",
        }}
        data={artifacts}
        overscan={200}
        // restoreStateFrom={state.current}
        computeItemKey={(key: number) => `item-${key.toString()}`}
        endReached={handleEndReached}
        components={gridComponents}
        itemContent={(index, artifact) => (
          <div
            style={{
              ...cardMask,
            }}
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
            className="flex h-[432px] w-[304px] cursor-pointer flex-col bg-white p-6 pb-0"
          >
            <div className={`flex flex-shrink-0 justify-between`}>
              <StarIcon />

              <Image
                className={`shadow-shadowKitHigh rounded-xl`}
                src={url}
                alt={`- artwork`}
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
        )}
      />
    </div>
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
