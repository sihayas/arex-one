import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";
import { useDragAlbumLogic } from "@/hooks/handleInteractions/useDrag/album";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import Highlights from "./sub/Highlights";
import { animated, SpringValue, to } from "@react-spring/web";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

import TabBar from "./sub/TabBar";

interface AlbumProps {
  scale: SpringValue<number>;
  translateX: SpringValue<number>;
  translateY: SpringValue<number>;
}

const Album = ({ scale, translateX, translateY }: AlbumProps) => {
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

  return (
    <animated.div
      ref={scrollContainerRef}
      className="flex flex-col items-center h-full w-full"
    >
      {/* Top Section */}
      <animated.div
        style={{
          transform: translateY.to((ty) => `translate3d(0px, ${ty}px, 0)`),
        }}
        className="fixed z-10"
      >
        {/* Artwork */}
        <animated.img
          style={{
            borderRadius: scale.to((value) => `${20 + (1 - value) * -12}px`),
            boxShadow: boxShadow,
            transform: scale.to((s) => `scale(${s})`),
          }}
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={658}
          height={658}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />

        {/* Tab Bar, Interactions, Data */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20">
          <TabBar />
        </div>

        {/* Rating & Stats */}
        <div
          className="absolute top-[90px] left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border border-white flex items-center justify-center"
          style={{ borderWidth: "1px" }}
        >
          <span className="font-bold text-xl text-white">4.2</span>
        </div>

        {/* Rating & Stats */}
        <div className="absolute top-[146px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="font-medium text-sm text-white">
            {selectedSound.sound.attributes.name}
          </div>
          <div className="text-sm text-white">
            {selectedSound.sound.attributes.artistName}
          </div>
        </div>
      </animated.div>

      {/* Section Two / Entries  */}
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
        }}
        className="flex gap-8 p-8 pt-[900px] w-full relative"
      >
        {activeSection === 0 && (
          <Highlights selectedSound={selectedSound} user={session!.user} />
        )}
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
