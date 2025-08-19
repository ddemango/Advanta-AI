import { Helmet } from 'react-helmet';

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";
const PAGE_URL = `${SITE_URL}/about`;

export default function About() {
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Advanta AI helps teams turn artificial intelligence into real, measurable wins—automating the repetitive, 
            surfacing the signal, and giving people interfaces they actually use.
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Our mission is simple: deliver cutting-edge AI that's innovative and practical, scalable, and designed for real-world impact—no hype, just outcomes.
          </p>
        </div>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">What we do (in plain English)</h2>
          <p className="text-lg text-gray-700 mb-8">
            We build AI systems that accelerate growth and remove busywork across three core lanes:
          </p>
          
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing Ops</h3>
              <p className="text-gray-700">Creative/asset generation, campaign automation, UTM & feed hygiene, ROAS insights.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Ops</h3>
              <p className="text-gray-700">Lead scoring & routing, follow-up automations, inbox triage, next-best-action prompts.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Ops</h3>
              <p className="text-gray-700">Data cleaning and stitching, anomaly alerts, benchmark dashboards, executive summaries.</p>
            </div>
          </div>

          <p className="text-gray-700">
            <strong>Typical results:</strong> fewer manual hours, faster lead response, cleaner reporting, higher campaign efficiency, and clearer decision-making.
          </p>
        </section>

        {/* Why Free Tools Matter */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why free tools matter</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Great software should be useful before it's purchased. That's why we invest in a growing library of 
            free tools for solo operators and teams—utilities that help you ship faster, clean your data, and make smarter calls. 
            No email wall for core tools, privacy-first by default, and clear explanations of what each tool does. 
            Try it, see value, then decide if you need more.
          </p>
          <p className="text-blue-600">
            <a href="/competitor-intel-scanner" className="underline hover:text-blue-800">Explore the Free Tools →</a>
          </p>
        </section>

        {/* How We Work */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How we work</h2>
          <div className="space-y-4 mb-6">
            <p className="text-gray-700">Map the workflow → find the highest-leverage steps.</p>
            <p className="text-gray-700">Ship a scoped pilot (usually 30 days) → set success metrics up front.</p>
            <p className="text-gray-700">Measure what matters → keep dashboards honest, not "chart art."</p>
            <p className="text-gray-700">Scale the wins → automate more, keep humans in the loop where it counts.</p>
          </div>
          <p className="text-gray-700 font-medium">
            Risk-reversal: if a pilot doesn't hit the agreed signals, we revisit scope—no surprise invoices.
          </p>
        </section>

        {/* Founded by Davide DeMango */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Founded by Davide DeMango</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Davide DeMango leads Advanta AI with equal parts professionalism and wit. Before founding the company, 
            he built enterprise software for Hilton Worldwide and Millennium Hotels, modernizing hospitality tech 
            to enhance guest experience and streamline operations. He also created Grampresso, a platform for Instagram, 
            TikTok, and X that equipped creators and marketers with automation, analytics, and AI-driven growth tools.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            This blend of enterprise rigor and creator-speed execution shapes Advanta's approach: clean data, practical automation, 
            and interfaces people actually enjoy using. Davide stays hands-on from scoping and data design to deployment 
            and measurement, with a straightforward standard—ship fast, explain the "why," and iterate until it moves the numbers. 
            The tone is professional, and there's just enough dry humor to keep complex work human.
          </p>
        </section>

        {/* Why I Built Advanta AI */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why I built Advanta AI</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            I built Advanta AI because too many AI projects looked impressive in decks and under-delivered in the real world. 
            After shipping enterprise software for Hilton Worldwide and Millennium Hotels—and creating Grampresso for creators—I 
            saw the same pattern everywhere: messy data, manual busywork, and interfaces no one wanted to use. Advanta AI is my 
            answer: clean the data, automate the high-leverage steps, and ship tools people actually enjoy using. We lead with free, 
            useful utilities to help you get started, then scale custom solutions that fit your specific workflow.
          </p>
        </section>

        {/* Proof & Progress */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Proof & progress (snapshots)</h2>
          <p className="text-gray-700 mb-8">Add 2–3 short tiles beneath this line:</p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-700"><strong>Problem →</strong> one sentence</p>
              <p className="text-gray-700"><strong>What we built →</strong> one sentence</p>
              <p className="text-gray-700"><strong>Result →</strong> one sentence (metric if you have it)</p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-6 italic">(Swap in real examples as they're ready.)</p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Values (founder-signed)</h2>
          <ul className="space-y-3 mb-8">
            <li className="text-gray-700">Ship &gt; slide decks</li>
            <li className="text-gray-700">Privacy first (clear data boundaries and opt-in)</li>
            <li className="text-gray-700">Simple beats clever (unless clever is simpler)</li>
            <li className="text-gray-700">Test small, scale what works</li>
            <li className="text-gray-700">Explain the &quot;why&quot; behind every build</li>
          </ul>
          <p className="text-gray-600 italic">— Davide DeMango, Founder</p>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Call to action</h2>
          <div className="space-y-4">
            <p className="text-blue-600 underline hover:text-blue-800">
              <a href="/demo">See a live demo</a>
            </p>
            <p className="text-blue-600 underline hover:text-blue-800">
              <a href="/contact">Book a 15-minute fit call</a>
            </p>
            <p className="text-blue-600 underline hover:text-blue-800">
              <a href="/contact">Ask Davide which tools fit your stack</a>
            </p>
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500">Updated: August 2025</p>
        </div>
      </div>
    </div>
  );
}