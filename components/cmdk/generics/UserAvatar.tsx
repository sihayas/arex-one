import Image from "next/image";

interface UserAvatarProps {
  imageSrc: string;
  altText: string;
  height?: number;
  width?: number;
  quality?: number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  className,
  imageSrc,
  altText,
  height = 32,
  width = 32,
  quality = 100,
}) => {
  return (
    <Image
      className={`rounded-full cursor-pointer z-10 ${className}`}
      src={imageSrc}
      alt={altText}
      height={height}
      width={width}
      quality={quality}
    />
  );
};
