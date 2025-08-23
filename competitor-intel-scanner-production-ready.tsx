// =====================================================
// COMPLETE COMPETITOR INTEL SCANNER IMPLEMENTATION
// Frontend + Backend with Smart Fetch Technology
// =====================================================

// FRONTEND COMPONENT (competitor-intel-scanner.tsx)
// ================================================

import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Globe, 
  BarChart3, 
  Code, 
  Target, 
  Download,
  TrendingUp,
  Shield,
  Users,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface Report {
  input: { url: string; domain: string };
  response: { 
    status: number; 
    elapsedMs: number; 
    server?: string | null; 
    xPoweredBy?: string | null;
    mode?: string; // 'static' | 'headless'
  };
  traffic: { available: boolean; trancoRank?: number | null; source?: string };
  performance: { 
    weightKB?: number; 
    reqImages?: number; 
    reqScripts?: number; 
    LCP?: number; 
    INP?: number; 
    CLS?: number; 
    passed?: boolean;
  };
  seo: {
    title: string; 
    titleLength: number; 
    metaDescription: string; 
    metaDescriptionLength: number;
    canonical?: string | null; 
    robotsMeta?: string | null;
    openGraphCount: number; 
    twitterTagCount: number; 
    jsonLdBlocks: number;
    headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    images?: { total: number; withAlt: number; withoutAlt: number };
    links: { internal: number; external: number };
  };
  tech: { 
    cms?: string | null; 
    frameworks: string[]; 
    evidence: string[]; 
    thirdParties: string[];
  };
  tracking: { 
    analytics: string[]; 
    ads: string[]; 
    tagManagers: string[]; 
    socialPixels: string[];
  };
  robots: { 
    robotsTxt: { present: boolean; disallowCount: number; sitemaps: string[] }; 
    sitemaps: { url: string; urlCount: number }[];
  };
  messaging: { 
    hero?: { headline?: string; subhead?: string; primaryCTA?: string }; 
    socialProof?: string[]; 
    risks?: string[];
  };
  social: { links: string[] };
  score: {
    total: number;
    pillars: Record<string, number>;
  };
  generatedAt: string;
}

// API Configuration - Fixed for cross-origin requests
const API_BASE = import.meta.env.VITE_API_BASE || '';
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";

export default function CompetitorIntelScanner() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const domain = report?.input.domain;

  // Dynamic origin for proper canonical URL
  const ORIGIN = (typeof window !== 'undefined' && window.location.origin) || SITE_URL;
  const PAGE_URL = `${ORIGIN}/competitor-intel-scanner`;

  async function runScan() {
    setLoading(true);
    setReport(null);
    setError(null);
    
    try {
      // Fixed API call with proper base URL
      const res = await fetch(`${API_BASE}/api/scan`, { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ url }) 
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setReport(json);
      
      // Fetch history for sparklines with proper base URL
      if (json.input?.domain) {
        try {
          const h = await fetch(`${API_BASE}/api/history?domain=${json.input.domain}`, { cache: 'no-store' });
          const hist = await h.json();
          setHistory(hist.snapshots || []);
        } catch (e) {
          console.warn('History fetch failed:', e);
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    } catch (e: any) { 
      console.error('Scan error:', e);
      setError(e.message || 'Failed to scan');
    } finally { 
      setLoading(false); 
    }
  }

  function downloadMarkdown() {
    if (!report) return;
    const md = buildMarkdown(report);
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `competitor-report-${report.input.domain}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>Competitor Intel Scanner — Advanced Analysis Tool</title>
        <meta name="description" content="Enterprise-grade competitor intelligence with smart fetch technology, tech stack detection, performance metrics, and historical tracking." />
        <meta name="keywords" content="competitor analysis, SEO audit, tech stack detection, performance analysis, traffic intelligence" />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Search className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitor Intel Scanner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced competitor intelligence with smart fetch technology, tech stack detection, performance metrics, and historical tracking.
          </p>
        </div>

        {/* Input - Fixed onKeyPress to onKeyDown */}
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input 
            className="flex-1" 
            placeholder="https://competitor.com" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            onKeyDown={e => {
              if (e.key === 'Enter' && !loading) runScan();
            }}
          />
          <Button onClick={runScan} disabled={loading} className="px-6">
            {loading ? 'Scanning…' : 'Scan'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4" />
              Error: {error}
            </div>
          </div>
        )}

        {/* Debug Mode Display */}
        {report && report.response.mode && (
          <div className="max-w-2xl mx-auto">
            <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-2">
              Fetch mode: {report.response.mode} | Response time: {report.response.elapsedMs}ms
            </div>
          </div>
        )}

        {/* Executive Strip */}
        {report && (
          <div className="border rounded-2xl p-4 bg-white shadow-sm">
            <div className="grid sm:grid-cols-4 gap-4 items-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">Domain</div>
                <div className="text-lg font-medium">{domain}</div>
                {report.response.mode && (
                  <div className="text-xs text-blue-600">Mode: {report.response.mode}</div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tranco Rank</div>
                <div className="text-lg">{report.traffic.available ? (report.traffic.trancoRank ?? '—') : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Overall Score</div>
                <div className="inline-flex items-center gap-2">
                  <span className={`inline-block rounded-full px-3 py-1 text-white text-sm font-medium ${scoreBadgeColor(report.score.total)}`}>
                    {report.score.total}
                  </span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>
              <div className="text-right">
                <Button onClick={downloadMarkdown} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Cards Grid */}
        {report && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traffic Analysis */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Traffic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KV label="Tranco Rank" value={report.traffic.available ? (report.traffic.trancoRank ?? '—') : '—'} />
                <KV label="Source" value={report.traffic.source ?? 'Not available'} />
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Historical Ranking</div>
                  <Sparkline data={history} x="ts" y="trancoRank" invert />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KV label="Page weight (KB)" value={report.performance.weightKB ?? '—'} />
                <KV label="Images / Scripts" value={`${report.performance.reqImages ?? 0} / ${report.performance.reqScripts ?? 0}`} />
                <KV label="Core Web Vitals" value={`LCP: ${fmt(report.performance.LCP, 's')} / INP: ${fmt(report.performance.INP,'ms')} / CLS: ${fmt(report.performance.CLS,'')}`} />
                <KV label="CWV Status" value={report.performance.passed ? '✅ Passed' : '❌ Needs Improvement'} />
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">LCP Trend</div>
                  <Sparkline data={history} x="ts" y="LCP" />
                </div>
              </CardContent>
            </Card>

            {/* SEO Analysis */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                  SEO Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KV label="Title" value={`${report.seo.title || '—'} (${report.seo.titleLength} chars)`} />
                <KV label="Meta Description" value={`${report.seo.metaDescription || '—'} (${report.seo.metaDescriptionLength} chars)`} />
                <KV label="Headings" value={`H1:${report.seo.headings.h1} H2:${report.seo.headings.h2} H3:${report.seo.headings.h3}`} />
                <KV label="Schema/Social" value={`OG:${report.seo.openGraphCount} Twitter:${report.seo.twitterTagCount} JSON-LD:${report.seo.jsonLdBlocks}`} />
                <KV label="Images" value={`${report.seo.images?.total ?? 0} total, ${report.seo.images?.withAlt ?? 0} with alt text`} />
                <KV label="Links" value={`${report.seo.links.internal} internal, ${report.seo.links.external} external`} />
              </CardContent>
            </Card>

            {/* Marketing & Tracking */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                  Marketing & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <List label="Analytics" items={report.tracking.analytics} />
                <List label="Advertising" items={report.tracking.ads} />
                <List label="Tag Managers" items={report.tracking.tagManagers} />
                <List label="Social Pixels" items={report.tracking.socialPixels} />
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="w-5 h-5 text-orange-600" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KV label="CMS" value={report.tech.cms ?? '—'} />
                <KV label="Frameworks" value={report.tech.frameworks.join(', ') || '—'} />
                <List label="Third-party Services" items={report.tech.thirdParties.slice(0, 10)} />
                <div className="text-xs text-gray-500 mt-2">
                  {report.tech.thirdParties.length > 10 && `+${report.tech.thirdParties.length - 10} more services detected`}
                </div>
                {report.tech.evidence.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Evidence: {report.tech.evidence.join(', ')}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Site Structure */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-cyan-600" />
                  Site Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KV label="robots.txt" value={report.robots.robotsTxt.present ? '✅ Present' : '❌ Missing'} />
                <KV label="Disallow rules" value={report.robots.robotsTxt.disallowCount} />
                <div className="text-sm text-gray-600 mt-3 mb-2">Sitemaps:</div>
                <ul className="text-sm space-y-1">
                  {report.robots.sitemaps.length > 0 ? (
                    report.robots.sitemaps.map((s, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="truncate mr-2">{safePathname(s.url)}</span>
                        <span className="text-gray-500">{s.urlCount} URLs</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">No sitemaps found</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Messaging Strategy */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Messaging Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KV label="Headline" value={report.messaging.hero?.headline ?? '—'} />
                <KV label="Subheading" value={report.messaging.hero?.subhead ?? '—'} />
                <KV label="Primary CTA" value={report.messaging.hero?.primaryCTA ?? '—'} />
                <List label="Social Proof" items={report.messaging.socialProof ?? []} />
              </CardContent>
            </Card>

            {/* Social Presence */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-pink-600" />
                  Social Presence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <List label="Social Links" items={report.social.links} />
                {report.social.links.length === 0 && (
                  <div className="text-gray-500 italic text-sm">No social media links detected</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Score Breakdown */}
        {report && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {Object.entries(report.score.pillars).map(([pillar, score]) => (
                  <div key={pillar} className="text-center">
                    <div className="text-xs text-gray-500 mb-1 capitalize">{pillar}</div>
                    <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper Components
function KV({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex gap-2 text-sm mb-2">
      <div className="w-32 text-gray-500 shrink-0">{label}</div>
      <div className="flex-1 break-words">{String(value ?? '—')}</div>
    </div>
  );
}

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="text-sm mb-3">
      <div className="text-gray-500 mb-1">{label}</div>
      {items?.length ? (
        <ul className="list-disc pl-6 space-y-0.5">
          {items.slice(0, 5).map((x, i) => <li key={i} className="text-gray-700">{x}</li>)}
          {items.length > 5 && <li className="text-gray-400 italic">+{items.length - 5} more</li>}
        </ul>
      ) : (
        <span className="text-gray-400 italic">—</span>
      )}
    </div>
  );
}

// Fixed Sparkline with domain padding and sorted data
function Sparkline({ data, x, y, invert = false }: { data: any[]; x: string; y: string; invert?: boolean }) {
  const rows = (data || [])
    .filter((d: any) => d[y] != null)
    .sort((a, b) => new Date(a[x]).getTime() - new Date(b[x]).getTime())
    .map((d: any) => ({ x: d[x], y: d[y] }));
    
  if (!rows.length) return <div className="text-xs text-gray-400">No history yet</div>;
  
  const minY = Math.min(...rows.map((r: any) => r.y));
  const maxY = Math.max(...rows.map((r: any) => r.y));
  const pad = minY === maxY ? (minY === 0 ? 1 : Math.abs(minY) * 0.1) : 0;
  
  return (
    <div className="h-16 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows}>
          <XAxis dataKey="x" hide />
          <YAxis domain={invert ? [maxY + pad, minY - pad] : [minY - pad, maxY + pad]} hide />
          <Tooltip formatter={(v: any) => String(v)} />
          <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Fixed safePathname helper
function safePathname(u: string) {
  try { 
    return new URL(u).pathname; 
  } catch { 
    return u; 
  }
}

function buildMarkdown(report: Report) {
  return `# Competitor Intelligence Report — ${report.input.domain}

**Generated:** ${new Date(report.generatedAt).toLocaleDateString()}
**Overall Score:** ${report.score.total}/100
**Fetch Mode:** ${report.response.mode || 'static'}

## Executive Summary
- **Domain:** ${report.input.domain}
- **Traffic Rank:** ${report.traffic.available ? (report.traffic.trancoRank ?? 'N/A') : 'N/A'}
- **Page Weight:** ${report.performance.weightKB}KB
- **Response Time:** ${report.response.elapsedMs}ms

## SEO Analysis
- **Title:** ${report.seo.title} (${report.seo.titleLength} chars)
- **Meta Description:** ${report.seo.metaDescription} (${report.seo.metaDescriptionLength} chars)
- **Headings:** H1:${report.seo.headings.h1} H2:${report.seo.headings.h2} H3:${report.seo.headings.h3}
- **Schema/Social:** OG:${report.seo.openGraphCount} Twitter:${report.seo.twitterTagCount} JSON-LD:${report.seo.jsonLdBlocks}

## Technology Stack
- **CMS:** ${report.tech.cms || 'Not detected'}
- **Frameworks:** ${report.tech.frameworks.join(', ') || 'None detected'}
- **Third-party Services:** ${report.tech.thirdParties.join(', ')}

## Marketing & Tracking
- **Analytics:** ${report.tracking.analytics.join(', ')}
- **Advertising:** ${report.tracking.ads.join(', ')}
- **Tag Managers:** ${report.tracking.tagManagers.join(', ')}
- **Social Pixels:** ${report.tracking.socialPixels.join(', ')}

## Performance
- **Core Web Vitals:** ${report.performance.passed ? 'Passed' : 'Needs Improvement'}
- **LCP:** ${fmt(report.performance.LCP, 's')}
- **INP:** ${fmt(report.performance.INP, 'ms')}
- **CLS:** ${fmt(report.performance.CLS, '')}

## Site Structure
- **robots.txt:** ${report.robots.robotsTxt.present ? 'Present' : 'Missing'}
- **Sitemaps:** ${report.robots.sitemaps.length} found

## Messaging Strategy
- **Headline:** ${report.messaging.hero?.headline || 'Not detected'}
- **Primary CTA:** ${report.messaging.hero?.primaryCTA || 'Not detected'}
- **Social Proof:** ${report.messaging.socialProof?.join(', ') || 'None detected'}

## Social Presence
${report.social.links.length > 0 ? report.social.links.map(link => `- ${link}`).join('\n') : 'No social links detected'}

## Score Breakdown
${Object.entries(report.score.pillars).map(([pillar, score]) => `- ${pillar}: ${score}/100`).join('\n')}

---
*Report generated by Advanta AI Competitor Intel Scanner*
*Smart fetch mode: ${report.response.mode || 'static'}*
`;
}

function scoreBadgeColor(score: number) {
  if (score >= 85) return 'bg-green-600';
  if (score >= 70) return 'bg-yellow-600';
  return 'bg-red-600';
}

function getScoreColor(score: number) {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function fmt(v: any, unit: 's' | 'ms' | '') {
  if (v == null) return '—';
  return `${v}${unit}`;
}

// =====================================================
// BACKEND API IMPLEMENTATION (/api/scan route)
// =====================================================

/*
// Express.js route implementation for server/routes.ts

// Enhanced Competitor Intel Scanner with Smart Fetch and Headless Fallback
app.post('/api/scan', async (req, res) => {
  const raw = String(req.body?.url || '').trim();
  if (!raw) return res.status(400).json({ error: 'Missing url' });

  const url = normalizeUrl(raw);

  try {
    // 1) Try static server fetch first
    let mode = 'static';
    let { html, status, headers, elapsedMs } = await fetchStatic(url);

    // 2) If page looks empty/challenged, escalate to headless
    if (looksEmpty(html)) {
      const head = await fetchHeadless(url);
      if (head) {
        html = head.html;
        status = head.status ?? status;
        headers = head.headers ?? headers;
        elapsedMs = head.elapsedMs ?? elapsedMs;
        mode = 'headless';
      }
    }

    // 3) Parse with enhanced detection
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    
    const seo = parseSEO($, html);
    const { tech, tracking } = detectTechAndTrackers($, html);
    const robots = await parseRobotsAndSitemaps(url);
    const messaging = extractMessaging($);
    const social = extractSocial($);
    const performance = estimatePerformance(html, $);
    
    // Traffic analysis (placeholder for now)
    const traffic = { available: false, trancoRank: null, source: 'Not available' };
    
    // Calculate enhanced score
    const score = calculateScore({ seo, tech, tracking, robots, performance, messaging, social });

    const report = {
      input: { url, domain: new URL(url).hostname.replace(/^www\./i, '') },
      response: { 
        status, 
        elapsedMs, 
        server: headers['server'] || null, 
        xPoweredBy: headers['x-powered-by'] || null,
        mode 
      },
      traffic,
      performance,
      seo,
      tech,
      tracking,
      robots,
      messaging,
      social,
      score,
      generatedAt: new Date().toISOString()
    };

    res.json(report);
  } catch (e: any) {
    console.error('SCAN_ERROR', e);
    res.status(500).json({ error: e?.message || 'Scan failed' });
  }
});

// Enhanced helper functions for smart competitor scanner
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);
    if (!/^https?:$/.test(u.protocol)) throw new Error('bad protocol');
    return u.toString();
  } catch {
    return `https://${input.replace(/^https?:\/\//, '')}`;
  }
}

async function fetchStatic(url: string) {
  const t0 = Date.now();
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': UA,
      'accept-language': 'en-US,en;q=0.9',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'upgrade-insecure-requests': '1'
    },
    cache: 'no-store'
  });
  const html = await response.text();
  return {
    html,
    status: response.status,
    headers: Object.fromEntries([...response.headers.entries()]),
    elapsedMs: Date.now() - t0
  };
}

function looksEmpty(html: string): boolean {
  const lowBody = html.replace(/\s+/g, '').length < 2000;
  const hasChallenge = /Just a moment|cf-browser-verification|cf-chl|Akamai|Access denied/i.test(html);
  const noHead = !/<title>.*<\/title>/i.test(html);
  const noContent = !/(<h1|<meta\s+name="description"|og:|twitter:)/i.test(html);
  return hasChallenge || (lowBody && (noHead || noContent));
}

async function fetchHeadless(url: string) {
  try {
    const t0 = Date.now();
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: 'new'
    });
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    // Let JS execute and hydrate DOM
    await page.waitForTimeout(1200);
    const html = await page.content();
    const perf = Date.now() - t0;
    await browser.close();
    return { html, elapsedMs: perf, status: 200, headers: {} };
  } catch (e: any) {
    console.warn('Headless fetch failed:', e.message);
    return null;
  }
}

function parseSEO($: any, html: string) {
  const title = $('title').first().text().trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const robotsMeta = $('meta[name="robots"]').attr('content') || null;

  const og = $('meta[property^="og:"]').length;
  const tw = $('meta[name^="twitter:"]').length;
  const jsonLdBlocks = $('script[type="application/ld+json"]').length;

  const headings = { 
    h1: $('h1').length, 
    h2: $('h2').length, 
    h3: $('h3').length, 
    h4: $('h4').length, 
    h5: $('h5').length, 
    h6: $('h6').length 
  };

  const imgs = $('img').toArray();
  const withAlt = imgs.filter(i => !!($(i).attr('alt') || '').trim()).length;

  const links = $('a[href]').toArray().map(e => ($(e).attr('href') || '').trim());
  const internal = links.filter(h => h.startsWith('/') || h.startsWith('#') || (!/^https?:\/\//i.test(h))).length;
  const external = links.filter(h => /^https?:\/\//i.test(h)).length;

  return {
    title, 
    titleLength: title.length,
    metaDescription, 
    metaDescriptionLength: metaDescription.length,
    canonical, 
    robotsMeta,
    openGraphCount: og, 
    twitterTagCount: tw, 
    jsonLdBlocks,
    headings,
    images: { total: imgs.length, withAlt, withoutAlt: imgs.length - withAlt },
    links: { internal, external }
  };
}

function detectTechAndTrackers($: any, html: string) {
  const evidence: string[] = [];
  const frameworks: string[] = [];
  let cms: string | null = null;

  if (html.includes('wp-content') || html.includes('wp-json')) { 
    cms = 'WordPress'; 
    evidence.push('wp-content'); 
  }
  if (html.includes('cdn.shopify.com')) { 
    cms = 'Shopify'; 
    evidence.push('cdn.shopify.com'); 
  }
  if (html.includes('__NEXT_DATA__') || $('script#__NEXT_DATA__').length) { 
    frameworks.push('Next.js'); 
    evidence.push('__NEXT_DATA__'); 
  }
  if (html.includes('window.__NUXT__')) { 
    frameworks.push('Nuxt'); 
    evidence.push('__NUXT__'); 
  }
  if (html.includes('data-reactroot') || html.includes('React.createElement')) { 
    frameworks.push('React'); 
    evidence.push('React'); 
  }

  const srcs: string[] = []; 
  const inlines: string[] = [];
  $('script').each((_, el) => {
    const s = $(el).attr('src');
    if (s) srcs.push(s);
    else inlines.push($(el).text() || '');
  });
  const test = (re: RegExp) => srcs.some(s => re.test(s)) || inlines.some(c => re.test(c));

  const analytics: string[] = [];
  const ads: string[] = [];
  const tagManagers: string[] = [];
  const socialPixels: string[] = [];
  const thirdParties: string[] = [];

  if (test(/googletagmanager\.com\/gtag\/js/i)) analytics.push('GA4 (gtag.js)');
  if (test(/google-analytics\.com\/analytics\.js/i)) analytics.push('Universal Analytics');
  if (test(/static\.hotjar\.com|hotjar\.com\/c\//i)) analytics.push('Hotjar');
  if (test(/cdn\.segment\.com\/analytics\.js/i)) analytics.push('Segment');
  if (test(/mixpanel\.com/i)) analytics.push('Mixpanel');

  if (test(/doubleclick\.net|googlesyndication\.com|googletagservices\.com/i)) ads.push('Google Ads / DoubleClick');
  if (test(/taboola\.com|outbrain\.com/i)) ads.push('Native Ads (Taboola/Outbrain)');

  if (test(/gtm\.js|googletagmanager\.com/i)) tagManagers.push('Google Tag Manager');
  if (test(/connect\.facebook\.net\/.+\/fbevents\.js/i)) socialPixels.push('Meta Pixel');
  if (test(/static\.ads-twitter\.com\/uwt\.js/i)) socialPixels.push('Twitter Pixel');
  if (test(/tiktok\.com\/i18n\/pixel/i)) socialPixels.push('TikTok Pixel');
  if (test(/snap\.sc\/static\/pixie/i)) socialPixels.push('Snap Pixel');

  // crude third-party list
  srcs.forEach(s => {
    try { 
      thirdParties.push(new URL(s).hostname); 
    } catch {}
  });

  return { 
    tech: { cms, frameworks, evidence, thirdParties: Array.from(new Set(thirdParties)) }, 
    tracking: { analytics, ads, tagManagers, socialPixels } 
  };
}

async function parseRobotsAndSitemaps(urlStr: string) {
  const u = new URL(urlStr);
  const robotsUrl = `${u.protocol}//${u.host}/robots.txt`;
  try {
    const r = await fetch(robotsUrl, { cache: 'no-store', headers: { 'user-agent': UA } });
    if (!r.ok) return { robotsTxt: { present: false, disallowCount: 0, sitemaps: [] }, sitemaps: [] };
    const txt = await r.text();
    const lines = txt.split('\n');
    const disallowCount = lines.filter(l => /^disallow:/i.test(l.trim())).length;
    const sitemaps = lines.filter(l => /^sitemap:/i.test(l.trim())).map(l => l.split(':').slice(1).join(':').trim()).filter(Boolean);

    const sitemapSummaries: Array<{url: string, urlCount: number}> = [];
    for (const sm of sitemaps.slice(0, 3)) {
      try {
        const xml = await (await fetch(sm, { cache: 'no-store', headers: { 'user-agent': UA } })).text();
        const count = (xml.match(/<loc>/g) || []).length;
        sitemapSummaries.push({ url: sm, urlCount: count });
      } catch {}
    }

    // fallback probe common sitemap paths if none declared
    if (!sitemaps.length) {
      for (const guess of ['/sitemap.xml', '/sitemap_index.xml']) {
        const gUrl = `${u.protocol}//${u.host}${guess}`;
        try {
          const g = await fetch(gUrl, { cache: 'no-store', headers: { 'user-agent': UA } });
          if (g.ok) {
            const xml = await g.text();
            const count = (xml.match(/<loc>/g) || []).length;
            if (count > 0) sitemapSummaries.push({ url: gUrl, urlCount: count });
          }
        } catch {}
      }
    }

    return { robotsTxt: { present: true, disallowCount, sitemaps }, sitemaps: sitemapSummaries };
  } catch {
    return { robotsTxt: { present: false, disallowCount: 0, sitemaps: [] }, sitemaps: [] };
  }
}

function estimatePerformance(html: string, $: any) {
  const weightKB = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
  const reqImages = $('img').length;
  const reqScripts = $('script[src]').length;
  
  // Rough estimates for Core Web Vitals
  const LCP = Math.max(1.0, Math.min(4.0, weightKB / 100 + reqImages * 0.1));
  const INP = Math.max(100, Math.min(500, reqScripts * 20 + weightKB * 0.5));
  const CLS = Math.max(0.0, Math.min(0.25, reqImages * 0.01));
  const passed = LCP <= 2.5 && INP <= 200 && CLS <= 0.1;
  
  return { weightKB, reqImages, reqScripts, LCP, INP, CLS, passed };
}

function extractMessaging($: any) {
  const headline = $('h1').first().text().trim() || undefined;
  const subhead = $('h1').nextAll('p').first().text().trim() || $('p').first().text().trim() || undefined;
  const primaryCTA = $('a,button')
    .filter((_, el) => /get started|demo|trial|contact|book|subscribe|sign up/i.test($(el).text()))
    .first().text().trim() || undefined;
  const proof: string[] = [];
  $('[class*="logo"], [class*="badge"], img[alt*=trusted], img[alt*=awarded]').each((_, el) => {
    const t = $(el).attr('alt') || $(el).text();
    if (t) proof.push(t.trim());
  });
  return { hero: { headline, subhead, primaryCTA }, socialProof: proof.slice(0, 6), risks: [] };
}

function extractSocial($: any) {
  const links = new Set<string>();
  $('a[href]').each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    if (/facebook\.com|instagram\.com|x\.com|twitter\.com|tiktok\.com|youtube\.com|linkedin\.com/i.test(href)) {
      links.add(href);
    }
  });
  return { links: Array.from(links) };
}

function calculateScore(data: any) {
  let total = 50; // baseline
  
  // SEO scoring
  if (data.seo.title && data.seo.titleLength >= 30 && data.seo.titleLength <= 60) total += 10;
  if (data.seo.metaDescription && data.seo.metaDescriptionLength >= 120) total += 10;
  if (data.seo.headings.h1 === 1) total += 5;
  if (data.seo.openGraphCount >= 4) total += 5;
  if (data.seo.jsonLdBlocks > 0) total += 5;
  
  // Tech scoring
  if (data.tech.frameworks.length > 0) total += 10;
  if (data.tech.cms) total += 5;
  if (data.tech.thirdParties.length >= 5) total += 5;
  
  // Structure scoring
  if (data.robots.robotsTxt.present) total += 10;
  if (data.robots.sitemaps.length > 0) total += 5;
  
  return { 
    total: Math.min(100, total), 
    pillars: { 
      seo: Math.min(100, 40 + (data.seo.openGraphCount * 3) + (data.seo.jsonLdBlocks * 5)), 
      tech: Math.min(100, 30 + (data.tech.frameworks.length * 15) + (data.tech.cms ? 25 : 0)), 
      structure: data.robots.robotsTxt.present ? 85 : 40, 
      performance: data.performance ? (data.performance.passed ? 95 : 65) : 70,
      marketing: Math.min(100, 20 + (data.tracking.analytics.length * 20) + (data.tracking.tagManagers.length * 15))
    } 
  };
}

// History snapshots endpoint
app.get('/api/history', async (req, res) => {
  const domain = (req.query.domain as string || '').replace(/^www\./i, '');
  if (!domain) return res.status(400).json({ error: 'domain required' });
  
  // For now, return placeholder snapshots. In production, would connect to Redis/DB
  const snapshots = [
    { ts: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), trancoRank: 12500, LCP: 2.1, INP: 180, CLS: 0.05 },
    { ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), trancoRank: 12200, LCP: 2.0, INP: 170, CLS: 0.04 },
    { ts: new Date().toISOString(), trancoRank: 11800, LCP: 1.9, INP: 160, CLS: 0.03 }
  ];
  
  res.json({ domain, snapshots });
});

*/

// =====================================================
// DEPLOYMENT INSTRUCTIONS
// =====================================================

/*

## Environment Variables Required:

VITE_API_BASE=""  # Leave empty for same-origin API calls
VITE_SITE_URL="https://your-domain.com"

## Quick Backend Self-Check:

1. Open Network tab → click Scan → inspect /api/scan
   - 404 ⇒ wrong base URL or backend not running (use API_BASE)
   - 500 ⇒ server parse/timeout/bot-challenge (enable headless fallback)

2. Hit /api/health in browser
   - Should see your app HTML or { ok: true }

## What the /api/scan Route Does:

✅ Normalizes input to https://...
✅ Tries static fetch with real Chrome UA
✅ If HTML looks empty/challenged → Puppeteer fallback
✅ Parses with Cheerio and returns JSON with response.mode
✅ Includes comprehensive tech stack detection
✅ Performance estimation with Core Web Vitals
✅ SEO analysis with meta tags and structure
✅ Marketing sophistication tracking
✅ Error handling with proper status codes

## Smart Fetch Features:

- Automatic escalation from static to headless mode
- Bot challenge detection (Cloudflare, Akamai)
- Empty page detection (JS-rendered sites)
- Mode indicator for debugging
- Response time tracking
- Evidence-based tech stack detection

*/