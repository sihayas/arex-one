import { useQuery } from "@tanstack/react-query";
import { useSound } from "@/context/SoundContext";
import { useInputContext } from "@/context/InputContext";

const GetSearchResults = (searchQuery: string) => {
  const { inputValue } = useInputContext();
  const { selectedFormSound } = useSound();
  const { data, isInitialLoading, isFetching, error } = useQuery(
    ["albums", searchQuery],
    () =>
      fetch(`/api/search/get/results?query=${searchQuery}`).then((res) =>
        res.json()
      ),
    {
      enabled: !selectedFormSound && !!inputValue,
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
