import Image from "next/image";
import { useHandleUserClick } from "@/hooks/useInteractions/useHandlePageChange";
import React from "react";
import { User } from "@/types/dbTypes";

interface UserAvatarProps {
  user: User;
  imageSrc: string | undefined;
  altText: string;
  height?: number;
  width?: number;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  className,
  imageSrc,
  altText,
  height = 32,
  width = 32,
  quality = 100,
  user,
  style,
  onClick,
}) => {
  const handleUserClick = useHandleUserClick(user);
  if (!imageSrc) {
    return (
      <div
        className={`
        rounded-full 
        bg-gray3
        border-2 
        border-white 
        w-${width} 
        h-${height} 
        ${className}
      `}
      ></div>
    );
  }
  return (
    <Image
      onClick={onClick ? onClick : handleUserClick}
      className={`rounded-full ${className} aspect-square`}
      src={imageSrc}
      alt={altText}
      height={height}
      width={width}
      quality={quality}
      style={style}
    />
  );
};

export default UserAvatar;
