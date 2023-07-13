import { UserAvatar } from "./UserAvatar";
import { useCMDK } from "@/context/CMDKContext";

interface UserAttributionProps {
  id: string;
  name: string;
  image: string;
}

export const UserAttribution = ({ id, name, image }: UserAttributionProps) => {
  const { setPages, bounce } = useCMDK();
  return (
    <div
      onClick={() => {
        // Store in pages array with user id
        setPages((prevPages) => [
          ...prevPages,
          {
            name: "user",
            id,
          },
        ]);
        bounce();
      }}
      className="flex items-center gap-2 border border-silver rounded-full pl-1 pr-2 py-1"
    >
      <div className="flex items-center gap-[6px] w-max">
        <UserAvatar
          imageSrc={image}
          altText={`${name}'s avatar`}
          width={24}
          height={24}
        />
        {/* <UserName color="black" username={name} /> */}
      </div>
    </div>
  );
};
