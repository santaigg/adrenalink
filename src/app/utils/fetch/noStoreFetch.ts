export default async function fetchData(
  url: string,
  options?: Omit<RequestInit, "cache">
) {
  const data = await fetch(url, { ...options, cache: "no-store" });
  console.log('nosf', data)
  return data
}
