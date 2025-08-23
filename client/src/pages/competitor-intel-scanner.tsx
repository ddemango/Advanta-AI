import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  MessageSquare
} from 'lucide-react';

interface Report {
  input: { url: string; domain: string };
  response: { status: number; elapsedMs: number; server?: string | null; xPoweredBy?: string | null };
  traffic: { available: boolean; trancoRank?: number; source?: string };
  performance: { weightKB?: number; reqImages?: number; reqScripts?: number; LCP?: number; INP?: number; CLS?: number; passed?: boolean };
  seo: {
    title: string; titleLength: number; metaDescription: string; metaDescriptionLength: number;
    canonical?: string | null; robotsMeta?: string | null;
    openGraphCount: number; twitterTagCount: number; jsonLdBlocks: number;
    headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    wordCount?: number;
    images?: { total: number; withAlt: number; withoutAlt: number };
    links: { internal: number; external: number };
  };
  tech: { cms?: string | null; frameworks: string[]; evidence: string[]; thirdParties: string[] };
  tracking: { analytics: string[]; ads: string[]; tagManagers: string[]; socialPixels: string[]; consentMode?: boolean };
  robots: { robotsTxt: { present: boolean; disallowCount: number; sitemaps: string[] }; sitemaps: { url: string; urlCount: number }[] };
  messaging: { hero?: { headline?: string; subhead?: string; primaryCTA?: string }; socialProof?: string[]; risks?: string[] };
  social: { links: string[] };
  score: {
    total: number;
    pillars: Record<string, number>;
  };
  generatedAt: string;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";
const PAGE_URL = `${SITE_URL}/competitor-intel-scanner`;

export default function CompetitorIntelScanner() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const domain = report?.input.domain;

  async function runScan() {
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch('/api/scan', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ url }) 
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Scan failed');
      setReport(json);
      
      // Fetch history for sparklines
      if (json.input?.domain) {
        const h = await fetch(`/api/history?domain=${json.input.domain}`, { cache: 'no-store' });
        const hist = await h.json();
        setHistory(hist.snapshots || []);
      } else setHistory([]);
    } catch (e: any) { 
      console.error(e); 
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
        <meta name="description" content="Enterprise-grade competitor intelligence with traffic analysis, tech stack detection, performance metrics, and historical tracking." />
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
            Advanced competitor intelligence with traffic analysis, performance metrics, tech stack detection, and historical tracking.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input 
            className="flex-1" 
            placeholder="https://competitor.com" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && !loading && runScan()}
          />
          <Button onClick={runScan} disabled={loading} className="px-6">
            {loading ? 'Scanning…' : 'Scan'}
          </Button>
        </div>

        {/* Executive Strip */}
        {report && (
          <div className="border rounded-2xl p-4 bg-white shadow-sm">
            <div className="grid sm:grid-cols-4 gap-4 items-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">Domain</div>
                <div className="text-lg font-medium">{domain}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tranco Rank</div>
                <div className="text-lg">{report.traffic.available ? report.traffic.trancoRank : '—'}</div>
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
                <KV label="Tranco Rank" value={report.traffic.available ? report.traffic.trancoRank : '—'} />
                <KV label="Source" value={report.traffic.source || 'Not available'} />
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
                <KV label="Images" value={`${report.seo.images?.total || 0} total, ${report.seo.images?.withAlt || 0} with alt text`} />
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
                <KV label="CMS" value={report.tech.cms || '—'} />
                <KV label="Frameworks" value={report.tech.frameworks.join(', ') || '—'} />
                <List label="Third-party Services" items={report.tech.thirdParties.slice(0, 10)} />
                <div className="text-xs text-gray-500 mt-2">
                  {report.tech.thirdParties.length > 10 && `+${report.tech.thirdParties.length - 10} more services detected`}
                </div>
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
                        <span className="truncate mr-2">{new URL(s.url).pathname}</span>
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
                <KV label="Headline" value={report.messaging.hero?.headline || '—'} />
                <KV label="Subheading" value={report.messaging.hero?.subhead || '—'} />
                <KV label="Primary CTA" value={report.messaging.hero?.primaryCTA || '—'} />
                <List label="Social Proof" items={report.messaging.socialProof || []} />
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
      </div>
    </div>
  );
}

// Helper Components
function KV({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex gap-2 text-sm mb-2">
      <div className="w-32 text-gray-500 shrink-0">{label}</div>
      <div className="flex-1 break-words">{String(value)}</div>
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

function Sparkline({ data, x, y, invert = false }: { data: any[]; x: string; y: string; invert?: boolean }) {
  const rows = (data || []).filter((d: any) => d[y] != null).map((d: any) => ({ x: d[x], y: d[y] }));
  if (!rows.length) return <div className="text-xs text-gray-400">No history yet</div>;
  
  const minY = Math.min(...rows.map((r: any) => r.y));
  const maxY = Math.max(...rows.map((r: any) => r.y));
  
  return (
    <div className="h-16 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows}>
          <XAxis dataKey="x" hide />
          <YAxis domain={invert ? [maxY, minY] : [minY, maxY]} hide />
          <Tooltip formatter={(v: any) => String(v)} />
          <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function buildMarkdown(report: Report) {
  return `# Competitor Intelligence Report — ${report.input.domain}

**Generated:** ${new Date(report.generatedAt).toLocaleDateString()}
**Overall Score:** ${report.score.total}/100

## Executive Summary
- **Domain:** ${report.input.domain}
- **Traffic Rank:** ${report.traffic.available ? report.traffic.trancoRank : 'N/A'}
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

## Site Structure
- **robots.txt:** ${report.robots.robotsTxt.present ? 'Present' : 'Missing'}
- **Sitemaps:** ${report.robots.sitemaps.length} found

## Messaging Strategy
- **Headline:** ${report.messaging.hero?.headline || 'Not detected'}
- **Primary CTA:** ${report.messaging.hero?.primaryCTA || 'Not detected'}
- **Social Proof:** ${report.messaging.socialProof?.join(', ') || 'None detected'}

## Social Presence
${report.social.links.length > 0 ? report.social.links.map(link => `- ${link}`).join('\n') : 'No social links detected'}

---
*Report generated by Advanta AI Competitor Intel Scanner*
`;
}

function scoreBadgeColor(score: number) {
  if (score >= 85) return 'bg-green-600';
  if (score >= 70) return 'bg-yellow-600';
  return 'bg-red-600';
}

function fmt(v: any, unit: 's' | 'ms' | '') {
  if (v == null) return '—';
  return `${v}${unit}`;
}