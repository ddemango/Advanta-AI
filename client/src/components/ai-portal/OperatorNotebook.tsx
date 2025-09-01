import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Plus, 
  Trash2, 
  Code2, 
  Terminal as TerminalIcon, 
  Server,
  Square
} from 'lucide-react';

interface CodeCell {
  id: string;
  lang: 'bash' | 'python';
  code: string;
  output?: string;
  isRunning?: boolean;
}

export function OperatorNotebook() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cells, setCells] = useState<CodeCell[]>([
    { 
      id: 'cell-1', 
      lang: 'python', 
      code: 'print("Hello from Python!")\nprint("Session ready for execution")'
    }
  ]);
  const [sessionStatus, setSessionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const openSession = async () => {
    setSessionStatus('connecting');
    try {
      const response = await fetch('/api/operator/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.ok) {
        setSessionId(data.session.id);
        setSessionStatus('connected');
      } else {
        setSessionStatus('disconnected');
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      setSessionStatus('disconnected');
    }
  };

  const closeSession = async () => {
    if (!sessionId) return;
    
    try {
      await fetch(`/api/operator/session/${sessionId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to close session:', error);
    } finally {
      setSessionId(null);
      setSessionStatus('disconnected');
      // Clear all outputs
      setCells(prev => prev.map(cell => ({ ...cell, output: undefined, isRunning: false })));
    }
  };

  const addCell = (lang: 'bash' | 'python') => {
    const newCell: CodeCell = {
      id: `cell-${Date.now()}`,
      lang,
      code: lang === 'python' ? '# Python code\n' : '# Bash command\n'
    };
    setCells(prev => [...prev, newCell]);
  };

  const deleteCell = (cellId: string) => {
    setCells(prev => prev.filter(cell => cell.id !== cellId));
  };

  const updateCellCode = (cellId: string, code: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, code } : cell
    ));
  };

  const runCell = async (cellIndex: number) => {
    if (!sessionId) {
      alert('Please open a session first');
      return;
    }

    const cell = cells[cellIndex];
    if (!cell) return;

    // Set cell as running
    setCells(prev => prev.map((c, i) => 
      i === cellIndex ? { ...c, isRunning: true, output: 'Running...' } : c
    ));

    try {
      const command = cell.lang === 'python' 
        ? `python3 -c "${cell.code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"` 
        : cell.code;

      const response = await fetch('/api/operator/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          cmd: command 
        })
      });

      const data = await response.json();
      const output = [
        data.stdout || '',
        data.stderr ? `[stderr]\n${data.stderr}` : ''
      ].filter(Boolean).join('\n') || 'Command completed with no output';

      setCells(prev => prev.map((c, i) => 
        i === cellIndex ? { 
          ...c, 
          output, 
          isRunning: false 
        } : c
      ));
    } catch (error) {
      setCells(prev => prev.map((c, i) => 
        i === cellIndex ? { 
          ...c, 
          output: `Error: ${error}`, 
          isRunning: false 
        } : c
      ));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Operator Notebook
            <Badge variant={sessionStatus === 'connected' ? 'default' : 'secondary'}>
              {sessionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {sessionStatus === 'connected' ? (
              <Button
                onClick={closeSession}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Close Session
              </Button>
            ) : (
              <Button
                onClick={openSession}
                disabled={sessionStatus === 'connecting'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Server className="h-4 w-4" />
                {sessionStatus === 'connecting' ? 'Connecting...' : 'Open Session'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Cell Controls */}
        <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
          <Button
            onClick={() => addCell('python')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Python Cell
          </Button>
          <Button
            onClick={() => addCell('bash')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Bash Cell
          </Button>
        </div>

        {/* Code Cells */}
        <div className="space-y-4">
          {cells.map((cell, index) => (
            <div key={cell.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Cell Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {cell.lang === 'python' ? 'Python' : 'Bash'}
                  </Badge>
                  <span className="text-sm text-gray-500">Cell {index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => runCell(index)}
                    disabled={!sessionId || cell.isRunning}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Play className="h-3 w-3" />
                    {cell.isRunning ? 'Running...' : 'Run'}
                  </Button>
                  <Button
                    onClick={() => deleteCell(cell.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Code Input */}
              <Textarea
                value={cell.code}
                onChange={(e) => updateCellCode(cell.id, e.target.value)}
                className="border-0 rounded-none font-mono text-sm resize-none min-h-[100px]"
                placeholder={`Enter ${cell.lang} code here...`}
              />

              {/* Output */}
              {cell.output && (
                <div className="border-t bg-gray-900 text-green-400 p-3">
                  <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                    {cell.output}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <strong>Instructions:</strong> Open a session to execute code cells. Python and Bash cells share the same 
          persistent workspace - files created in one cell will be available in others. Use this for data analysis, 
          file processing, and multi-step computations.
        </div>

        {cells.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Code2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No code cells yet. Add Python or Bash cells to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}