import React from "react";
import { StarIcon } from "../../../../icons";

const Rating = ({ color, rating }) => {
  const completedColor = `${color}, 1)`;
  const completedShadowColor = `${color}, 0.1)`;

  return (
    <div className="relative w-7 h-7">
      <div className="absolute bottom-5 left-5">
        {/* <StarIcon width={16} height={16} color={completedColor} /> */}
      </div>
      <svg
        className="w-full h-full"
        viewBox="0 0 28 28"
        style={{
          filter: color
            ? `drop-shadow(0px 0px 5px ${completedShadowColor}) drop-shadow(0px 0px 1px ${completedShadowColor})`
            : "",
        }}
      >
        <circle
          cx="14"
          cy="14"
          r="13"
          fill="transparent"
          stroke={completedColor}
          strokeWidth="1"
        />
      </svg>
      <span
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs"
        style={{ color: completedColor }}
      >
        {rating}
      </span>
    </div>
  );
};

export default Rating;
