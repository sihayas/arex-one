import { useQuery } from "@tanstack/react-query";

const GetSearchResults = (searchQuery: string) => {
  const { data, isLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/results?query=${searchQuery}`).then((res) =>
        res.json()
      ),
    {
      enabled: true,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: data ?? [],
    isLoading,
    isFetching,
    error: !!error,
  };
};

export default GetSearchResults;

// import { useQuery } from "@tanstack/react-query";
// import { searchAlbums } from "../global/musicKit";

// const SearchAlbums = (searchQuery: string) => {
//   const { data, isLoading, isFetching, error } = useQuery(
//     ["albums", searchQuery],
//     () => searchAlbums(searchQuery), // Call the searchAlbums method directly
//     {
//       enabled: !!searchQuery,
//       retry: false,
//     }
//   );

//   return {
//     data: data ?? [],
//     isLoading,
//     isFetching,
//     error: !!error,
//   };
// };

// export default SearchAlbums;
