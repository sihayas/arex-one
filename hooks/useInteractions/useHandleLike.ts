import { useState } from "react";
import axios from "axios";

const useHandleLikeClick = (
  initialLikedByUser: boolean,
  initialLikes: number,
  likeApiUrl: string,
  idKey: string,
  idValue: any,
  session: any,
) => {
  const [liked, setLiked] = useState(initialLikedByUser);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLikeClick = async () => {
    if (!session) return;

    const userId = session.user.id;

    // Optimistically update state
    const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
    setLiked(!liked);
    setLikeCount(newLikeCount);

    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post(likeApiUrl, {
        [idKey]: idValue,
        userId,
        action,
      });

      if (!response.data.success) {
        // Revert state on failure
        setLiked(liked);
        setLikeCount(likeCount);
        console.error("Failed to update likes:", response.data);
      }
    } catch (error) {
      // Revert state on error
      setLiked(liked);
      setLikeCount(likeCount);
      console.error("Error updating likes:", error);
    }
  };

  return { liked, likeCount, handleLikeClick, setLiked, setLikeCount };
};

export default useHandleLikeClick;
