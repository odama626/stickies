export function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}

export function queryFromObj(obj): string {
  const searchParams = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    searchParams.set(key, value.toString());
  });
  return searchParams.toString();
}
