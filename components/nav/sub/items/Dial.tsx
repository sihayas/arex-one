import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useCMDK } from "@/context/CMDKContext";

const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

interface DialProps {
  setRatingValue: (rating: number) => void;
}

const Dial = ({ setRatingValue }: DialProps) => {
  const [ratingIndex, setRatingIndex] = useState(0);
  const { inputRef } = useCMDK();

  const props = useSpring({
    value: ratingIndex,
    config: { tension: 305, friction: 20 },
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && ratingIndex < ratings.length - 1) {
      setRatingIndex((prev) => prev + 1);
    } else if (e.key === "ArrowDown" && ratingIndex > 0) {
      setRatingIndex((prev) => prev - 1);
    }
    // } else if (e.key === "Enter") {
    //   inputRef.current && inputRef.current.focus();
    // }
  };

  useEffect(() => {
    setRatingValue(ratings[ratingIndex]);
  }, [ratingIndex, setRatingValue]);

  const dialRef = useRef<HTMLDivElement>(null);

  // Focus on the dial when the component mounts
  useEffect(() => {
    dialRef.current && dialRef.current.focus();
  }, []);

  return (
    <div
      ref={dialRef}
      className="w-[36px] h-[36px] rounded-full border border-silver flex justify-center items-center overflow-hidden text-sm text-black hoverable-small scale-90 focus:scale-100 focus:outline-none transition-transform absolute -bottom-10 left-1 "
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
            className="w-full h-[40px] flex justify-center items-center text-center text-gray2 text-sm"
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
