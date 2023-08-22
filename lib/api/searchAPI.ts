import { useQuery } from "@tanstack/react-query";
import { useCMDKAlbum } from "@/context/CMDKAlbum";

const GetSearchResults = (searchQuery: string) => {
  const { selectedSound } = useCMDKAlbum();
  const { data, isInitialLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/results?query=${searchQuery}`).then((res) =>
        res.json()
      ),
    {
      enabled: !selectedSound, // Query will not run if searchQuery is empty
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: data ?? [],
    isInitialLoading,
    isFetching,
    error: !!error,
  };
};

export default GetSearchResults;
