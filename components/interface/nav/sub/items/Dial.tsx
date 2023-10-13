import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInputContext } from "@/context/InputContext";

const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

interface DialProps {
  setRatingValue: (rating: number) => void;
}

const Dial = ({ setRatingValue }: DialProps) => {
  const [ratingIndex, setRatingIndex] = useState(0);
  const { inputRef } = useInputContext();

  const handleKeyPress = (e: any) => {
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
      className={`w-[36px] h-[36px] rounded-full border border-black flex justify-center items-center overflow-hidden text-sm text-black  scale-90 focus:scale-100 outline-none ${
        inputRef.current?.value === "" ? "shadow-rating" : ""
      } focus:shadow-rating transition-all absolute -bottom-[37px] left-[3px]`}
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <motion.div
        initial={false}
        animate={{ y: -(ratingIndex - 5) * 40 }}
        transition={{ type: "spring", stiffness: 305, damping: 20 }}
      >
        {ratings.map((rating, i) => (
          <motion.div
            className="flex w-full items-center justify-center text-center text-sm font-semibold h-[40px] text-black"
            key={i}
            style={{
              scale: 1 - Math.abs(i - ratingIndex) * 0.5,
            }}
          >
            {rating}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dial;
