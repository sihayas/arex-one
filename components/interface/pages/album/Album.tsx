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
import { animated, SpringValue, to } from "@react-spring/web";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";

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
          transform: to(
            [scale, translateY],
            (s, ty) => `translate3d(${0}px, ${ty}px, 0) scale(${s})`
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
          }}
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={658}
          height={658}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />
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
