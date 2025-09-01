"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Trash2, Terminal } from "lucide-react";

type Cell = { 
  id: string; 
  lang: "bash" | "python"; 
  code: string; 
  output?: string;
  status?: "idle" | "running" | "done" | "error";
};

export function OperatorNotebook() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cells, setCells] = useState<Cell[]>([
    { 
      id: "c1", 
      lang: "python", 
      code: "# Python example\nprint('Hello from Python!')\nimport json\ndata = {'message': 'success', 'value': 42}\nprint(json.dumps(data, indent=2))",
      status: "idle"
    }
  ]);

  const openSession = async () => {
    try {
      const response = await fetch('/api/code/session', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.ok) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Failed to open session:', error);
    }
  };

  const closeSession = async () => {
    if (!sessionId) return;
    
    try {
      await fetch(`/api/code/session/${sessionId}`, { 
        method: 'DELETE' 
      });
      setSessionId(null);
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  };

  const addCell = (lang: "bash" | "python") => {
    const newCell: Cell = {
      id: Math.random().toString(36).slice(2),
      lang,
      code: lang === "python" ? "# Python code\n" : "# Bash command\n",
      status: "idle"
    };
    setCells(prev => [...prev, newCell]);
  };

  const runCell = async (cellId: string) => {
    const cellIndex = cells.findIndex(c => c.id === cellId);
    if (cellIndex === -1) return;

    const cell = cells[cellIndex];
    
    // Update cell status to running
    setCells(prev => prev.map(c => 
      c.id === cellId ? { ...c, status: "running" as const, output: "Running..." } : c
    ));

    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: cell.lang,
          code: cell.code,
          sessionId
        })
      });

      const result = await response.json();
      
      const output = result.stdout || '';
      const stderr = result.stderr || '';
      const fullOutput = stderr ? `${output}\n[stderr]\n${stderr}` : output;

      setCells(prev => prev.map(c => 
        c.id === cellId 
          ? { 
              ...c, 
              status: result.returncode === 0 ? "done" as const : "error" as const,
              output: fullOutput || "No output"
            } 
          : c
      ));
    } catch (error) {
      setCells(prev => prev.map(c => 
        c.id === cellId 
          ? { ...c, status: "error" as const, output: `Error: ${error}` } 
          : c
      ));
    }
  };

  const updateCell = (cellId: string, code: string) => {
    setCells(prev => prev.map(c => 
      c.id === cellId ? { ...c, code } : c
    ));
  };

  const deleteCell = (cellId: string) => {
    setCells(prev => prev.filter(c => c.id !== cellId));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "running": return "bg-yellow-500";
      case "done": return "bg-green-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Code Notebook
          </CardTitle>
          <div className="flex gap-2">
            {!sessionId ? (
              <Button onClick={openSession} size="sm">
                Start Session
              </Button>
            ) : (
              <Button onClick={closeSession} variant="outline" size="sm">
                Close Session
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Cell Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addCell("python")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Python
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addCell("bash")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Bash
          </Button>
        </div>

        {/* Cells */}
        <div className="space-y-4">
          {cells.map((cell, index) => (
            <div key={cell.id} className="border rounded-lg overflow-hidden">
              {/* Cell Header */}
              <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {cell.lang.toUpperCase()}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(cell.status)}`} />
                  <span className="text-xs text-gray-500">Cell {index + 1}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runCell(cell.id)}
                    disabled={!sessionId || cell.status === "running"}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteCell(cell.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Code Input */}
              <Textarea
                value={cell.code}
                onChange={(e) => updateCell(cell.id, e.target.value)}
                className="border-0 rounded-none font-mono text-sm min-h-[100px] resize-none"
                placeholder={`Enter ${cell.lang} code...`}
              />

              {/* Output */}
              {cell.output && (
                <div className="bg-gray-900 text-gray-100 p-3 font-mono text-xs">
                  <div className="text-gray-400 mb-1">Output:</div>
                  <pre className="whitespace-pre-wrap">{cell.output}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {cells.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No cells yet. Add a Python or Bash cell to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}