// import { useQuery } from "@tanstack/react-query";

// const SearchAlbums = (searchQuery: string) => {
//   const { data, isLoading, isFetching, error } = useQuery(
//     ["albums", searchQuery],
//     () =>
//       fetch(`/api/crossReferenceSearch?query=${searchQuery}`).then((res) =>
//         res.json()
//       ),
//     {
//       enabled: !!searchQuery,
//       retry: false,
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       cacheTime: 30 * 60 * 1000, // 30 minutes
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

import { useQuery } from "@tanstack/react-query";
import { searchAlbums } from "../global/musicKit";

const SearchAlbums = (searchQuery: string) => {
  const { data, isLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () => searchAlbums(searchQuery), // Call the searchAlbums method directly
    {
      enabled: !!searchQuery,
      retry: false,
    }
  );

  return {
    data: data ?? [],
    isLoading,
    isFetching,
    error: !!error,
  };
};

export default SearchAlbums;
