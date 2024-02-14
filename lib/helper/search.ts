import { useQuery } from "@tanstack/react-query";
import { useSoundContext } from "@/context/SoundContext";
import { useNavContext } from "@/context/NavContext";

const GetSearchResults = (searchQuery: string) => {
  const { inputValue, activeAction } = useNavContext();
  const { selectedFormSound } = useSoundContext();
  const { data, isInitialLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/results?query=${searchQuery}`).then((res) =>
        res.json(),
      ),
    {
      enabled: !selectedFormSound && !!inputValue && activeAction === "none",
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  return {
    data: data ?? [],
    isInitialLoading,
    isFetching,
    error: !!error,
  };
};

export default GetSearchResults;
