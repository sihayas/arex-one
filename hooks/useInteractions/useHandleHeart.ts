import { useState } from "react";
import axios from "axios";

const useHandleHeartClick = (
  initialHeartByUser: boolean,
  initialhearts: number,
  heartApiUrl: string,
  idKey: string,
  idValue: any,
  userId?: string
) => {
  const [hearted, setHeart] = useState(initialHeartByUser);
  const [heartCount, setHeartCount] = useState(initialhearts);

  const handleHeartClick = async () => {
    if (!userId) return;

    // Optimistically update state
    const newHeartCount = hearted ? heartCount - 1 : heartCount + 1;
    setHeart(!hearted);
    setHeartCount(newHeartCount);

    try {
      const action = hearted ? "unheart" : "heart";
      const response = await axios.post(heartApiUrl, {
        [idKey]: idValue,
        userId,
        action,
      });

      if (!response.data.success) {
        // Revert state on failure
        setHeart(hearted);
        setHeartCount(heartCount);
        console.error("Failed to update hearts:", response.data);
      }
    } catch (error) {
      // Revert state on error
      setHeart(hearted);
      setHeartCount(heartCount);
      console.error("Error updating hearts:", error);
    }
  };

  return { hearted, heartCount, handleHeartClick, setHeart, setHeartCount };
};

export default useHandleHeartClick;
