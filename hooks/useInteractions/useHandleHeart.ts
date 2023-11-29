import { useState } from "react";
import axios from "axios";

const useHandleHeartClick = (
  initialHeartByUser: boolean,
  initialHearts: number,
  apiUrl: string,
  idKey: string,
  idValue: any,
  authorId: string,
  userId?: string,
) => {
  const [hearted, setHearted] = useState(initialHeartByUser);
  const [heartCount, setHeartCount] = useState(initialHearts);

  const handleHeartClick = async () => {
    if (!userId) return;

    const newHeartedState = !hearted;
    const newHeartCount = hearted ? heartCount - 1 : heartCount + 1;

    // Optimistically update state
    setHearted(newHeartedState);
    setHeartCount(newHeartCount);

    try {
      const response = await axios.post(apiUrl, {
        [idKey]: idValue,
        userId,
        authorId,
      });

      if (!response.data.success) {
        throw new Error("Failed to update hearts");
      }
    } catch (error) {
      // Revert state on failure or error
      setHearted(hearted);
      setHeartCount(heartCount);
      console.error("Error updating hearts:", error);
    }
  };

  return { hearted, heartCount, handleHeartClick };
};

export default useHandleHeartClick;
