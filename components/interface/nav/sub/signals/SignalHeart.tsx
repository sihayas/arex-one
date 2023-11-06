import { User } from "@/types/dbTypes";
import { extendedNotification } from "../Signals";
import UserAvatar from "@/components/global/UserAvatar";
import Stars from "@/components/global/Stars";

interface SignalHeartProps {
  notification: extendedNotification;
}

const SignalHeart = ({ notification }: SignalHeartProps) => {
  const { users, fetchedSound, activity } = notification;
  const isAggregated = users.length > 1;

  // Determine if the heart activity is towards a reply or an record
  const isReplyHeart = activity.heart?.reply ? true : false;

  // Get the rating from the record associated with the heart activity
  const recordRating = isReplyHeart
    ? activity.heart?.reply?.record?.entry?.rating
    : activity.heart?.record?.entry?.rating;

  // Use the rating from the record
  const rating = recordRating;

  const heartLabel =
    users.length > 1 ? "HEARTS" : isReplyHeart ? "CHAIN HEART" : "HEART";

  const getUserAvatar = (user: User, index: number) => {
    const avatarSize = isAggregated
      ? index === 0
        ? 24
        : index === 1
        ? 20
        : 16
      : 32;
    const avatarClass = `${index === 0 && "absolute border border-silver"} ${
      index === 1 && "absolute bottom-0 right-0 outline outline-white outline-2"
    }`;

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
        <div className="w-2 h-2 bg-[#FF0000] rounded-full absolute top-0 outline outline-white outline-2" />
      </div>
      {/* Secondary Avatars and Count */}
      <div className="flex flex-col mt-[2px]">
        <div className="text-sm text-gray4 leading-[75%]">
          {users[0].username}
        </div>
        <div className={`flex items-center gap-1 mt-[10px]`}>
          {isAggregated ? (
            <>
              {/* User Avatars */}
              <div className={`flex`}>
                {users
                  .slice(2, 5)
                  .map((user, index) => getUserAvatar(user, index + 2))}
              </div>
              {/* Text and Count */}
              <div className="flex items-center gap-2">
                {users.length > 4 && (
                  <div className="text-xs text-gray2 tracking-widest leading-[75%]">
                    &{users.length - 4}
                  </div>
                )}
                <div className="text-xs text-gray2 leading-[75%] font-medium">
                  {heartLabel}
                </div>
              </div>
            </>
          ) : (
            <div className={`text-xs text-gray2 leading-[75%] font-medium`}>
              {heartLabel}
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      {rating && (
        <Stars
          className={`ml-auto bg-[#F4F4F4] shadow-stars outline outline-silver outline-[.5px] p-1 pr-2 rounded-l-lg rounded-3xl h-fit`}
          rating={rating}
          sound={fetchedSound}
        />
      )}
    </div>
  );
};

export default SignalHeart;
