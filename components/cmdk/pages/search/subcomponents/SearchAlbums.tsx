import { useQuery } from "@tanstack/react-query";

const SearchAlbums = (searchQuery) => {
  const { data, isLoading, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/crossReferenceSearch?query=${searchQuery}`).then((res) =>
        res.json()
      ),
    {
      enabled: !!searchQuery,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  return {
    data: data ?? [],
    isLoading,
    error: !!error,
  };
};

export default SearchAlbums;
