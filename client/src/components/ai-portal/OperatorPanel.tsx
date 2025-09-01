import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Terminal, Play, Square, Trash2, Clock, HardDrive } from 'lucide-react';

interface OperatorSession {
  id: string;
  sessionId: string;
  status: string;
  workspaceDir: string;
  lastUsed: string;
  createdAt: string;
}

interface CommandResult {
  stdout: string;
  stderr: string;
  cwd: string;
  listing: string[];
  executionTime: number;
  dockerUsed: boolean;
}

export function OperatorPanel() {
  const [sessions, setSessions] = useState<OperatorSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [command, setCommand] = useState('python -V && echo "Hello from AI Portal!" > hello.txt && ls -la');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/operator/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const createSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/operator/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentSession(data.session.sessionId);
        await fetchSessions();
        setOutput(`Session ${data.session.sessionId} created\nWorkspace: ${data.session.dir}\n\n`);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      setOutput('Error: Failed to create session\n');
    } finally {
      setLoading(false);
    }
  };

  const runCommand = async () => {
    if (!currentSession || !command.trim()) return;
    
    setRunning(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/operator/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession,
          cmd: command
        })
      });
      
      const data = await response.json();
      const endTime = Date.now();
      
      if (data.ok) {
        const result: CommandResult = data;
        let outputText = `$ ${command}\n\n`;
        
        if (result.stdout) {
          outputText += result.stdout + '\n';
        }
        
        if (result.stderr) {
          outputText += '\n[stderr]\n' + result.stderr + '\n';
        }
        
        outputText += `\n[execution info]\n`;
        outputText += `Time: ${result.executionTime}ms\n`;
        outputText += `Docker: ${result.dockerUsed ? 'Yes' : 'No (local fallback)'}\n`;
        outputText += `Working Directory: ${result.cwd}\n\n`;
        
        if (result.listing && result.listing.length > 0) {
          outputText += '[workspace contents]\n' + result.listing.join('\n') + '\n';
        }
        
        setOutput(outputText);
      } else {
        setOutput(`Error: ${data.error}\n`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setRunning(false);
    }
  };

  const destroySession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/operator/session/${sessionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        if (currentSession === sessionId) {
          setCurrentSession(null);
          setOutput('');
        }
        await fetchSessions();
      }
    } catch (error) {
      console.error('Failed to destroy session:', error);
    }
  };

  const activeSessions = sessions.filter(s => s.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Operator (Virtual Computer)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Management */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={createSession} 
            disabled={loading}
            variant="default"
            size="sm"
          >
            <Terminal className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'New Session'}
          </Button>
          
          {activeSessions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-zinc-400">Active:</span>
              {activeSessions.map((session) => (
                <div key={session.sessionId} className="flex items-center gap-1">
                  <Button
                    variant={currentSession === session.sessionId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentSession(session.sessionId)}
                  >
                    {session.sessionId.slice(0, 8)}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => destroySession(session.sessionId)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session Info */}
        {currentSession && (
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">Session: {currentSession.slice(0, 8)}</Badge>
            <div className="flex items-center gap-1 text-zinc-400">
              <HardDrive className="w-3 h-3" />
              Isolated Workspace
            </div>
          </div>
        )}

        {/* Command Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Command</label>
          <Textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter shell commands to execute..."
            className="font-mono text-sm min-h-[80px]"
            disabled={!currentSession}
          />
        </div>

        {/* Execute Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={runCommand}
            disabled={!currentSession || running || !command.trim()}
            className="flex-1"
          >
            {running ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOutput('')}
            disabled={!output}
          >
            Clear
          </Button>
        </div>

        {/* Output */}
        {output && (
          <div>
            <label className="text-sm font-medium mb-2 block">Output</label>
            <pre className="bg-zinc-900 p-3 rounded text-xs overflow-auto max-h-96 border border-zinc-700">
              {output}
            </pre>
          </div>
        )}

        {/* Help Text */}
        {!currentSession && (
          <div className="text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded">
            <strong>Virtual Computer Features:</strong>
            <br />• Isolated workspace with persistent files
            <br />• Docker containerization (production) or secure local execution (development)
            <br />• Python, shell commands, and file operations
            <br />• Automatic cleanup after 24 hours of inactivity
            <br />• Network restrictions and resource limits for security
          </div>
        )}
      </CardContent>
    </Card>
  );
}