import React from "react";
import { useMotionValue, motion } from "framer-motion";

function Cursor() {
  // Cursor context
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event: React.MouseEvent) {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  }

  return (
    <motion.div
      className="cursor"
      style={{ x: mouseX, y: mouseY }}
      onMouseMove={handleMouseMove}
    />
  );
}

export default React.memo(Cursor);
