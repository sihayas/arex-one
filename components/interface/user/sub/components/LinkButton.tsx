// FollowButton.tsx
import React from "react";

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
      className="flex items-center gap-1 text-xs relative font-mono"
      style={{ color: linkColor }}
    >
      {linkText}
      <div
        className="w-2 h-2 rounded-full animate-ping"
        style={{ backgroundColor: linkColor }}
      ></div>
      <div
        className="w-2 h-2 rounded-full absolute right-0"
        style={{ backgroundColor: linkColor }}
      />
    </button>
  );
};

export default FollowButton;
