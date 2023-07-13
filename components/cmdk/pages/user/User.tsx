import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCMDK } from "@/context/CMDKContext";

const User = () => {
  const { pages } = useCMDK();
  const userId = pages[pages.length - 1].user;

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["user", userId],
    async () => {
      const url = `/api/user/getById?id=${userId}`;
      const response = await axios.get(url);
      return response.data;
    },
    {
      enabled: !!userId,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }
  console.log("user", user);

  return (
    <div className="bg-white w-full h-full rounded-full">
      {/* display user details here using the user data */}
    </div>
  );
};

export default User;
