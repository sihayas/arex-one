import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useHandleSoundClick } from "@/hooks/handlePageChange/useHandleSoundClick";
import { AlbumDBData } from "@/lib/global/interfaces";

interface ArtworkHeaderProps {
  albumId?: string;
  songId?: string;
  album?: AlbumDBData;
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = ({
  albumId,
  songId,
}) => {
  const controls = useAnimation();
  const { handleSelectSound } = useHandleSoundClick();
  const imgRef = useRef<HTMLImageElement>(null);

  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
  }, []);

  const type = albumId ? "albumId" : "songId";
  const size = albumId ? "1152" : songId ? "380" : "default";
  const width = albumId ? 576 : songId ? 180 : 338; // default width
  const height = albumId ? 576 : songId ? 180 : 338; // default height

  const { artworkUrl, albumData, isLoading } = useFetchArtworkUrl(
    albumId || songId,
    size,
    type
  );

  const [isScaledDown, setIsScaledDown] = useState(false);

  const executeAfterAnimation = async () => {
    if (!isScaledDown) {
      const imgElement = imgRef.current;
      if (imgElement && albumData && artworkUrl) {
        await handleSelectSound(imgElement, albumData, artworkUrl);
      }
    }
  };

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

      controls.start({
        scale: newScale,
        x: newTranslateX,
        y: newTranslateY,
        transition: { type: "spring", stiffness: 400, damping: 40 },
      });

      setIsScaledDown(!isScaledDown);
    }
  };

  return (
    <motion.div
      className={`-mt-[72px] -mb-[112px] ${isScaledDown ? "z-10" : ""}`}
      onClick={handleClick}
      initial={{ scale: 0.75 }}
      animate={controls}
      layoutId={isLayoutReady ? "artwork-header" : undefined}
    >
      <Image
        className="rounded-[16px]"
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
        loading="lazy"
        quality={100}
        ref={imgRef}
      />
    </motion.div>
  );
};
