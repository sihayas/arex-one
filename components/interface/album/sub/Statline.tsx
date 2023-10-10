import { motion } from "framer-motion";
import React from "react";

type StatlineProps = {
  average?: number;
  ratings?: number[];
};

type StatlineChildProps = {
  width: number;
  color: string;
  index: number;
};

const StatlineChild: React.FC<StatlineChildProps> = ({
  width,
  color,
  index,
}) => {
  return (
    <>
      <motion.div
        whileHover={{ scaleY: 1.5 }}
        style={{ width: `${width}px`, backgroundColor: color }}
        className={`h-[2.5px] my-auto outline outline-1 outline-silver ${
          index === 0 ? "rounded-l" : ""
        } ${index === 4 ? "rounded-r" : ""}`}
      ></motion.div>
    </>
  );
};

const Statline: React.FC<StatlineProps> = ({ average, ratings = [] }) => {
  // Calculate the total count of ratings
  const totalCount = ratings.reduce((sum, count) => sum + count, 0);

  // Define the colors for each rating range
  const colors = ["#FF073A", "#FF6F00", "#FFFC40", "#21FF00", "#712EFF"];

  return (
    <motion.div
      layoutId="statline"
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
    >
      <motion.div className="flex items-center justify-center flex-grow h-[2.5px] w-[288px] my-auto rounded origin-left relative gap-[4px]">
        {/*<div className="absolute -top-[22px] left-0 leading-[75%] text-[22px] font-thin">*/}
        {/*  {average}*/}
        {/*</div>*/}
        {/* For each count of ratings, create a line */}
        {ratings.map((count, index) => {
          // Account for the gap and size of circle dividers
          const width = (count / totalCount) * 288;
          return (
            <StatlineChild
              key={index}
              width={width}
              color={colors[index]}
              index={index}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Statline;
