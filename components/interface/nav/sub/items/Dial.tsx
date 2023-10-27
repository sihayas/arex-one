import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavContext } from "@/context/NavContext";

const ratings = Array.from({ length: 11 }, (_, i) => i * 0.5);

interface DialProps {
  setRatingValue: (rating: number) => void;
}

const Dial = ({ setRatingValue }: DialProps) => {
  const [ratingIndex, setRatingIndex] = useState(0);
  const { inputRef } = useNavContext();
  const dialRef = useRef<HTMLDivElement>(null);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputEmpty = inputRef.current?.value === "";

      if (
        (activeElement === inputRef.current && isInputEmpty) ||
        activeElement === dialRef.current
      ) {
        if (e.key === "ArrowUp" && ratingIndex < ratings.length - 1) {
          setRatingIndex((prev) => prev + 1);
        } else if (e.key === "ArrowDown" && ratingIndex > 0) {
          setRatingIndex((prev) => prev - 1);
        }
      }
    },
    [ratingIndex, inputRef]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress as any);
    return () => window.removeEventListener("keydown", handleKeyPress as any);
  }, [ratingIndex, inputRef, handleKeyPress]);

  useEffect(() => {
    setRatingValue(ratings[ratingIndex]);
  }, [ratingIndex, setRatingValue]);

  return (
    <div
      ref={dialRef}
      className={`w-[36px] h-[36px] rounded-full border border-black flex justify-center items-center overflow-hidden text-sm text-black  scale-90 focus:scale-100 outline-none ${
        inputRef.current?.value === "" ? "shadow-rating" : ""
      } focus:shadow-rating transition-all absolute -top-[37px] left-[3px]`}
      tabIndex={0}
      onKeyDown={handleKeyPress as any}
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
