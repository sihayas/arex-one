import React, { useState } from "react";
import Image from "next/image";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useHandleSoundClick } from "@/hooks/handlePageChange/useHandleSoundClick";
import { AlbumDBData } from "@/lib/global/interfaces";
import { useSpring, animated, to } from "@react-spring/web";

interface ArtworkHeaderProps {
  albumId?: string;
  songId?: string;
  album?: AlbumDBData;
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = ({
  albumId,
  songId,
}) => {
  const { handleSelectSound } = useHandleSoundClick();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const type = albumId ? "albumId" : "songId";
  const size = albumId ? "1152" : songId ? "380" : "default";
  const width = albumId ? 576 : songId ? 180 : 338; // default width
  const height = albumId ? 576 : songId ? 180 : 338; // default height

  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId || songId,
    size,
    type
  );

  const [isScaledDown, setisScaledDown] = useState(false);
  const [{ translateX, translateY, scale }, set] = useSpring(() => ({
    scale: 0.75,
    translateX: 0,
    translateY: 0,
    config: { tension: 500, friction: 50 },
  }));

  const executeAfterAnimation = async () => {
    if (!isScaledDown) {
      const imgElement = imgRef.current;
      if (imgElement && albumData && artworkUrl) {
        await handleSelectSound(imgElement, albumData, artworkUrl);
      }
    }
  };

  // Scaling in this case means the image is smaller. This is because the image is scaled down to 75% of its original size on load.
  const handleClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (imgRef.current) {
      const imgElement = imgRef.current;
      const rect = imgElement.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const translateX = centerX - (rect.left + rect.width / 2);
      const translateY = centerY - (rect.top + rect.height / 2);

      const newScale = isScaledDown ? 0.75 : 1;
      const newTranslateX = isScaledDown ? 0 : translateX;
      const newTranslateY = isScaledDown ? 0 : translateY;

      executeAfterAnimation();

      set({
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });

      setisScaledDown(true);
    }
  };

  return (
    <animated.div
      className={`-mt-[72px] -mb-[112px] ${isScaledDown ? "z-50" : "z-10"}`}
      onClick={handleClick}
      ref={imgRef}
      style={{
        transform: to(
          [scale, translateX, translateY],
          (s, x, y) => `scale(${s}) translate(${x}px, ${y}px)`
        ),
      }}
    >
      <Image
        className="rounded-[16px] shadow-artworkFeed"
        src={
          isLoading
            ? "/images/loading.webp"
            : artworkUrl || "/images/default.webp"
        }
        alt={`artwork`}
        width={width}
        height={height}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
        ref={imgRef}
        loading="lazy"
        quality={100}
      />
    </animated.div>
  );
};
