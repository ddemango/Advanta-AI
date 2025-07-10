import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { FilePreviewModal } from './FilePreviewModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Image, 
  Download, 
  ExternalLink, 
  Eye,
  Share,
  Copy,
  File,
  Database,
  Link,
  Archive
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function MobileOutputViewer() {
  const { tasks } = useChatStore();
  const [selectedOutput, setSelectedOutput] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Collect all outputs from all tasks
  const allOutputs = tasks.reduce((acc, task) => {
    return [...acc, ...task.outputs.map(output => ({ ...output, taskTitle: task.title, taskId: task.id }))];
  }, [] as any[]);

  const getFileIcon = (type: string, mimeType?: string) => {
    if (type === 'url') return <Link className="w-5 h-5" />;
    if (type === 'data') return <Database className="w-5 h-5" />;
    if (mimeType?.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType?.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getFileTypeColor = (type: string, mimeType?: string) => {
    if (type === 'url') return 'bg-blue-100 text-blue-800';
    if (type === 'data') return 'bg-purple-100 text-purple-800';
    if (mimeType?.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (mimeType?.includes('pdf')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (output: any) => {
    try {
      if (output.url && output.url !== '#') {
        // For real URLs, fetch and download
        const response = await fetch(output.url);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = output.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Download completed');
        } else {
          throw new Error('Failed to fetch file');
        }
      } else if (output.content) {
        // For content-based outputs, create blob
        const blob = new Blob([output.content], { type: output.mimeType || 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = output.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Download completed');
      } else {
        toast.error('No downloadable content available');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const handleShare = (output: any) => {
    if (navigator.share) {
      navigator.share({
        title: output.name,
        text: `Check out this output from my automation task: ${output.name}`,
        url: output.url || ''
      });
    } else {
      navigator.clipboard.writeText(output.url || output.content || '');
      toast.success('Copied to clipboard');
    }
  };

  const handleCopy = (output: any) => {
    const content = output.url || output.content || output.name;
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const openPreview = (output: any) => {
    setSelectedOutput(output);
    setPreviewOpen(true);
  };

  const PreviewContent = ({ output }: { output: any }) => {
    if (output.type === 'url') {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">URL</h4>
            <a 
              href={output.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {output.url}
            </a>
          </div>
          <Button onClick={() => window.open(output.url, '_blank')} className="w-full">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      );
    }

    if (output.mimeType?.startsWith('image/') && output.preview) {
      return (
        <div className="space-y-4">
          <img 
            src={output.preview} 
            alt={output.name}
            className="w-full rounded-lg"
          />
          <Button onClick={() => handleDownload(output)} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
        </div>
      );
    }

    if (output.type === 'text' || output.mimeType?.includes('text')) {
      return (
        <div className="space-y-4">
          <ScrollArea className="h-64 w-full rounded-lg border p-4">
            <pre className="text-sm whitespace-pre-wrap">{output.content}</pre>
          </ScrollArea>
          <div className="flex gap-2">
            <Button onClick={() => handleCopy(output)} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={() => handleDownload(output)} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 text-center">
        <div className="p-8">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 mb-2">Preview not available</h4>
          <p className="text-gray-500 text-sm">This file type cannot be previewed in the browser.</p>
        </div>
        <Button onClick={() => handleDownload(output)} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  if (allOutputs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Archive className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No outputs yet</h3>
        <p className="text-gray-500 mb-4">Complete tasks to generate downloadable outputs and files.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2 className="text-lg font-semibold text-gray-900">Output Files</h2>
        <p className="text-sm text-gray-500">{allOutputs.length} total outputs</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {allOutputs.map((output, index) => (
            <Card key={`${output.id}-${index}`} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getFileTypeColor(output.type, output.mimeType)}`}>
                    {getFileIcon(output.type, output.mimeType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{output.name}</h3>
                    <p className="text-sm text-gray-500 truncate mb-2">From: {output.taskTitle}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {output.type}
                      </Badge>
                      {output.size && (
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(output.size)}
                        </Badge>
                      )}
                      {output.mimeType && (
                        <Badge variant="secondary" className="text-xs">
                          {output.mimeType.split('/')[1]?.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openPreview(output)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(output)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleShare(output)}
                      >
                        <Share className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      {/* File Preview Modal */}
      {selectedOutput && (
        <FilePreviewModal
          file={selectedOutput}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}