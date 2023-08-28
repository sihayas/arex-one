import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInterface } from "@/context/Interface";

const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

interface DialProps {
  setRatingValue: (rating: number) => void;
}

const Dial = ({ setRatingValue }: DialProps) => {
  const [ratingIndex, setRatingIndex] = useState(0);
  const { inputRef } = useInterface();

  const props = useSpring({
    value: ratingIndex,
    config: { tension: 305, friction: 20 },
  });

  const handleKeyPress = (e: any) => {
    // Check if the dial itself is focused or if the inputRef is focused and empty
    if (
      (document.activeElement === inputRef.current &&
        inputRef.current?.value === "") ||
      document.activeElement === dialRef.current
    ) {
      if (e.key === "ArrowUp" && ratingIndex < ratings.length - 1) {
        setRatingIndex((prev) => prev + 1);
      } else if (e.key === "ArrowDown" && ratingIndex > 0) {
        setRatingIndex((prev) => prev - 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [ratingIndex, inputRef]);

  useEffect(() => {
    setRatingValue(ratings[ratingIndex]);
  }, [ratingIndex, setRatingValue]);

  const dialRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={dialRef}
      className={`w-[36px] h-[36px] rounded-full border border-silver flex justify-center items-center overflow-hidden text-sm text-black hoverable-small scale-90 focus:scale-100 outline-none ${
        inputRef.current?.value === "" ? "shadow-rating" : ""
      } focus:shadow-rating transition-all absolute -bottom-10 left-1`}
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <animated.div
        style={{
          transform: props.value.to(
            (value) => `translateY(${-(value - 5) * 40}px)`
          ),
        }}
      >
        {ratings.map((rating, i) => (
          <animated.div
            className="font-semibold w-full h-[40px] flex justify-center items-center text-center text-gray2 text-sm"
            key={i}
            style={{
              transform: props.value.to(
                (value) => `scale(${1 - Math.abs(i - value) * 0.5})`
              ),
            }}
          >
            {rating}
          </animated.div>
        ))}
      </animated.div>
    </div>
  );
};

export default Dial;
