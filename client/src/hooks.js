import { getCookie, post } from "./functions";
import { useQuery } from "@tanstack/react-query";

export function usePost(url, body, func, skipCache) {
  const userId = getCookie("userId");
  let cacheKey = [url, body, func]; // queryKey for React Query

  // Special rules from your original function
  if (url.includes("create")) {
    skipCache = true;
  }

  if (url === "/getUser") {
    if (body.userid === userId || body.userId === userId) {
      cacheKey = ["self"];
    } else {
      skipCache = true;
    }
  }

  return useQuery({
    queryKey: cacheKey,
    queryFn: () => post(url, body, func),
    staleTime: skipCache ? 0 : 60_000, // like your 6s TTL
    cacheTime: skipCache ? 0 : 60_000, // how long it's kept in memory
    enabled: !skipCache, // disables query entirely if we skip cache
    retry: 1, // you can tweak this
  });
}
