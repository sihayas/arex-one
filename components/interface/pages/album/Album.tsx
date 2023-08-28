import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";
import { useDragAlbumLogic } from "@/hooks/handleInteractions/useDrag/album";

import { SongData } from "@/lib/global/interfaces";
import { useAlbumQuery } from "@/lib/api/albumAPI";
import Lowlights from "./sub/Lowlights";
import Highlights from "./sub/Highlights";
import { animated, SpringValue } from "@react-spring/web";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

interface AlbumProps {
  scale: SpringValue<number>;
}

const Album = ({ scale }: AlbumProps) => {
  // Hooks
  const { data: session } = useSession();
  const { pages } = useInterface();
  const { selectedSound } = useSound();
  const { scrollContainerRef } = useScrollPosition();
  const { bind, x, activeSection } = useDragAlbumLogic();

  const [isExpanded, setIsExpanded] = useState(false);

  const artworkUrl = GenerateArtworkUrl(
    selectedSound!.sound.attributes.artwork.url,
    "1316"
  );

  const boxShadow = useMemo(() => {
    if (selectedSound?.colors[0]) {
      return `0px 0px 0px 0px ${selectedSound.colors[0]}, 0.15),
        2px 2px 7px 0px ${selectedSound.colors[0]}, 0.15),
        9px 9px 13px 0px ${selectedSound.colors[0]}, 0.13),
        20px 20px 17px 0px ${selectedSound.colors[0]}, 0.08),
        35px 36px 20px 0px ${selectedSound.colors[0]}, 0.02),
        55px 57px 22px 0px ${selectedSound.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedSound?.colors]);

  // Initializes album and loads full details into selectedSound
  const { isLoading, isError } = useAlbumQuery();

  // Load and error handling
  if (!selectedSound || isLoading) {
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

  const handleArtworkClick = () => {
    setIsExpanded(!isExpanded);
  };

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
              `translate3d(${(1 - value) * -693}px, ${(1 - value) * 4}rem, 0)`
          ),
          transformOrigin: "center",
        }}
        className="fixed z-50"
      >
        {/* Album Artwork  */}
        <animated.img
          onClick={handleArtworkClick}
          // className="hover:-translate-x-4 transition-transform ease-in-out duration-500"
          style={{
            borderRadius: scale.to((value) => `${20 + (1 - value) * -12}px`),
            boxShadow: boxShadow,
            //transform: isExpanded ? "translateX(-28rem)" : "",
          }}
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={658}
          height={658}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />
        {/* Album Metadata  */}
        <animated.div
          style={{
            transformOrigin: "center",
          }}
          className="absolute grid pt-4 top-[718px] ml-[86px] w-[486px] gap-8 will-change-transform h-[21.25rem] overflow-scroll scrollbar-none"
        >
          {/* Album Details  */}
          <div className="flex flex-col items-end justify-end gap-2">
            <p className="text-sm text-black font-medium">
              {selectedSound.sound.attributes.name}
            </p>
            <p className="text-sm text-black">
              {selectedSound.sound.attributes.artistName}
            </p>
          </div>
          {/* Rating  */}
          <div className="flex items-center justify-center justify-self-center w-9 h-9 border border-silver text-sm text-black rounded-full font-medium">
            {/* {selectedSound.sound.averageRating} */}
          </div>
        </animated.div>
      </animated.div>

      {/* Section Two / Entries  */}
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
        }}
        className="flex pt-[800px] gap-8 ml-[1030px] w-full relative"
      >
        {activeSection === 0 && (
          <Highlights selectedSound={selectedSound} user={session!.user} />
        )}

        {activeSection === 1 && (
          <Lowlights selectedSound={selectedSound} user={session!.user} />
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

// {
//   /* Consensus  */
// }
// <div className="flex gap-2">
//   <p className="font-bold text-gray2 text-sm">
//     {selectedSound.sound.relationships.tracks.data.length}
//   </p>
//   <div className="flex flex-col gap-2">
//     <p className="text-gray2 text-sm font-medium">SONGS</p>
//     <ul className="gap-1">
//       {selectedSound.sound.relationships.tracks.data.map(
//         (track: SongData, index: number) => (
//           <li key={index} className="text-gray2 text-sm">
//             {track.attributes.name}
//           </li>
//         )
//       )}
//     </ul>
//   </div>
// </div>;
