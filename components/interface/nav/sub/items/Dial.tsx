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
    [ratingIndex, inputRef],
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
      className={`w-7 h-7 flex justify-center items-center overflow-hidden rounded-full shadow-shadowKitLow focus:outline-none transition-opacity opacity-100 ${
        inputRef.current?.value && "!opacity-50"
      }`}
      tabIndex={0}
      onKeyDown={handleKeyPress as any}
    >
      <motion.div
        animate={{ y: -(ratingIndex - 5) * 40 }}
        transition={{ type: "spring", stiffness: 305, damping: 20 }}
      >
        {ratings.map((rating, i) => (
          <motion.div
            className="flex w-full items-center justify-center text-center h-[40px] text-gray4 font-bold text-xs"
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
