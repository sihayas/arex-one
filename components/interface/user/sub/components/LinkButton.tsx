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
      className="p-2 outline outline-silver outline-1 rounded-full flex flex-col relative group"
      style={{ color: linkColor }}
    >
      <LinkButton color={linkColor} />
      <div
        style={{ color: linkColor }}
        className={`absolute left-1/2 -translate-x-1/2 text-[10px] -top-[15px] leading-[7px] opacity-0 group-hover:opacity-100`}
      >
        {linkText}
      </div>
    </button>
  );
};

export default FollowButton;
