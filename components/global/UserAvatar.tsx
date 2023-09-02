import Image from "next/image";
import { useHandleUserClick } from "@/hooks/useInteractions/useHandlePageChange";

interface UserAvatarProps {
  imageSrc: string | undefined;
  altText: string;
  height?: number;
  width?: number;
  quality?: number;
  className?: string;
  userId: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  className,
  imageSrc,
  altText,
  height = 32,
  width = 32,
  quality = 100,
  userId,
}) => {
  const handleUserClick = useHandleUserClick(userId);
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
      onClick={handleUserClick}
      className={`rounded-full hoverable-small border border-silver ${className}`}
      src={imageSrc}
      alt={altText}
      height={height}
      width={width}
      quality={quality}
    />
  );
};

export default UserAvatar;
