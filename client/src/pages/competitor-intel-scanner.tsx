import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Globe, 
  BarChart3, 
  Code, 
  Target, 
  FileText, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ScanResult {
  input: { url: string; domain: string };
  response: { status: number; elapsedMs: number; server?: string; xPoweredBy?: string };
  seo: {
    title: string;
    titleLength: number;
    metaDescription: string;
    metaDescriptionLength: number;
    canonical?: string;
    robotsMeta?: string;
    openGraphCount: number;
    twitterTagCount: number;
    jsonLdBlocks: number;
    headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    images: { total: number; withAlt: number; withoutAlt: number };
    links: { internal: number; external: number };
  };
  tech: { cms?: string; frameworks: string[]; evidence: string[] };
  tracking: {
    analytics: string[];
    ads: string[];
    tagManagers: string[];
    socialPixels: string[];
  };
  robots: {
    robotsTxt: { present: boolean; disallowCount: number; sitemaps: string[] };
    sitemaps: Array<{ url: string; urlCount: number }>;
  };
  traffic: { available: boolean; trancoRank?: number; source?: string };
  domain: { available: boolean; created?: string; ageDays?: number; source?: string };
  recommendations: string[];
  generatedAt: string;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";
const PAGE_URL = `${SITE_URL}/competitor-intel-scanner`;

export default function CompetitorIntelScanner() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onScan() {
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const res = await fetch('/api/competitor-intel/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Scan failed');
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadMarkdown() {
    if (!data) return;
    const md = buildMarkdown(data);
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `competitor-intel-${data.input.domain}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      onScan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>Competitor Intel Scanner — Advanta AI</title>
        <meta name="description" content="Drop in a URL and get instant competitor intelligence: SEO analysis, tech stack detection, marketing tools, and actionable recommendations." />
        <meta name="keywords" content="competitor analysis, SEO audit, tech stack detection, marketing intelligence, website analysis" />
        <link rel="canonical" href={PAGE_URL} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content="Competitor Intel Scanner — Advanta AI" />
        <meta property="og:description" content="Instant competitor intelligence: SEO, tech stack, marketing tools analysis" />
        <meta property="og:site_name" content="Advanta AI" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 text-white rounded-full">
              <Search size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Competitor Intel Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Drop in a URL and get instant intelligence: SEO insights, tech stack, marketing tools, and actionable recommendations.
          </p>
        </div>

        {/* Search Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://competitor.com"
                className="flex-1 text-lg"
                disabled={loading}
              />
              <Button 
                onClick={onScan} 
                disabled={loading || !url.trim()}
                className="px-8"
                size="lg"
              >
                {loading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Scan
                  </>
                )}
              </Button>
            </div>
            {loading && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                Analyzing website... This may take up to 30 seconds.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center text-red-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span className="font-medium">Scan Failed:</span>
                <span className="ml-2">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Report Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <Globe className="mr-3 h-6 w-6 text-blue-500" />
                      {data.input.domain}
                    </CardTitle>
                    <p className="text-gray-500 mt-1">
                      Scanned on {new Date(data.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={downloadMarkdown} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Badge variant={data.response.status === 200 ? "default" : "destructive"}>
                      Status: {data.response.status}
                    </Badge>
                    <span className="ml-2 text-sm text-gray-500">
                      ({data.response.elapsedMs}ms)
                    </span>
                  </div>
                  {data.response.server && (
                    <div className="text-sm">
                      <span className="text-gray-500">Server:</span> {data.response.server}
                    </div>
                  )}
                  {data.response.xPoweredBy && (
                    <div className="text-sm">
                      <span className="text-gray-500">Powered by:</span> {data.response.xPoweredBy}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SEO Analysis */}
              <Section title="SEO Analysis" icon={BarChart3}>
                <MetricRow label="Title" value={`${data.seo.title || '—'}`} subValue={`${data.seo.titleLength} chars`} />
                <MetricRow label="Meta Description" value={`${data.seo.metaDescription || '—'}`} subValue={`${data.seo.metaDescriptionLength} chars`} />
                <MetricRow label="Canonical URL" value={data.seo.canonical || '—'} />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <MetricCard label="Open Graph" value={data.seo.openGraphCount} />
                  <MetricCard label="Twitter Cards" value={data.seo.twitterTagCount} />
                  <MetricCard label="JSON-LD" value={data.seo.jsonLdBlocks} />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Headings Structure</div>
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    {Object.entries(data.seo.headings).map(([tag, count]) => (
                      <div key={tag} className="text-center">
                        <div className="font-medium text-gray-600">{tag.toUpperCase()}</div>
                        <div className={count === 0 ? 'text-gray-400' : (tag === 'h1' && count !== 1) ? 'text-red-500' : 'text-green-600'}>
                          {count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <MetricCard label="Images w/ Alt" value={`${data.seo.images.withAlt}/${data.seo.images.total}`} />
                  <MetricCard label="Links (Int/Ext)" value={`${data.seo.links.internal}/${data.seo.links.external}`} />
                </div>
              </Section>

              {/* Tech Stack */}
              <Section title="Technology Stack" icon={Code}>
                <MetricRow label="CMS" value={data.tech.cms || 'Unknown'} />
                <MetricRow label="Frameworks" value={data.tech.frameworks.join(', ') || 'None detected'} />
                {data.tech.evidence.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Evidence</div>
                    <div className="flex flex-wrap gap-1">
                      {data.tech.evidence.map((ev, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {ev}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {/* Marketing & Tracking */}
              <Section title="Marketing & Tracking" icon={Target}>
                <TrackerSection title="Analytics" items={data.tracking.analytics} />
                <TrackerSection title="Advertising" items={data.tracking.ads} />
                <TrackerSection title="Tag Managers" items={data.tracking.tagManagers} />
                <TrackerSection title="Social Pixels" items={data.tracking.socialPixels} />
              </Section>

              {/* Technical SEO */}
              <Section title="Technical SEO" icon={FileText}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">robots.txt</span>
                  <Badge variant={data.robots.robotsTxt.present ? "default" : "destructive"}>
                    {data.robots.robotsTxt.present ? 'Present' : 'Missing'}
                  </Badge>
                </div>
                {data.robots.robotsTxt.present && (
                  <div className="mb-4">
                    <MetricRow label="Disallow rules" value={data.robots.robotsTxt.disallowCount} />
                    <MetricRow label="Sitemaps declared" value={data.robots.robotsTxt.sitemaps.length} />
                  </div>
                )}
                {data.robots.sitemaps.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Sitemap Analysis</div>
                    {data.robots.sitemaps.map((sitemap, i) => (
                      <div key={i} className="text-xs bg-gray-50 p-2 rounded mb-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{sitemap.urlCount} URLs</span>
                          <a 
                            href={sitemap.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                        <div className="text-gray-500 truncate">{sitemap.url}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>

            {/* Domain & Traffic Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Section title="Domain Information" icon={Globe}>
                <MetricRow 
                  label="Domain Age" 
                  value={data.domain.available ? `${data.domain.ageDays} days` : 'Unknown'} 
                />
                <MetricRow 
                  label="Created" 
                  value={data.domain.available ? new Date(data.domain.created!).toLocaleDateString() : '—'} 
                />
                <MetricRow 
                  label="Source" 
                  value={data.domain.available ? data.domain.source! : '—'} 
                />
              </Section>

              <Section title="Traffic Insights" icon={BarChart3}>
                <MetricRow 
                  label="Tranco Rank" 
                  value={data.traffic.available ? `#${data.traffic.trancoRank?.toLocaleString()}` : 'Not available'} 
                />
                <MetricRow 
                  label="Source" 
                  value={data.traffic.available ? data.traffic.source! : '—'} 
                />
              </Section>
            </div>

            {/* Recommendations */}
            <Section title="Actionable Recommendations" icon={CheckCircle}>
              {data.recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {data.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <AlertCircle className="mr-2 h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="mx-auto h-8 w-8 mb-2" />
                  No critical issues found!
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Icon className="mr-2 h-5 w-5 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, subValue }: { label: string; value: string | number; subValue?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="text-right">
        <div className="text-sm">{value}</div>
        {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function TrackerSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{title}</span>
        <Badge variant={items.length > 0 ? "default" : "secondary"}>
          {items.length}
        </Badge>
      </div>
      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item, i) => (
            <div key={i} className="text-xs bg-gray-50 px-2 py-1 rounded">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-400">None detected</div>
      )}
    </div>
  );
}

function buildMarkdown(data: ScanResult): string {
  return `# Competitor Intelligence Report — ${data.input.domain}

Generated: ${new Date(data.generatedAt).toLocaleString()}
URL: ${data.input.url}

## Overview
- **Status**: ${data.response.status} (${data.response.elapsedMs}ms)
- **Server**: ${data.response.server || '—'}
- **X-Powered-By**: ${data.response.xPoweredBy || '—'}

## Technology Stack
- **CMS**: ${data.tech.cms || 'Unknown'}
- **Frameworks**: ${data.tech.frameworks.join(', ') || 'None detected'}
- **Evidence**: ${data.tech.evidence.join(', ') || 'None'}

## SEO Analysis
- **Title**: ${data.seo.title || '—'} (${data.seo.titleLength} chars)
- **Meta Description**: ${data.seo.metaDescription || '—'} (${data.seo.metaDescriptionLength} chars)
- **Canonical URL**: ${data.seo.canonical || '—'}
- **Open Graph Tags**: ${data.seo.openGraphCount}
- **Twitter Card Tags**: ${data.seo.twitterTagCount}
- **JSON-LD Blocks**: ${data.seo.jsonLdBlocks}

### Heading Structure
- H1: ${data.seo.headings.h1}
- H2: ${data.seo.headings.h2}
- H3: ${data.seo.headings.h3}
- H4: ${data.seo.headings.h4}
- H5: ${data.seo.headings.h5}
- H6: ${data.seo.headings.h6}

### Content Analysis
- **Images**: ${data.seo.images.total} total, ${data.seo.images.withAlt} with alt text, ${data.seo.images.withoutAlt} missing alt text
- **Links**: ${data.seo.links.internal} internal, ${data.seo.links.external} external

## Marketing & Tracking
- **Analytics**: ${data.tracking.analytics.join(', ') || 'None detected'}
- **Advertising**: ${data.tracking.ads.join(', ') || 'None detected'}
- **Tag Managers**: ${data.tracking.tagManagers.join(', ') || 'None detected'}
- **Social Pixels**: ${data.tracking.socialPixels.join(', ') || 'None detected'}

## Technical SEO
- **robots.txt**: ${data.robots.robotsTxt.present ? 'Present' : 'Missing'}
- **Disallow Rules**: ${data.robots.robotsTxt.disallowCount}
- **Declared Sitemaps**: ${data.robots.robotsTxt.sitemaps.length}

${data.robots.sitemaps.length > 0 ? `
### Sitemap Analysis
${data.robots.sitemaps.map(s => `- ${s.url} (${s.urlCount} URLs)`).join('\n')}
` : ''}

## Domain & Traffic
- **Domain Age**: ${data.domain.available ? `${data.domain.ageDays} days` : 'Unknown'}
- **Created**: ${data.domain.available ? data.domain.created : '—'}
- **Tranco Rank**: ${data.traffic.available ? `#${data.traffic.trancoRank?.toLocaleString()}` : 'Not available'}

## Recommendations
${data.recommendations.length > 0 ? data.recommendations.map(r => `- ${r}`).join('\n') : 'No critical issues identified.'}

---
*Report generated by Advanta AI Competitor Intel Scanner*
`;
}