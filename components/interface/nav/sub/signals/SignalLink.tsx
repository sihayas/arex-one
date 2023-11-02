import { ActivityType, User } from "@/types/dbTypes";
import { extendedNotification } from "../Signals";
import UserAvatar from "@/components/global/UserAvatar";

interface SignalLinkProps {
  notification: extendedNotification;
}

const SignalLink = ({ notification }: SignalLinkProps) => {
  const { users, activity } = notification;
  const isAggregated = users.length > 1;

  const isFollowBack = activity.type === ActivityType.FOLLOWED_BACK;
  console.log(isFollowBack);

  const getUserAvatar = (user: User, index: number) => {
    const avatarSize = isAggregated
      ? index === 0
        ? 24
        : index === 1
        ? 20
        : 16
      : 32;
    const avatarClass = `${
      index < 2 ? "absolute border border-silver" : "w-[1rem] h-[1rem]"
    } ${index === 1 && "absolute bottom-0 right-0"}`;

    return (
      <UserAvatar
        className={avatarClass}
        imageSrc={user.image}
        altText={`${user.username}'s avatar`}
        width={avatarSize}
        height={avatarSize}
        user={user}
      />
    );
  };

  return (
    <div className={`flex items-center w-full gap-4`}>
      {/* Primary Avatar */}
      <div className={`flex relative w-[2rem] h-[2rem]`}>
        {users.slice(0, 2).map((user, index) => getUserAvatar(user, index))}
        <div
          className={`w-2 h-2 ${
            isFollowBack ? "bg-[#00FF80]" : "bg-[#FFD700]"
          } rounded-full absolute top-0 outline outline-white outline-2`}
        />
      </div>
      {/* Secondary Avatars and Count */}
      <div className="flex flex-col mt-[2px]">
        {/* Primary Username */}
        <div className="text-sm text-gray4 leading-[75%]">
          {users[0].username}
        </div>
        <div className={`flex items-center gap-1 mt-[10px]`}>
          {/* User Avatars */}
          {users.length > 2 && (
            <div className={`flex`}>
              {users
                .slice(2, 5)
                .map((user, index) => getUserAvatar(user, index + 2))}
            </div>
          )}

          {/* Text and Count */}
          <div className="flex items-center gap-2">
            {users.length > 4 && (
              <div className="text-xs text-gray2 tracking-widest leading-[75%]">
                &{users.length - 4}
              </div>
            )}
            <div className="text-xs text-gray2 leading-[75%] font-medium">
              {isFollowBack ? "INTERLINKED WITH YOU" : "LINK"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalLink;
