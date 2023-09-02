import { useState } from "react";
import { useScrollPosition } from "@/hooks/useInteractions/useScrollPosition";
import { useDragIndexLogic } from "@/hooks/useDrag/index";
import { animated } from "@react-spring/web";
import BloomingSection from "./sub/BloomingSection";
import SpotlightSection from "./sub/SpotlightSection";

const Album = () => {
  const { scrollContainerRef } = useScrollPosition();

  const [activeState, setActiveState] = useState({ button: "spotlight" });
  const { bind, x, activeSection } = useDragIndexLogic();

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col w-full h-full overflow-hidden relative"
    >
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val * 0.95}px)`),
        }}
        className="fixed top-[64px] -right-[40px] flex gap-4 z-50"
      >
        <div className="text-sm font-medium">spotlight</div>
        <div className="text-sm text-gray3">in bloom</div>
      </animated.div>
      {/* Container */}
      <animated.div
        className="flex w-[200%] h-full"
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
        }}
      >
        <SpotlightSection />
        <BloomingSection />
      </animated.div>
    </div>
  );
};

export default Album;
