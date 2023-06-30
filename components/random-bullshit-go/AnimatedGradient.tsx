import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedGradient({ color1, color2, color3, bgColor }) {
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

  return (
    <>
      <motion.div
        style={{
          x,
          y,
          scale: 1.75,
          backgroundColor: bgColor,
          backgroundImage: `
            radial-gradient(at 21% 33%, #${color1} 0px, transparent 50%),
            radial-gradient(at 79% 32%, #${color2} 0px, transparent 50%),
            radial-gradient(at 26% 83%, #${color3}, transparent 50%)`,
          backdropFilter: "blur(5px)",
        }}
        className="absolute z-[0] inset-0"
      ></motion.div>
      <motion.div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        }}
        className="absolute z-[0] inset-0"
      ></motion.div>
    </>
  );
}
