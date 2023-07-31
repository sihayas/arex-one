import { useCMDK } from "@/context/CMDKContext";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedGradient() {
  const [albumTitle, setAlbumTitle] = useState("");

  const [artist, setArtist] = useState("");
  const { pages } = useCMDK();

  const [gradientColors, setGradientColors] = useState({
    color1: "",
    color2: "",
    color3: "",
  });

  let interval = useMotionValue(0);
  let y = useTransform(interval, (value) => Math.sin(value) * 100);
  let x = useTransform(interval, (value) => Math.cos(value) * 100);
  useEffect(() => {
    let controls = animate(interval, [0, Math.PI * 2], {
      repeat: Infinity,
      duration: 11,
      ease: "linear",
    });

    return controls.stop;
  }, [interval]);

  useEffect(() => {
    const activePage = pages[pages.length - 1];

    if (activePage.name === "album" && activePage.album) {
      const newColor1 = activePage.album.colors[0];
      const newColor2 = activePage.album.colors[1];
      const newColor3 = activePage.album.colors[2];
      setAlbumTitle(activePage.album.attributes.name);
      setArtist(activePage.album.attributes.artistName);

      setGradientColors({
        color1: newColor1,
        color2: newColor2,
        color3: newColor3,
      });
    }
  }, [pages]);

  return (
    <>
      <motion.div
        style={{
          x,
          y,
          scale: 1.75,
          backgroundImage: `
            radial-gradient(at 21% 33%, ${gradientColors.color1},1) 0px, transparent 50%),
            radial-gradient(at 79% 32%, ${gradientColors.color2},1) 0px, transparent 50%),
            radial-gradient(at 26% 83%, ${gradientColors.color3},1), transparent 50%)`,
          backdropFilter: "blur(5px)",
        }}
        className="absolute z-[0] inset-0"
      ></motion.div>
      <motion.div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
        className="absolute z-[0] inset-0"
      ></motion.div>
      <div className="flex flex-col absolute z-[0] top-8 left-8 text-white text-2xl tracking-widest opacity-80 uppercase font-semibold">
        <div>{albumTitle}</div>
        <div className="font-normal">{artist}</div>
      </div>
    </>
  );
}
