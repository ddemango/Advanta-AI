import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Plus, Trash2, Copy, Download, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  language: string;
  content: string;
  output?: string;
  isRunning?: boolean;
}

interface OperatorNotebookProps {
  onCellExecute?: (cell: NotebookCell) => void;
}

const OperatorNotebook: React.FC<OperatorNotebookProps> = ({ onCellExecute }) => {
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: '1',
      type: 'code',
      language: 'python',
      content: '# Welcome to Operator Notebook\nprint("Hello, World!")',
    }
  ]);
  const [activeCellId, setActiveCellId] = useState('1');
  const [isRunning, setIsRunning] = useState(false);

  const addCell = (type: 'code' | 'markdown' = 'code') => {
    const newCell: NotebookCell = {
      id: Date.now().toString(),
      type,
      language: type === 'code' ? 'python' : 'markdown',
      content: type === 'code' ? '# New cell' : '# New markdown cell\n\nEnter your content here...',
    };
    
    const activeIndex = cells.findIndex(cell => cell.id === activeCellId);
    const newCells = [...cells];
    newCells.splice(activeIndex + 1, 0, newCell);
    setCells(newCells);
    setActiveCellId(newCell.id);
  };

  const deleteCell = (cellId: string) => {
    if (cells.length === 1) return; // Don't delete the last cell
    
    setCells(prev => prev.filter(cell => cell.id !== cellId));
    if (activeCellId === cellId) {
      const remainingCells = cells.filter(cell => cell.id !== cellId);
      setActiveCellId(remainingCells[0]?.id || '');
    }
  };

  const updateCellContent = (cellId: string, content: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, content } : cell
    ));
  };

  const executeCell = async (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.type !== 'code') return;

    setIsRunning(true);
    setCells(prev => prev.map(c => 
      c.id === cellId ? { ...c, isRunning: true, output: undefined } : c
    ));

    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: cell.language,
          code: cell.content
        })
      });

      const data = await response.json();
      if (data.ok) {
        const output = data.stdout + (data.stderr ? `\nErrors:\n${data.stderr}` : '');
        setCells(prev => prev.map(c => 
          c.id === cellId ? { ...c, output, isRunning: false } : c
        ));
        onCellExecute?.({ ...cell, output });
      }
    } catch (error) {
      console.error('Execution error:', error);
      setCells(prev => prev.map(c => 
        c.id === cellId ? { ...c, output: `Error: ${error}`, isRunning: false } : c
      ));
    } finally {
      setIsRunning(false);
    }
  };

  const copyCellContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportNotebook = () => {
    const notebookData = {
      cells: cells.map(cell => ({
        cell_type: cell.type,
        source: cell.content.split('\n'),
        metadata: { language: cell.language },
        outputs: cell.output ? [{ text: cell.output }] : []
      }))
    };
    
    const blob = new Blob([JSON.stringify(notebookData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notebook.json';
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-700 bg-gray-800/30 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold">Operator Notebook</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addCell('code')}
            className="px-3 py-1 bg-blue-600 text-xs rounded flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Code</span>
          </button>
          <button
            onClick={() => addCell('markdown')}
            className="px-3 py-1 bg-gray-600 text-xs rounded flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Markdown</span>
          </button>
          <button
            onClick={exportNotebook}
            className="px-3 py-1 bg-green-600 text-xs rounded flex items-center space-x-1"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Notebook Cells */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {cells.map((cell, index) => (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`border rounded-lg overflow-hidden transition-colors ${
                activeCellId === cell.id ? 'border-blue-500' : 'border-gray-700'
              }`}
              onClick={() => setActiveCellId(cell.id)}
            >
              {/* Cell Header */}
              <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    [{index + 1}] {cell.type === 'code' ? cell.language : 'markdown'}
                  </span>
                  {cell.isRunning && (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {cell.type === 'code' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        executeCell(cell.id);
                      }}
                      disabled={isRunning}
                      className="p-1 hover:bg-gray-700 rounded text-green-400 disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCellContent(cell.content);
                    }}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCell(cell.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded text-red-400"
                    disabled={cells.length === 1}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Cell Content */}
              <div className="bg-gray-900">
                {cell.type === 'code' ? (
                  <Editor
                    height="120px"
                    language={cell.language}
                    value={cell.content}
                    onChange={(value) => updateCellContent(cell.id, value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 13,
                      fontFamily: 'JetBrains Mono, Consolas, monospace',
                      lineNumbers: 'off',
                      glyphMargin: false,
                      folding: false,
                      lineDecorationsWidth: 0,
                      lineNumbersMinChars: 0
                    }}
                  />
                ) : (
                  <textarea
                    value={cell.content}
                    onChange={(e) => updateCellContent(cell.id, e.target.value)}
                    className="w-full bg-transparent p-3 text-sm resize-none focus:outline-none"
                    rows={3}
                    placeholder="Enter markdown content..."
                  />
                )}
              </div>

              {/* Cell Output */}
              {cell.output && (
                <div className="bg-gray-800 border-t border-gray-700">
                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                    Output:
                  </div>
                  <pre className="p-3 text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto max-h-48">
                    {cell.output}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OperatorNotebook;