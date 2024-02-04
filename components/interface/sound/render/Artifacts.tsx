import React from "react";
import { useArtifactsQuery } from "@/lib/apiHelper/album";
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
  const { user, activePage, scrollContainerRef } = useInterfaceContext();
  const { data, fetchNextPage, hasNextPage } = useArtifactsQuery(
    soundId,
    user?.id,
    sortOrder,
    range,
  );
  const { handleSelectArtifact } = useArtifact();

  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.sound?.snapshot?.state,
  );
  const key = activePage.sound?.snapshot?.key;

  const { target } = GetDimensions(activePage.name as PageName);

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  const handleEndReached = () => {
    if (hasNextPage) {
      fetchNextPage()
        .then(() => {
          // Handle successful fetch
        })
        .catch((error) => {
          // Handle any errors that occur during fetch
          console.error("Error fetching next page:", error);
        });
    }
  };

  return (
    <div className={`mt-1 h-max w-full snap-start mask`}>
      <Virtuoso
        key={key}
        ref={ref}
        className={`scrollbar-none`}
        style={{ height: target.height }}
        data={activities}
        overscan={200}
        restoreStateFrom={state.current}
        computeItemKey={(key: number) => `item-${key.toString()}`}
        endReached={handleEndReached}
        itemContent={(index, activity) => (
          <div
            onClick={() => {
              ref.current?.getState((snapshot) => {
                activePage.sound!.snapshot = {
                  state: snapshot,
                  key: index,
                };
              });
              handleSelectArtifact({
                ...activity.artifact,
                appleData: activePage.sound?.sound,
              });
            }}
            className={`p-8 pb-4`}
          >
            <div
              className={`flex flex-col bg-[#F4F4F4] relative w-full px-6 pt-[18px] pb-4 rounded-full gap-2.5 outline outline-1 outline-silver`}
            >
              <div
                className={`absolute -top-3 -left-3 flex items-center justify-center bg-white rounded-max shadow-shadowKitMedium p-3`}
              >
                {getStarComponent(activity.artifact.content!.rating!)}
              </div>
              {/* Content */}
              <div
                className={`break-words line-clamp-6 w-full text-base text-center text-gray font-medium cursor-pointer`}
              >
                {activity.artifact.content?.text}
              </div>

              <div className={`flex items-center gap-2 -mx-2`}>
                <Avatar
                  className={`border border-silver`}
                  imageSrc={activity.artifact.author.image}
                  altText={`${activity.artifact.author.username}'s avatar`}
                  width={32}
                  height={32}
                  user={activity.artifact.author}
                />
                <div
                  className={`text-base leading-[10px] text-black font-semibold`}
                >
                  {activity.artifact.author.username}
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
