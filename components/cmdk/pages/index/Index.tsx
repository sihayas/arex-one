import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTrendingAlbums = (page) => {
  return useQuery(["trendingAlbums", page], async () => {
    const { data } = await axios.get(
      "/api/index/getTrendingAlbums?page=${page}"
    );
    return data;
  });
};

export default function Index() {
  const { data: albums, isLoading } = useTrendingAlbums(1);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(albums);

  return (
    <div className="bg-white w-full h-full rounded-[32px] border border-silver">
      {/* Later on, you can map through the 'data' to render your albums here */}
    </div>
  );
}
