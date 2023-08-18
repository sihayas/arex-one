import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";
import { useDragAlbumLogic } from "@/hooks/handleInteractions/useDragAlbumLogic";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import { OpenAIIcon } from "@/components/icons";
import Lowlights from "./sub/Lowlights";
import Highlights from "./sub/Highlights";

import { animated, SpringValue } from "@react-spring/web";

interface AlbumProps {
  scale: SpringValue<number>;
}

const Album = ({ scale }: AlbumProps) => {
  // Hooks
  const { data: session } = useSession();
  const { pages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();
  const { scrollContainerRef, restoreScrollPosition } = useScrollPosition();
  const { bind, x, activeSection } = useDragAlbumLogic();

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.colors[0]) {
      return `0px 0px 0px 0px ${selectedAlbum.colors[0]}, 0.11),
        9px 11px 32px 0px ${selectedAlbum.colors[0]}, 0.11),
        37px 45px 58px 0px ${selectedAlbum.colors[0]}, 0.09),
        83px 100px 78px 0px ${selectedAlbum.colors[0]}, 0.05),
        148px 178px 93px 0px ${selectedAlbum.colors[0]}, 0.02),
        231px 279px 101px 0px ${selectedAlbum.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.colors]);

  // Initialize album
  const albumQuery = useAlbumQuery(selectedAlbum);
  const { data, isLoading, isError } = albumQuery;
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    selectedAlbum?.id,
    "1316"
  );

  // useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);

  // Load and error handling
  if (!selectedAlbum || isLoading || isArtworkLoading) {
    return <div>loading...</div>; // Replace with your preferred loading state
  }

  if (isError) {
    return (
      <div>
        <button onClick={pages.pop}>go back</button>
        <button onClick={pages.pop}>retry</button>
      </div>
    );
  }

  console.log(data);

  return (
    <animated.div
      ref={scrollContainerRef}
      className="flex flex-col items-center h-full w-full"
    >
      {/* Top Section */}
      <animated.div
        style={{
          transform: scale.to(
            (value) =>
              `scale3d(${value}, ${value}, ${value}) translate3d(${
                (1 - value) * -84.25
              }rem, ${(1 - value) * 8}rem, 0)`
          ),
          transformOrigin: "top center",
        }}
        className="fixed top-0 z-50"
      >
        {/* Album Artwork  */}
        <animated.img
          style={{
            borderRadius: scale.to((value) => `${20 + (1 - value) * -12}px`),
            boxShadow: boxShadow,
          }}
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedAlbum.attributes.name} artwork`}
          width={658}
          height={658}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />
        {/* Album Metadata  */}
        <animated.div
          style={{
            transform: scale.to(
              (value) => `scale3d(${1 / value}, ${1 / value}, ${1 / value})`
            ),
            transformOrigin: "center",
          }}
          className="absolute grid items-center top-[724px] ml-[86px] w-[486px] gap-8"
        >
          {/* Album Details  */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="text-sm text-black font-medium">{data.album.name}</p>
            <p className="text-sm text-gray2">{data.album.artist}</p>
          </div>
          {/* Rating  */}
          <div className="flex items-center justify-center justify-self-center w-9 h-9 border border-silver text-sm text-black rounded-full font-medium">
            {data.album.averageRating}
          </div>

          {/* Consensus  */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <OpenAIIcon width={16} height={16} color={"#999"} />
              <p className="font-medium text-gray2 text-xs">CONSENSUS</p>
            </div>

            {data.album.notes ? (
              <div className="text-xs text-gray2">{data.album.notes}</div>
            ) : (
              <div className="ml-6 text-xs text-gray3">COMING SOON</div>
            )}
          </div>
        </animated.div>
      </animated.div>

      {/* Section Two / Entries  */}
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
        }}
        className="flex pt-[800px] gap-8 ml-[1030px] w-full"
      >
        {activeSection === 0 && (
          <Highlights selectedAlbum={selectedAlbum!} user={session!.user} />
        )}

        {activeSection === 1 && (
          <Lowlights selectedAlbum={selectedAlbum!} user={session!.user} />
        )}
      </animated.div>

      {/* Section Headers */}
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${0 + val * 0.98}px)`),
        }}
        className="fixed top-16 -right-11 flex gap-4"
      >
        <div
          className={`text-sm font-medium ${
            activeSection === 0 ? "text-black" : "text-gray3"
          }`}
        >
          high<span className="font-light">lights</span>
        </div>
        <div
          className={`text-sm font-medium ${
            activeSection === 1 ? "text-black" : "text-gray3"
          }`}
        >
          low<span className="font-light">lights</span>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Album;
