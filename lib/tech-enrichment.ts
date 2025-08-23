export async function enrichWappalyzer(url: string): Promise<string[]> {
  const base = process.env.WAPPALYZER_API_BASE;
  const key = process.env.WAPPALYZER_API_KEY;
  if (!base || !key) return [];
  try {
    const res = await fetch(`${base}/lookup/?urls=${encodeURIComponent(url)}`, {
      headers: { 'x-api-key': key }, cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    // shape varies; flatten names
    const names = new Set<string>();
    Object.values<any>(data).forEach((arr) => (arr || []).forEach((app: any) => names.add(app.name)));
    return Array.from(names);
  } catch { return []; }
}

export async function enrichBuiltWith(url: string): Promise<string[]> {
  const base = process.env.BUILTWITH_API_BASE;
  const key = process.env.BUILTWITH_API_KEY;
  if (!base || !key) return [];
  try {
    const res = await fetch(`${base}/v20/api.json?KEY=${key}&LOOKUP=${encodeURIComponent(url)}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const names = new Set<string>();
    (data?.Results || []).forEach((r: any) => (r?.Result?.Paths || []).forEach((p: any) => (p?.Technologies || []).forEach((t: any) => names.add(t.Name))));
    return Array.from(names);
  } catch { return []; }
}