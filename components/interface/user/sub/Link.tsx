import React from "react";
import { LinkIcon } from "@/components/icons";

interface LinkButtonProps {
  followState: any;
  handleFollowUnfollow: (action: "follow" | "unfollow") => void;
  linkColor: string;
  linkText: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
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
      className="absolute top-0 left-0 p-2 bg-white rounded-full flex flex-col group"
      style={{ color: linkColor }}
    >
      <LinkIcon color={linkColor} />
      <div
        style={{ color: linkColor }}
        className={`absolute top-1/2 -translate-y-1/2 text-[10px] -right-8 leading-[7px] opacity-0 group-hover:opacity-100`}
      >
        {linkText}
      </div>
    </button>
  );
};

export default LinkButton;
