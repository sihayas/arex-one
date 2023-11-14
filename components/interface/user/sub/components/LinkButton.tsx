// FollowButton.tsx
import React from "react";
import { LinkButton } from "@/components/icons";

// FollowButton.tsx
interface FollowButtonProps {
  followState: any;
  handleFollowUnfollow: (action: "follow" | "unfollow") => void;
  linkColor: string;
  linkText: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  followState,
  handleFollowUnfollow,
  linkColor,
  linkText,
}) => {
  return (
    <button
      onClick={() =>
        followState.followingAtoB
          ? handleFollowUnfollow("unfollow")
          : handleFollowUnfollow("follow")
      }
      className="absolute bottom-2 right-2 p-2 bg-white rounded-full flex flex-col group"
      style={{ color: linkColor }}
    >
      <LinkButton color={linkColor} />
      <div
        style={{ color: linkColor }}
        className={`absolute top-1/2 -translate-y-1/2 text-[10px] -right-8 leading-[7px] opacity-0 group-hover:opacity-100`}
      >
        {linkText}
      </div>
    </button>
  );
};

export default FollowButton;
