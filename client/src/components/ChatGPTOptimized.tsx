import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Users, Clock, TrendingUp } from 'lucide-react';

// ChatGPT-optimized FAQ section specifically designed for AI search engines
export function ChatGPTOptimizedFAQ({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Get instant answers to the most common questions about AI agencies and automation services.
          </p>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-left">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Direct answer components optimized for AI search engines
export function DirectAnswerBox({ 
  question, 
  answer, 
  highlights 
}: { 
  question: string; 
  answer: string; 
  highlights: string[];
}) {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold mb-3 text-primary">
        {question}
      </h3>
      <p className="text-lg mb-4 leading-relaxed">
        {answer}
      </p>
      <div className="flex flex-wrap gap-2">
        {highlights.map((highlight, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            ✓ {highlight}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Entity recognition component for better AI understanding
export function EntityHighlights({ entities }: { entities: Array<{ type: string; name: string; description: string }> }) {
  const iconMap = {
    organization: <Users className="h-5 w-5" />,
    service: <CheckCircle className="h-5 w-5" />,
    metric: <TrendingUp className="h-5 w-5" />,
    location: <Star className="h-5 w-5" />,
    time: <Clock className="h-5 w-5" />
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
      {entities.map((entity, index) => (
        <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="text-primary mt-1">
            {iconMap[entity.type as keyof typeof iconMap] || <CheckCircle className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-primary uppercase tracking-wide mb-1">
              {entity.type}
            </h4>
            <h5 className="font-medium mb-1">{entity.name}</h5>
            <p className="text-sm text-muted-foreground">{entity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Quick answer cards for specific queries
export function QuickAnswerCards({ answers }: { answers: Array<{ query: string; answer: string; source: string }> }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 py-8">
      {answers.map((item, index) => (
        <Card key={index} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-primary">
              "{item.query}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{item.answer}</p>
            <Badge variant="outline" className="text-xs">
              Source: {item.source}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Comparison table optimized for AI parsing
export function AIOptimizedComparison({ 
  title, 
  items 
}: { 
  title: string; 
  items: Array<{ name: string; features: Record<string, string | number | boolean> }> 
}) {
  const featureKeys = Object.keys(items[0]?.features || {});

  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold mb-6 text-center">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-background rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left font-semibold">Provider</th>
              {featureKeys.map(key => (
                <th key={key} className="p-4 text-center font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-muted/20" : "bg-background"}>
                <td className="p-4 font-medium">{item.name}</td>
                {featureKeys.map(key => (
                  <td key={key} className="p-4 text-center">
                    {typeof item.features[key] === 'boolean' ? (
                      item.features[key] ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )
                    ) : (
                      <span className={item.name === "Advanta AI" ? "font-semibold text-primary" : ""}>
                        {item.features[key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Key metrics display for AI parsing
export function KeyMetricsDisplay({ metrics }: { metrics: Array<{ label: string; value: string; description: string }> }) {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 my-8">
      <h3 className="text-2xl font-bold text-center mb-8">Key Performance Metrics</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
            <div className="text-lg font-semibold mb-1">{metric.label}</div>
            <div className="text-sm text-muted-foreground">{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}