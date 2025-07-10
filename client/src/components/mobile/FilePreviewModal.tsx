import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileText, Image as ImageIcon, Code, Download, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FilePreviewModalProps {
  file: any;
  open: boolean;
  onClose: () => void;
}

export function FilePreviewModal({ file, open, onClose }: FilePreviewModalProps) {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);

  if (!file) return null;

  const isPDF = file.name.endsWith('.pdf') || file.mimeType === 'application/pdf';
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(file.name) || file.mimeType?.startsWith('image/');
  const isCode = /\.(js|ts|tsx|jsx|json|py|html|css|md|txt)$/i.test(file.name) || file.mimeType?.includes('text');

  const handleCopy = () => {
    if (file.content) {
      navigator.clipboard.writeText(file.content);
      toast.success('Content copied to clipboard');
    } else {
      toast.error('No content to copy');
    }
  };

  const handleDownload = async () => {
    try {
      if (file.url && file.url !== '#') {
        const response = await fetch(file.url);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Download started');
        } else {
          throw new Error('Failed to download file');
        }
      } else if (file.content) {
        const blob = new Blob([file.content], { type: file.mimeType || 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Download started');
      } else {
        toast.error('No downloadable content available');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded">
                {isPDF && <FileText className="w-5 h-5 text-red-500" />}
                {isImage && <ImageIcon className="w-5 h-5 text-green-500" />}
                {isCode && <Code className="w-5 h-5 text-blue-500" />}
                {!isPDF && !isImage && !isCode && <FileText className="w-5 h-5 text-gray-500" />}
              </div>
              <div>
                <DialogTitle className="text-lg font-medium truncate max-w-xs">
                  {file.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {file.size && <span>{Math.round(file.size / 1024)}KB</span>}
                  {file.mimeType && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {file.mimeType.split('/')[1]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {file.content && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              )}
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isPDF && (
            <div className="h-full flex items-center justify-center p-8 bg-gray-50">
              <div className="text-center">
                <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Preview</h3>
                <p className="text-gray-500 mb-4">PDF files cannot be previewed in this modal.</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}

          {isImage && !imageError && (
            <div className="h-full flex items-center justify-center p-4 bg-gray-50">
              <img 
                src={file.preview || file.url} 
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {(isImage && imageError) && (
            <div className="h-full flex items-center justify-center p-8 bg-gray-50">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Image Preview Unavailable</h3>
                <p className="text-gray-500 mb-4">Unable to load image preview.</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}

          {isCode && file.content && (
            <ScrollArea className="h-full p-4">
              <pre className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{file.content}</code>
              </pre>
            </ScrollArea>
          )}

          {isCode && !file.content && (
            <div className="h-full flex items-center justify-center p-8 bg-gray-50">
              <div className="text-center">
                <Code className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Code Preview</h3>
                <p className="text-gray-500 mb-4">Fetching preview...</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
          )}

          {!isPDF && !isImage && !isCode && (
            <div className="h-full flex items-center justify-center p-8 bg-gray-50">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
                <p className="text-gray-500 mb-4">This file type cannot be previewed in the browser.</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}