import { Helmet } from 'react-helmet';
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
        <title>About Advanta AI — AI Automation That Delivers Real Results</title>
        <meta name="description" content="Learn how Advanta AI helps teams turn artificial intelligence into real, measurable wins through Marketing Ops, Revenue Ops, and Analytics Ops automation." />
        <meta name="keywords" content="about Advanta AI, AI automation, marketing ops, revenue ops, analytics ops, Davide DeMango" />
        <link rel="canonical" href={PAGE_URL} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content="About Advanta AI — AI Automation That Delivers Real Results" />
        <meta property="og:description" content="Discover how we help teams turn AI into measurable wins across Marketing, Revenue, and Analytics operations." />
        <meta property="og:site_name" content="Advanta AI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Advanta AI — AI Automation That Delivers Real Results" />
        <meta name="twitter:description" content="Learn how we help teams turn AI into measurable wins across Marketing, Revenue, and Analytics operations." />
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
            <Button className="bg-purple-600 hover:bg-purple-700">
              Explore Free Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
                <h2 className="text-3xl font-bold mb-2">Founded by Davide DeMango</h2>
                <p className="text-gray-300">Equal parts professionalism and wit</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Background</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Before founding Advanta AI, Davide built enterprise software for Hilton Worldwide and Millennium Hotels, 
                      modernizing hospitality tech to enhance guest experience and streamline operations.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      He also created Grampresso, a platform for Instagram, TikTok, and X that equipped creators and marketers 
                      with automation, analytics, and AI-driven growth tools.
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
              answer: clean the data, automate the high-leverage steps, and ship tools people actually enjoy using.
            </p>
          </CardContent>
        </Card>

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