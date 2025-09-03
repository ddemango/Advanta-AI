import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image as ImageIcon,
  Code2,
  Search,
  BarChart3,
  FileSliders,
  Download,
  Upload,
  Play,
  Loader2,
  Copy,
  ExternalLink
} from "lucide-react";

interface QuickActionToolsProps {
  showImageGen: boolean;
  setShowImageGen: (show: boolean) => void;
  showCodeRunner: boolean;
  setShowCodeRunner: (show: boolean) => void;
  showResearch: boolean;
  setShowResearch: (show: boolean) => void;
  showDataAnalysis: boolean;
  setShowDataAnalysis: (show: boolean) => void;
  showPlayground: boolean;
  setShowPlayground: (show: boolean) => void;
  showPowerPoint: boolean;
  setShowPowerPoint: (show: boolean) => void;
}

export function QuickActionTools({
  showImageGen,
  setShowImageGen,
  showCodeRunner,
  setShowCodeRunner,
  showResearch,
  setShowResearch,
  showDataAnalysis,
  setShowDataAnalysis,
  showPlayground,
  setShowPlayground,
  showPowerPoint,
  setShowPowerPoint
}: QuickActionToolsProps) {
  
  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // Code Runner State
  const [code, setCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeOutput, setCodeOutput] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  // Research State
  const [researchQuery, setResearchQuery] = useState("");
  const [researchDepth, setResearchDepth] = useState("fast");
  const [researchResults, setResearchResults] = useState<any>(null);
  const [researchLoading, setResearchLoading] = useState(false);

  // Data Analysis State
  const [analysisFile, setAnalysisFile] = useState<File | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PowerPoint State
  const [pptOutline, setPptOutline] = useState("");
  const [pptResults, setPptResults] = useState<any>(null);
  const [pptLoading, setPptLoading] = useState(false);

  // Playground State
  const [playgroundModel, setPlaygroundModel] = useState("gpt-4o");
  const [playgroundPrompt, setPlaygroundPrompt] = useState("");
  const [playgroundTemp, setPlaygroundTemp] = useState(0.7);
  const [playgroundTokens, setPlaygroundTokens] = useState(1000);
  const [playgroundResponse, setPlaygroundResponse] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setImageLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/image/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({ prompt: imagePrompt, size: imageSize })
      });
      
      const data = await response.json();
      if (data.ok) {
        setGeneratedImage(data.imageUrl);
      } else {
        alert('Failed to generate image: ' + data.error);
      }
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image');
    } finally {
      setImageLoading(false);
    }
  };

  const runCode = async () => {
    if (!code.trim()) return;
    
    setCodeLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/code/run', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({ language: codeLanguage, code })
      });
      
      const data = await response.json();
      if (data.ok) {
        setCodeOutput(data.output);
      } else {
        setCodeOutput('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setCodeOutput('Failed to execute code');
    } finally {
      setCodeLoading(false);
    }
  };

  const performResearch = async () => {
    if (!researchQuery.trim()) return;
    
    setResearchLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/research', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({ query: researchQuery, depth: researchDepth })
      });
      
      const data = await response.json();
      if (data.ok) {
        setResearchResults(data.results);
      } else {
        alert('Research failed: ' + data.error);
      }
    } catch (error) {
      console.error('Research error:', error);
      alert('Research failed');
    } finally {
      setResearchLoading(false);
    }
  };

  const analyzeData = async () => {
    if (!analysisFile || !analysisPrompt.trim()) return;
    
    setAnalysisLoading(true);
    const formData = new FormData();
    formData.append('file', analysisFile);
    formData.append('prompt', analysisPrompt);
    
    try {
      const response = await fetch('/api/ai-portal/tools/data/analyze', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin123'
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.ok) {
        setAnalysisResults(data.results);
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (error) {
      console.error('Data analysis error:', error);
      alert('Analysis failed');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const generatePowerPoint = async () => {
    if (!pptOutline.trim()) return;
    
    setPptLoading(true);
    try {
      const response = await fetch('/api/ai-portal/tools/ppt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({ outline: pptOutline })
      });
      
      const data = await response.json();
      if (data.ok) {
        setPptResults(data.slides);
      } else {
        alert('PowerPoint generation failed: ' + data.error);
      }
    } catch (error) {
      console.error('PowerPoint generation error:', error);
      alert('PowerPoint generation failed');
    } finally {
      setPptLoading(false);
    }
  };

  const testPlayground = async () => {
    if (!playgroundPrompt.trim()) return;
    
    setPlaygroundLoading(true);
    try {
      const response = await fetch('/api/ai-portal/chat/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: playgroundPrompt }],
          model: playgroundModel,
          temperature: playgroundTemp,
          max_tokens: playgroundTokens
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                setPlaygroundResponse(fullResponse);
                setPlaygroundLoading(false);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullResponse += parsed.content;
                  setPlaygroundResponse(fullResponse);
                }
              } catch (e) {
                // Ignore JSON parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Playground error:', error);
      setPlaygroundResponse('Error: Failed to get response');
    } finally {
      setPlaygroundLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Generation Tool */}
      {showImageGen && (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Image Generation</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prompt</label>
              <Textarea 
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <select 
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2"
              >
                <option value="1024x1024">1024x1024 (Square)</option>
                <option value="1792x1024">1792x1024 (Landscape)</option>
                <option value="1024x1792">1024x1792 (Portrait)</option>
              </select>
            </div>
            
            <Button 
              onClick={generateImage} 
              disabled={imageLoading || !imagePrompt.trim()}
              className="w-full"
            >
              {imageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Image'}
            </Button>
            
            {generatedImage && (
              <div className="mt-4">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full rounded-lg border"
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(generatedImage, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(generatedImage)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy URL
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Runner Tool */}
      {showCodeRunner && (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Code Runner</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select 
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="bash">Bash</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Code</label>
              <Textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here..."
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={runCode} 
              disabled={codeLoading || !code.trim()}
              className="w-full"
            >
              {codeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
              Run Code
            </Button>
            
            {codeOutput && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Output</label>
                <pre className="bg-zinc-50 border rounded-lg p-4 text-sm overflow-auto max-h-48">
                  {codeOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deep Research Tool */}
      {showResearch && (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Deep Research</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Research Query</label>
              <Input 
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder="What would you like to research?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Depth</label>
              <select 
                value={researchDepth}
                onChange={(e) => setResearchDepth(e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2"
              >
                <option value="fast">Fast (5 sources)</option>
                <option value="deep">Deep (15 sources)</option>
              </select>
            </div>
            
            <Button 
              onClick={performResearch} 
              disabled={researchLoading || !researchQuery.trim()}
              className="w-full"
            >
              {researchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start Research'}
            </Button>
            
            {researchResults && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Research Summary</h4>
                  <div className="bg-zinc-50 border rounded-lg p-4 prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: researchResults.summary?.replace(/\n/g, '<br>') }} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Sources ({researchResults.sources?.length || 0})</h4>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {researchResults.sources?.map((source, idx) => (
                      <div key={idx} className="border rounded-lg p-3 text-sm">
                        <div className="font-medium">[{source.id}] {source.title}</div>
                        <div className="text-zinc-600 text-xs mt-1">{source.url}</div>
                        <div className="text-zinc-700 mt-1">{source.snippet}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Analysis Tool */}
      {showDataAnalysis && (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Data Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <input 
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setAnalysisFile(e.target.files?.[0] || null)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2"
              />
              <div className="text-xs text-zinc-500 mt-1">
                Supported formats: CSV, XLSX, XLS
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Analysis Request</label>
              <Textarea 
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
                placeholder="What analysis would you like to perform on this data?"
                className="min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={analyzeData} 
              disabled={analysisLoading || !analysisFile || !analysisPrompt.trim()}
              className="w-full"
            >
              {analysisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze Data'}
            </Button>
            
            {analysisResults && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Analysis Results</h4>
                  <div className="bg-zinc-50 border rounded-lg p-4 prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: analysisResults.summary?.replace(/\n/g, '<br>') }} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Data Preview ({analysisResults.rowCount} rows, {analysisResults.columns?.length} columns)</h4>
                  <div className="overflow-auto max-h-48">
                    <table className="w-full text-xs border">
                      <thead>
                        <tr className="bg-zinc-50">
                          {analysisResults.columns?.map((col, idx) => (
                            <th key={idx} className="border px-2 py-1 text-left font-medium">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.dataPreview?.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            {analysisResults.columns?.map((col, colIdx) => (
                              <td key={colIdx} className="border px-2 py-1">{row[col]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Playground Tool */}
      {showPlayground && (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <FileSliders className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">AI Playground</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select 
                  value={playgroundModel}
                  onChange={(e) => setPlaygroundModel(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2"
                >
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <input 
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={playgroundTemp}
                  onChange={(e) => setPlaygroundTemp(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-center text-zinc-500">{playgroundTemp}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Tokens</label>
                <input 
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={playgroundTokens}
                  onChange={(e) => setPlaygroundTokens(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-center text-zinc-500">{playgroundTokens}</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Prompt</label>
              <Textarea 
                value={playgroundPrompt}
                onChange={(e) => setPlaygroundPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={testPlayground} 
              disabled={playgroundLoading || !playgroundPrompt.trim()}
              className="w-full"
            >
              {playgroundLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Prompt'}
            </Button>
            
            {playgroundResponse && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Response</label>
                <div className="bg-zinc-50 border rounded-lg p-4 prose prose-sm max-w-none">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{playgroundResponse}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PowerPoint Generation Tool */}
      {showPowerPoint && (
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <FileSliders className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">PowerPoint Generator</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Presentation Outline</label>
              <Textarea 
                value={pptOutline}
                onChange={(e) => setPptOutline(e.target.value)}
                placeholder="Describe your presentation topic and key points..."
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={generatePowerPoint} 
              disabled={pptLoading || !pptOutline.trim()}
              className="w-full"
            >
              {pptLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate PowerPoint'}
            </Button>
            
            {pptResults && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Generated Slides ({pptResults.slides?.length || 0})</h4>
                <div className="space-y-3 max-h-96 overflow-auto">
                  {pptResults.slides?.map((slide, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="font-medium text-sm mb-2">Slide {idx + 1}: {slide.title}</div>
                      <div className="text-sm text-zinc-700">
                        {slide.content?.map((item, itemIdx) => (
                          <div key={itemIdx} className="mb-1">• {item}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download PPTX
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}