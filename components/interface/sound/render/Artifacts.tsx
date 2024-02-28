import React from "react";
import { useArtifactsQuery } from "@/lib/helper/sound";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName } from "@/context/InterfaceContext";
import { SortOrder } from "@/components/interface/sound/Sound";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { useArtifact } from "@/hooks/usePage";
import { getStarComponent } from "@/components/index/items/Entry";
import Avatar from "@/components/global/Avatar";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

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

  if (!artifacts) return null;

  return (
    <div className={`mask mt-1 h-max w-full snap-start`}>
      <Virtuoso
        key={key}
        ref={ref}
        className={`scrollbar-none`}
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
              console.log("set the data", activePage.sound?.data);
              console.log("set the artifact", artifact);
            }}
            className={`p-8 pb-4`}
          >
            <div
              className={`outline-silver relative ml-auto flex max-w-[448px] flex-col gap-2.5 rounded-full bg-white px-6 pb-4 pt-[18px] outline outline-1`}
            >
              <div
                className={`rounded-max shadow-shadowKitMedium absolute -left-3 -top-3 flex items-center justify-center bg-white p-3`}
              >
                {getStarComponent(artifact.content!.rating!)}
              </div>
              {/* Content */}
              <div
                className={`line-clamp-6 w-full cursor-pointer break-words text-base text-black`}
              >
                {artifact.content?.text}
              </div>

              <div className={`-mx-2 flex items-center gap-2`}>
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
            </div>
          </div>
        )}
        components={
          {
            // Footer: () => isFetchingNextPage && <div>Loading more...</div>,
            // EmptyPlaceholder: () => <div>No artifacts available</div>,
          }
        }
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
