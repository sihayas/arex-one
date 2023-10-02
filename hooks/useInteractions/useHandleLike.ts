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

    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post(likeApiUrl, {
        [idKey]: idValue,
        userId,
        action,
      });

      if (response.data.success) {
        setLikeCount(response.data.likes);
        setLiked(!liked);
        console.log("Success:", response.data);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return { liked, likeCount, handleLikeClick, setLiked, setLikeCount };
};

export default useHandleLikeClick;
