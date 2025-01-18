export default function fetchData(
  url: string,
  options?: Omit<RequestInit, "cache">
) {
  return fetch(url, { ...options, cache: "no-store" });
}
