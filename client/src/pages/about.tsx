import { Helmet } from 'react-helmet';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Quote,
  Lightbulb,
  TrendingUp,
  Shield
} from 'lucide-react';

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";
const PAGE_URL = `${SITE_URL}/about`;

export default function About() {
  const coreServices = [
    {
      icon: Target,
      title: "Marketing Ops",
      description: "Creative/asset generation, campaign automation, UTM & feed hygiene, ROAS insights."
    },
    {
      icon: TrendingUp,
      title: "Revenue Ops", 
      description: "Lead scoring & routing, follow-up automations, inbox triage, next-best-action prompts."
    },
    {
      icon: BarChart3,
      title: "Analytics Ops",
      description: "Data cleaning and stitching, anomaly alerts, benchmark dashboards, executive summaries."
    }
  ];

  const workflowSteps = [
    "Map the workflow → find the highest-leverage steps.",
    "Ship a scoped pilot (usually 30 days) → set success metrics up front.",
    "Measure what matters → keep dashboards honest, not \"chart art.\"",
    "Scale the wins → automate more, keep humans in the loop where it counts."
  ];

  const values = [
    "Ship > slide decks",
    "Privacy first (clear data boundaries and opt-in)",
    "Simple beats clever (unless clever is simpler)",
    "Test small, scale what works",
    "Explain the \"why\" behind every build"
  ];

  const results = [
    "Fewer manual hours",
    "Faster lead response", 
    "Cleaner reporting",
    "Higher campaign efficiency",
    "Clearer decision-making"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>About Advanta AI & Founder Davide DeMango | AI Automation with Measurable Outcomes</title>
        <meta name="description" content="Advanta AI turns AI into measurable results—clean data, smart automation, and simple interfaces. Meet founder Davide DeMango and see why we built it." />
        <meta name="keywords" content="about Advanta AI, Davide DeMango, AI automation, marketing ops, revenue ops, analytics ops, AI agency founder" />
        <link rel="canonical" href={PAGE_URL} />
        <meta name="robots" content="index,follow" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Advanta AI & Founder Davide DeMango" />
        <meta property="og:description" content="Clean data, smart automation, and interfaces people actually use. Meet the founder and the mission behind Advanta AI." />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={`${SITE_URL}/assets/davide-demango-og.jpg`} />
        <meta property="og:site_name" content="Advanta AI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Advanta AI & Founder Davide DeMango" />
        <meta name="twitter:description" content="Turning AI from buzzword to business results—meet the founder and the method." />
        <meta name="twitter:image" content={`${SITE_URL}/assets/davide-demango-og.jpg`} />

        {/* Structured Data - Organization & Person */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                "name": "Advanta AI",
                "url": SITE_URL,
                "logo": `${SITE_URL}/assets/logo.png`,
                "sameAs": [
                  "https://www.linkedin.com/company/advanta-ai",
                  "https://twitter.com/advanta_ai"
                ],
                "founder": {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#founder`
                }
              },
              {
                "@type": "Person",
                "@id": `${SITE_URL}/#founder`,
                "name": "Davide DeMango",
                "jobTitle": "Founder",
                "worksFor": { "@id": `${SITE_URL}/#org` },
                "image": `${SITE_URL}/assets/davide-demango.jpg`,
                "sameAs": [
                  "https://www.linkedin.com/in/davide-demango",
                  "https://twitter.com/davide_demango"
                ]
              },
              {
                "@type": "WebPage",
                "@id": `${PAGE_URL}#webpage`,
                "url": PAGE_URL,
                "name": "About Advanta AI",
                "description": "Advanta AI turns AI into measurable results—clean data, smart automation, and simple interfaces. Meet founder Davide DeMango and see why we built it.",
                "isPartOf": { "@id": `${SITE_URL}/#org` },
                "primaryImageOfPage": `${SITE_URL}/assets/davide-demango.jpg`,
                "dateModified": "2025-08-19"
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${PAGE_URL}#breadcrumbs`,
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${SITE_URL}/`
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "About",
                    "item": PAGE_URL
                  }
                ]
              }
            ]
          })}
        </script>

        {/* FAQ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does Advanta AI do?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Advanta AI helps teams turn AI into measurable wins—reducing busywork, improving data quality, and automating repeatable steps across marketing, revenue, and analytics operations."
                }
              },
              {
                "@type": "Question",
                "name": "Who is Davide DeMango?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Davide DeMango is the founder of Advanta AI. He previously built enterprise software for Hilton Worldwide and Millennium Hotels and created Grampresso, a growth platform for creators and marketers."
                }
              },
              {
                "@type": "Question",
                "name": "Are there free tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Advanta AI provides free tools for marketing ops, analytics, and automation so you can get value before you purchase—privacy-first and no email wall for core tools."
                }
              },
              {
                "@type": "Question",
                "name": "How does the pilot work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We map your workflow, define success metrics, and ship a scoped 30-day pilot. If it doesn't hit the agreed signals, we revisit the plan—no surprise invoices."
                }
              },
              {
                "@type": "Question",
                "name": "How do you handle data privacy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We operate privacy-first: clear data boundaries, opt-in model usage, and transparent documentation of how data flows through each build."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Advanta AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We help teams turn artificial intelligence into real, measurable wins—automating the repetitive, 
            surfacing the signal, and giving people interfaces they actually use.
          </p>
          <div className="mt-8">
            <Badge variant="outline" className="text-lg px-4 py-2">
              No hype, just outcomes
            </Badge>
          </div>
        </div>

        {/* Mission */}
        <Card className="mb-12 border-blue-200 bg-blue-50/50">
          <CardContent className="p-8">
            <div className="flex items-start">
              <div className="p-3 bg-blue-500 text-white rounded-full mr-6 flex-shrink-0">
                <Lightbulb size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Deliver cutting-edge AI that's innovative and practical, scalable, and designed for real-world impact.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">What We Do</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We build AI systems that accelerate growth and remove busywork across three core lanes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {coreServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-500 text-white rounded-full">
                      <service.icon size={24} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Typical Results
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {results.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Free Tools Philosophy */}
        <Card className="mb-16 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <Zap className="mr-3 h-8 w-8 text-purple-600" />
              Why Free Tools Matter
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Great software should be useful before it's purchased. That's why we invest in a growing library of 
              free tools for solo operators and teams—utilities that help you ship faster, clean your data, and make smarter calls.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                No email wall for core tools
              </div>
              <div className="flex items-center text-gray-700">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Privacy-first by default
              </div>
              <div className="flex items-center text-gray-700">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Clear explanations included
              </div>
            </div>
            <a href="/competitor-intel-scanner">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Explore Free Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* How We Work */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Process</h3>
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-amber-600" />
                  Risk Reversal
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  If a pilot doesn't hit the agreed signals, we revisit scope—no surprise invoices. 
                  We're committed to delivering measurable results, not just impressive demos.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Founder Section */}
        <section className="mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">D</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">Founded by Davide DeMango</h2>
                    <p className="text-gray-300">Equal parts professionalism and wit</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Background</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Before founding Advanta AI, Davide built enterprise software for <strong>Hilton Worldwide</strong> and <strong>Millennium Hotels</strong>, 
                      modernizing hospitality tech to enhance guest experience and streamline operations.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      He also created <strong>Grampresso</strong>, a platform for Instagram, TikTok, and X that equipped creators and marketers 
                      with automation, analytics, and AI-driven growth tools. This experience informs <a href="/" className="text-blue-600 hover:text-blue-800 underline">our approach to AI automation</a>.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Philosophy</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      This blend of enterprise rigor and creator-speed execution shapes Advanta's approach: clean data, 
                      practical automation, and interfaces people actually enjoy using.
                    </p>
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
                      "Ship fast, explain the 'why,' and iterate until it moves the numbers."
                    </blockquote>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why I Built Advanta AI */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Quote className="mr-3 h-8 w-8 text-blue-600" />
              Why I Built Advanta AI
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              I built Advanta AI because too many AI projects looked impressive in decks and under-delivered in the real world. 
              After shipping enterprise software for Hilton Worldwide and Millennium Hotels—and creating Grampresso for creators—I 
              saw the same pattern everywhere: messy data, manual busywork, and interfaces no one wanted to use. Advanta AI is my 
              answer: clean the data, automate the high-leverage steps, and ship <a href="/competitor-intel-scanner" className="text-blue-600 hover:text-blue-800 underline">tools people actually enjoy using</a>.
            </p>
          </CardContent>
        </Card>

        {/* Case Study Snapshots */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Proof & Progress</h2>
          <p className="text-center text-gray-600 mb-12">Real examples of AI automation delivering measurable results</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-red-600">Problem</h3>
                <p className="text-gray-700 mb-4">Manual lead scoring taking 45 minutes per prospect</p>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">What we built</h3>
                <p className="text-gray-700 mb-4">AI scoring system with CRM integration and priority alerts</p>
                <h3 className="font-semibold text-lg mb-2 text-green-600">Result</h3>
                <p className="text-gray-700">Reduced scoring time to 30 seconds, 40% faster follow-up rate</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-red-600">Problem</h3>
                <p className="text-gray-700 mb-4">Campaign data scattered across 6 platforms, weekly reporting nightmare</p>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">What we built</h3>
                <p className="text-gray-700 mb-4">Automated dashboard with anomaly detection and executive summaries</p>
                <h3 className="font-semibold text-lg mb-2 text-green-600">Result</h3>
                <p className="text-gray-700">90% reduction in reporting time, caught 3 major budget leaks</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-red-600">Problem</h3>
                <p className="text-gray-700 mb-4">Support inbox chaos, 24-hour average response time</p>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">What we built</h3>
                <p className="text-gray-700 mb-4">Smart routing with urgency detection and auto-responses</p>
                <h3 className="font-semibold text-lg mb-2 text-green-600">Result</h3>
                <p className="text-gray-700">4-hour response time, 85% customer satisfaction increase</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Values</h2>
          <p className="text-center text-gray-600 mb-8">Founder-signed</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  </div>
                  <p className="text-gray-700 font-medium">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-600 italic">— Davide DeMango, Founder</p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">What does Advanta AI do?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Advanta AI helps teams turn AI into measurable wins—reducing busywork, improving data quality, 
                  and automating repeatable steps across marketing, revenue, and analytics operations. We focus on 
                  practical automation that delivers clear ROI rather than flashy demos.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Who is Davide DeMango?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Davide DeMango is the founder of Advanta AI. He previously built enterprise software for Hilton Worldwide 
                  and Millennium Hotels and created Grampresso, a growth platform for creators and marketers. His background 
                  combines enterprise rigor with creator-speed execution.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Are there free tools?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes. Advanta AI provides <a href="/competitor-intel-scanner" className="text-blue-600 hover:text-blue-800 underline">free tools</a> for marketing ops, 
                  analytics, and automation so you can get value before you purchase—privacy-first and no email wall for core tools. 
                  Great software should be useful before it's purchased.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">How does the pilot work?</h3>
                <p className="text-gray-700 leading-relaxed">
                  We map your workflow, define success metrics, and ship a scoped 30-day pilot. If it doesn't hit the agreed signals, 
                  we revisit the plan—no surprise invoices. We set clear expectations upfront and measure what matters.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">How do you handle data privacy?</h3>
                <p className="text-gray-700 leading-relaxed">
                  We operate privacy-first: clear data boundaries, opt-in model usage, and transparent documentation of how data 
                  flows through each build. Your data stays yours, and we explain exactly how every automation works.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">Last updated: August 2025</p>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              See how Advanta AI can transform your operations with measurable results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" size="lg" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                See Live Demo
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Book 15-min Call
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <Target className="mr-2 h-4 w-4" />
                Ask Davide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}