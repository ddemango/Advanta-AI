// server/ads-and-tech.ts
import fetch from 'node-fetch';

const TTL_MS = 12 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: string[] }>();

export async function enrichTech(url: string): Promise<string[]> {
  const key = `tech:${url}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

  const arr: string[] = [];
  const wapps = await callWappalyzer(url);
  const bwith = await callBuiltWith(url);
  const merged = Array.from(new Set([...wapps, ...bwith])).filter(Boolean);

  cache.set(key, { at: Date.now(), data: merged });
  return merged;
}

async function callWappalyzer(url: string): Promise<string[]> {
  const base = process.env.WAPPALYZER_API_BASE;
  const key = process.env.WAPPALYZER_API_KEY;
  if (!base || !key) return [];
  try {
    const r = await fetch(`${base}/lookup/?urls=${encodeURIComponent(url)}`, {
      headers: { 'x-api-key': key as string },
    });
    if (!r.ok) return [];
    const json: any = await r.json();
    const names = new Set<string>();
    Object.values<any>(json).forEach((apps) => (apps || []).forEach((a: any) => names.add(a.name)));
    return Array.from(names);
  } catch { return []; }
}

async function callBuiltWith(url: string): Promise<string[]> {
  const base = process.env.BUILTWITH_API_BASE;
  const key = process.env.BUILTWITH_API_KEY;
  if (!base || !key) return [];
  try {
    const r = await fetch(`${base}/v20/api.json?KEY=${key}&LOOKUP=${encodeURIComponent(url)}`);
    if (!r.ok) return [];
    const json: any = await r.json();
    const names = new Set<string>();
    (json?.Results || []).forEach((res: any) =>
      (res?.Result?.Paths || []).forEach((p: any) =>
        (p?.Technologies || []).forEach((t: any) => names.add(t.Name))
      )
    );
    return Array.from(names);
  } catch { return []; }
}

// ---------- Ad Libraries ----------

type SocialMap = { facebook?: string; instagram?: string; tiktok?: string; twitter?: string; youtube?: string; linkedin?: string; };

export type AdLibraryLink = {
  platform: 'meta' | 'tiktok' | 'google' | 'linkedin';
  label: string;
  url: string;
  source: 'detected' | 'derived' | 'api';
};

export async function buildAdLibraryLinks(domain: string, socials: SocialMap = {}): Promise<AdLibraryLink[]> {
  const brand = deriveBrandFromDomain(domain);
  const links: AdLibraryLink[] = [];

  // META: Facebook/Instagram
  const pageId = await resolveMetaPageId(socials.facebook || socials.instagram, brand);
  if (pageId) {
    links.push({
      platform: 'meta',
      label: 'Meta Ad Library',
      url: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&view_all_page_id=${encodeURIComponent(pageId)}`,
      source: 'api',
    });
  } else {
    const q = encodeURIComponent(socials.facebook || socials.instagram || brand);
    links.push({
      platform: 'meta',
      label: 'Meta Ad Library (search)',
      url: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&search_type=page&media_type=all&q=${q}`,
      source: socials.facebook || socials.instagram ? 'detected' : 'derived',
    });
  }

  // TIKTOK: Creative Center ads search
  const tk = handleFromUrl(socials.tiktok);
  links.push({
    platform: 'tiktok',
    label: 'TikTok Creative Center (ads)',
    url: `https://ads.tiktok.com/business/creativecenter/pc/en/ads/analysis?keyword=${encodeURIComponent(tk || brand)}`,
    source: tk ? 'detected' : 'derived',
  });

  // GOOGLE Ads Transparency Center
  links.push({
    platform: 'google',
    label: 'Google Ads Transparency Center',
    url: `https://adstransparency.google.com/?search=${encodeURIComponent(brand)}`,
    source: 'derived',
  });

  // LINKEDIN (ad library exists but is limited; provide search)
  const li = handleFromUrl(socials.linkedin);
  links.push({
    platform: 'linkedin',
    label: 'LinkedIn Ad Library (search)',
    url: `https://www.linkedin.com/ad-library/search?keywords=${encodeURIComponent(li || brand)}`,
    source: li ? 'detected' : 'derived',
  });

  return links;
}

function deriveBrandFromDomain(domain: string) {
  return domain.replace(/^www\./i, '').split('.')[0];
}

function handleFromUrl(url?: string) {
  if (!url) return '';
  try {
    const u = new URL(url);
    // tiktok.com/@handle or linkedin.com/company/handle
    const parts = u.pathname.split('/').filter(Boolean);
    if (u.hostname.includes('tiktok.com') && parts[0] === '@') return parts[1] || '';
    return parts[parts.length - 1] || '';
  } catch { return ''; }
}

async function resolveMetaPageId(socialUrl?: string, fallbackBrand?: string): Promise<string | null> {
  const token = process.env.META_GRAPH_TOKEN;
  const base = process.env.META_GRAPH_API || 'https://graph.facebook.com/v19.0';
  if (!token) return null;

  try {
    // If a facebook page link is provided, try to resolve id via Graph
    if (socialUrl?.includes('facebook.com')) {
      const q = new URLSearchParams({ id: socialUrl, access_token: token });
      const r = await fetch(`${base}/?${q.toString()}`);
      const j: any = await r.json();
      return j?.id || null;
    }

    // Otherwise search pages by name (approx)
    if (fallbackBrand) {
      const q = new URLSearchParams({ access_token: token, type: 'page', q: fallbackBrand });
      const r = await fetch(`${base}/search?${q.toString()}`);
      const j: any = await r.json();
      const first = j?.data?.[0];
      return first?.id || null;
    }
  } catch {}
  return null;
}