import React, { useState } from "react";

interface ListenedProps {
  isLoggedIn: boolean;
  handleListenedChange: () => void;
}

const Listened = ({ isLoggedIn, handleListenedChange }: ListenedProps) => {
  const [listened, setListened] = useState(false);

  const handleClick = () => {
    if (isLoggedIn) {
      setListened(!listened);
      handleListenedChange();
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: listened ? "#333333" : "#CCC",
        color: "#fff",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {listened ? "Listened" : "Listen"}
    </button>
  );
};

export default Listened;
