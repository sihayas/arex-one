import { StarIcon } from "../../icons";

interface StarsProps {
  rating: number;
}

export const Stars: React.FC<StarsProps> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: rating }, (_, i) => (
        <StarIcon
          key={i}
          // className={i !== 0 ? "-ml-1" : ""}
          width={16}
          height={16}
          color={"#FFF"}
        />
      ))}
    </div>
  );
};
