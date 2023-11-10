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
      className="flex items-center gap-1 text-xs relative -z-10"
      style={{ color: linkColor }}
    >
      {linkText}
    </button>
  );
};

export default FollowButton;
