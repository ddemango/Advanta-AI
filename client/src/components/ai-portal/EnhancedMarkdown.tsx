import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

interface MermaidBlockProps {
  code: string;
}

function MermaidBlock({ code }: MermaidBlockProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (elementRef.current) {
      mermaid.initialize({ 
        startOnLoad: false, 
        securityLevel: 'loose', 
        theme: 'dark',
        fontFamily: 'monospace'
      });
      
      mermaid.render(id, code).then((result) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = result.svg;
        }
      }).catch((error) => {
        console.error('Mermaid render error:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `<pre class="text-red-400">${error.message}</pre>`;
        }
      });
    }
  }, [code, id]);

  return (
    <div className="my-4 p-4 bg-white rounded-lg border">
      <div ref={elementRef} className="overflow-auto" />
    </div>
  );
}

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

function CodeBlock({ className, children }: CodeBlockProps) {
  const language = className?.replace('language-', '');
  const code = String(children).replace(/\n$/, '');

  if (language === 'mermaid') {
    return <MermaidBlock code={code} />;
  }

  return (
    <pre className={`${className} bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto`}>
      <code className={className}>{children}</code>
    </pre>
  );
}

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
}

export function EnhancedMarkdown({ content, className = '' }: EnhancedMarkdownProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-600 rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 bg-gray-800 border-b border-gray-600 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-gray-700">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-300">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4 text-white border-b border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3 text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mt-4 mb-2 text-white">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-200">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          p: ({ children }) => (
            <p className="my-2 text-gray-200 leading-relaxed">
              {children}
            </p>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}