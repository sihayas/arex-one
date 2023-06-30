import { useState, useEffect } from "react";

// Used to blur main and set pointer-events to auto
const useContentControl = () => {
  const [isContentBlurred, setIsContentBlurred] = useState(false);

  useEffect(() => {
    const mainElement = document.getElementById("main-content");
    const classListMethod = isContentBlurred ? "add" : "remove";

    mainElement?.classList[classListMethod]("blurred", "pointer-events-none");
  }, [isContentBlurred]);

  return { isContentBlurred, setIsContentBlurred };
};

export default useContentControl;
