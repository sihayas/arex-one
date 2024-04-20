import {
  OneStar,
  TwoStar,
  ThreeStar,
  FourStar,
  FiveStar,
  HalfStar,
  OneHalfStar,
  TwoHalfStar,
  ThreeHalfStar,
  FourHalfStar,
} from "@/components/icons";
import React from "react";

const starComponents = {
  0.5: HalfStar,
  1: OneStar,
  1.5: OneHalfStar,
  2: TwoStar,
  2.5: TwoHalfStar,
  3: ThreeStar,
  3.5: ThreeHalfStar,
  4: FourStar,
  4.5: FourHalfStar,
  5: FiveStar,
};

export const getStarComponent = (
  rating: number | null,
  width: number = 24,
  height: number = 24,
) => {
  //@ts-ignore
  const StarComponent = starComponents[Math.ceil(rating * 2) / 2];
  return StarComponent ? <StarComponent width={width} height={height} /> : null;
};
