interface KVPair {
  [key: string]: string | number | boolean;
}

export default function queryFromObj(obj: KVPair = {}): string {
  const searchParams = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    searchParams.set(key, value.toString());
  });
  return searchParams.toString();
}
