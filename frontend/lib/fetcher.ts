export default async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Network error")
  return res.json()
}
