import {
  StarIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
} from "../../icons";

interface StarsProps {
  rating: number;
}

export const Stars: React.FC<StarsProps> = ({ rating }) => {
  const getStarIcon = (rating: number) => {
    const color = Math.floor(rating) === rating ? "black" : "#808080"; // if rating is fractional, color is 50% black (#808080)

    switch (Math.floor(rating)) {
      case 1:
        return <StarIcon width={12} height={12} color={color} />;
      case 2:
        return <StarTwoIcon width={12} height={12} color={color} />;
      case 3:
        return <StarThreeIcon width={12} height={12} color={color} />;
      case 4:
        return <StarFourIcon width={12} height={12} color={color} />;
      default:
        return <AsteriskIcon width={12} height={12} color={"#333"} />;
    }
  };

  return (
    <div className="flex items-center p-2 border border-silver bg-white rounded-full">
      {getStarIcon(rating)}
    </div>
  );
};
