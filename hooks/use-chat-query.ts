import { InfiniteQueryObserverResult, useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps): InfiniteQueryObserverResult => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      },
    }, { skipNull: true });

    const res = await fetch(url);
    return res.json();
  };

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,   
    initialPageParam: undefined,
    refetchInterval: isConnected ? false : 1000,
  });
};
