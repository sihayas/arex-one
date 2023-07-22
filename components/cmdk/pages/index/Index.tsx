import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Index() {
  // Query function that will be retried if it fails
  const fetchTrendingAlbums = async () => {
    const { data } = await axios.get("/api/index/getTrendingAlbums");
    return data;
  };

  // Fetch trending albums
  const { isLoading, error, data } = useQuery(
    ["trendingAlbums"],
    fetchTrendingAlbums
  );

  if (isLoading) return "Loading...";

  if (error) return `An error occurred`;

  console.log(data); // You can check out the result in the console

  return (
    <div className="bg-white w-full h-full rounded-[16px] border border-silver">
      {/* Later on, you can map through the 'data' to render your albums here */}
    </div>
  );
}
