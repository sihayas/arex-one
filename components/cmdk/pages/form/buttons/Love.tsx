import React, { useState } from "react";

interface LoveProps {
  isLoggedIn: boolean;
  handleLovedChange: () => void;
}

const Love = ({ isLoggedIn, handleLovedChange }: LoveProps) => {
  const [loved, setLoved] = useState(false);

  const handleClick = () => {
    if (isLoggedIn) {
      setLoved(!loved);
      handleLovedChange();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        backgroundColor: loved ? "#333333" : "#CCC",
        color: "#fff",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {loved ? "Loved" : "Love"}
    </button>
  );
};

export default Love;
