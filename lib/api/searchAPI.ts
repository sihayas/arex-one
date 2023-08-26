import { useQuery } from "@tanstack/react-query";
import { useSound } from "@/context/Sound";

const GetSearchResults = (searchQuery: string) => {
  const { selectedFormSound } = useSound();
  const { data, isInitialLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/results?query=${searchQuery}`).then((res) =>
        res.json()
      ),
    {
      enabled: !selectedFormSound, // Query will not run if searchQuery is empty
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
