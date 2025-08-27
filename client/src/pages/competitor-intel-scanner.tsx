import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, BarChart3, Code, Target, Download, TrendingUp, Shield, Users } from 'lucide-react';

interface Report {
  input: { url: string; domain: string };
  response: { status: number; elapsedMs: number; server?: string; mode?: string };
  traffic: { available: boolean; trancoRank?: number; source?: string };
  performance: { weightKB?: number; reqImages?: number; reqScripts?: number; LCP?: number; passed?: boolean };
  seo: {
    title: string; titleLength: number; metaDescription: string; metaDescriptionLength: number;
    openGraphCount: number; twitterTagCount: number; jsonLdBlocks: number;
    headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
    links: { internal: number; external: number };
  };
  tech: { cms?: string; frameworks: string[]; thirdParties: string[] };
  tracking: { analytics: string[]; ads: string[]; tagManagers: string[] };
  social: { links: string[] };
  score: { total: number; pillars: Record<string, number> };
  generatedAt: string;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";
const PAGE_URL = `${SITE_URL}/competitor-intel-scanner`;

export default function CompetitorIntelScanner() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

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
    <>
      <Helmet>
        <title>Competitor Intel Scanner | Free AI Tools | Advanta AI</title>
        <meta name="description" content="Enterprise-grade competitor intelligence with traffic analysis, tech stack detection, performance metrics, and historical tracking." />
        <meta name="keywords" content="competitor analysis, SEO audit, tech stack detection, performance analysis, traffic intelligence" />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <NewHeader />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && runScan()}
            />
            <Button onClick={runScan} disabled={loading || !url.trim()}>
              {loading ? 'Scanning...' : 'Scan'}
            </Button>
          </div>

          {/* Results */}
          {report && (
            <div className="space-y-6">
              {/* Header with domain and download */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{report.input.domain}</h2>
                  <p className="text-gray-500 text-sm">
                    Scanned {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-600 text-white">
                    Score: {report.score.total}/100
                  </Badge>
                  <Button onClick={downloadMarkdown} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>

              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(report.score.pillars).map(([pillar, score]) => (
                  <Card key={pillar} className="bg-white shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        score >= 85 ? 'bg-green-100 text-green-600' :
                        score >= 70 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {pillar === 'seo' && <TrendingUp className="w-6 h-6" />}
                        {pillar === 'tech' && <Code className="w-6 h-6" />}
                        {pillar === 'performance' && <BarChart3 className="w-6 h-6" />}
                        {pillar === 'security' && <Shield className="w-6 h-6" />}
                        {pillar === 'social' && <Users className="w-6 h-6" />}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{score}</div>
                      <div className="text-sm text-gray-500 capitalize">{pillar}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SEO Analysis */}
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      SEO Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Title Length</div>
                        <div className="font-medium">{report.seo.titleLength} chars</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Meta Description</div>
                        <div className="font-medium">{report.seo.metaDescriptionLength} chars</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Open Graph</div>
                        <div className="font-medium">{report.seo.openGraphCount} tags</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">JSON-LD</div>
                        <div className="font-medium">{report.seo.jsonLdBlocks} blocks</div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm text-gray-500 mb-1">Page Title</div>
                      <div className="text-sm text-gray-900 truncate">{report.seo.title}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technology Stack */}
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code className="w-5 h-5 text-purple-600" />
                      Technology Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Frameworks</div>
                      <div className="flex flex-wrap gap-1">
                        {report.tech.frameworks.length > 0 ? (
                          report.tech.frameworks.map((fw, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{fw}</Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">None detected</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">CMS</div>
                      <div className="text-sm text-gray-900">{report.tech.cms || 'None detected'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Third Party Services</div>
                      <div className="flex flex-wrap gap-1">
                        {report.tech.thirdParties.length > 0 ? (
                          report.tech.thirdParties.slice(0, 5).map((service, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{service}</Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">None detected</span>
                        )}
                      </div>
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
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Page Weight</div>
                        <div className="font-medium">{report.performance.weightKB || '—'}KB</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Images</div>
                        <div className="font-medium">{report.performance.reqImages || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Scripts</div>
                        <div className="font-medium">{report.performance.reqScripts || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">LCP</div>
                        <div className="font-medium">{report.performance.LCP ? `${report.performance.LCP}ms` : '—'}</div>
                      </div>
                    </div>
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
                    <div className="text-sm text-gray-500 mb-1">Social Links</div>
                    {report.social.links.length > 0 ? (
                      <div className="space-y-1">
                        {report.social.links.map((link, i) => (
                          <div key={i} className="text-sm text-blue-600 truncate">{link}</div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">No social media links detected</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}

function buildMarkdown(report: Report): string {
  return `# Competitor Intelligence Report: ${report.input.domain}

Generated: ${new Date(report.generatedAt).toLocaleDateString()}

## Overview
- **Domain**: ${report.input.domain}
- **Analysis Date**: ${new Date(report.generatedAt).toLocaleDateString()}
- **Overall Score**: ${report.score.total}/100

## SEO Analysis
- **Title**: ${report.seo.title} (${report.seo.titleLength} chars)
- **Meta Description**: ${report.seo.metaDescription} (${report.seo.metaDescriptionLength} chars)
- **Open Graph Tags**: ${report.seo.openGraphCount}
- **Twitter Tags**: ${report.seo.twitterTagCount}
- **JSON-LD Blocks**: ${report.seo.jsonLdBlocks}
- **Internal Links**: ${report.seo.links.internal}
- **External Links**: ${report.seo.links.external}

## Technology Stack
- **Frameworks**: ${report.tech.frameworks.join(', ') || 'None detected'}
- **CMS**: ${report.tech.cms || 'None detected'}
- **Third Parties**: ${report.tech.thirdParties.join(', ') || 'None detected'}

## Performance Metrics
- **Page Weight**: ${report.performance.weightKB ? `${report.performance.weightKB}KB` : 'Not measured'}
- **Image Requests**: ${report.performance.reqImages || 0}
- **Script Requests**: ${report.performance.reqScripts || 0}
- **LCP**: ${report.performance.LCP ? `${report.performance.LCP}ms` : 'Not measured'}

## Social Presence
- **Social Links**: ${report.social.links.length > 0 ? report.social.links.join(', ') : 'None detected'}

## Tracking & Analytics
- **Analytics**: ${report.tracking.analytics.join(', ') || 'None detected'}
- **Ad Platforms**: ${report.tracking.ads.join(', ') || 'None detected'}
- **Tag Managers**: ${report.tracking.tagManagers.join(', ') || 'None detected'}

---
*Generated by Advanta AI Competitor Intel Scanner*
`;
}