import { Link } from "wouter";
import { Button } from "./button";

interface Metric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: number;
  title: string;
  client: string;
  logo: string;
  logoColor?: string;
  industry: string;
  image: string;
  problem: string;
  solution: string;
  result: string;
  metrics: Metric[];
  quote?: string;
  spokespersonName?: string;
  spokespersonTitle?: string;
  technologies?: string[];
  implementationTime?: string;
  color: string;
  featured?: boolean;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <div className="bg-background border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={caseStudy.image} 
          alt={`${caseStudy.client} case study`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-medium py-1 px-2 rounded">
          {caseStudy.industry}
        </div>
        <div 
          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: caseStudy.logoColor || '#4A90E2' }}
        >
          {caseStudy.logo}
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{caseStudy.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{caseStudy.client}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-1">Challenge:</h4>
          <p className="text-gray-400 text-sm">{caseStudy.problem}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-1">Solution:</h4>
          <p className="text-gray-400 text-sm">{caseStudy.solution}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-1">Results:</h4>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {caseStudy.metrics.map((metric, i) => (
              <div key={i} className="bg-background/50 border border-white/5 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-primary">{metric.value}</div>
                <div className="text-gray-400 text-xs">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {caseStudy.quote && (
          <div className="mb-4 border-l-2 border-primary pl-3 italic text-sm text-gray-300">
            "{caseStudy.quote}"
            {caseStudy.spokespersonName && (
              <div className="text-xs text-gray-400 mt-1 not-italic">
                — {caseStudy.spokespersonName}, {caseStudy.spokespersonTitle}
              </div>
            )}
          </div>
        )}
        
        {caseStudy.technologies && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-1">Technologies Used:</h4>
            <div className="flex flex-wrap gap-1">
              {caseStudy.technologies.map((tech, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 pt-0 border-t border-white/5 mt-auto flex justify-between items-center">
        <div className="text-xs text-gray-400">
          Implementation: {caseStudy.implementationTime || "14-30 days"}
        </div>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href={`/case-study/${caseStudy.id}`}>
            Full Case Study <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </Button>
      </div>
    </div>
  );
}