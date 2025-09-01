import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal as TerminalIcon, Play, Square, RotateCcw } from 'lucide-react';

export function OperatorTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal>();
  const websocket = useRef<WebSocket>();
  const fitAddon = useRef<FitAddon>();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    try {
      setStatus('connecting');
      setError(null);
      
      const response = await fetch('/api/operator/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setSessionId(data.session.id);
      } else {
        throw new Error(data.error || 'Failed to create session');
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  const connectTerminal = async () => {
    if (!sessionId || !terminalRef.current) return;

    try {
      // Clean up existing terminal
      if (terminal.current) {
        terminal.current.dispose();
      }
      if (websocket.current) {
        websocket.current.close();
      }

      // Create new terminal
      const term = new Terminal({
        convertEol: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        cursorBlink: true,
        theme: {
          background: '#1a1a1a',
          foreground: '#ffffff',
          cursor: '#ffffff',
          black: '#000000',
          red: '#ff5555',
          green: '#50fa7b',
          yellow: '#f1fa8c',
          blue: '#bd93f9',
          magenta: '#ff79c6',
          cyan: '#8be9fd',
          white: '#bfbfbf',
          brightBlack: '#4d4d4d',
          brightRed: '#ff6e67',
          brightGreen: '#5af78e',
          brightYellow: '#f4f99d',
          brightBlue: '#caa9fa',
          brightMagenta: '#ff92d0',
          brightCyan: '#9aedfe',
          brightWhite: '#e6e6e6'
        }
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      
      term.open(terminalRef.current);
      fit.fit();
      
      term.write('🔐 Authenticating terminal session...\r\n');

      // Get signed WebSocket ticket
      const ticketResponse = await fetch(`/api/operator/ticket?sessionId=${encodeURIComponent(sessionId)}`);
      const ticketData = await ticketResponse.json();
      
      if (!ticketData.ok) {
        throw new Error(ticketData.error || 'Failed to get terminal ticket');
      }

      // Connect WebSocket with JWT ticket
      const ws = new WebSocket(ticketData.ws);
      
      ws.onopen = () => {
        setStatus('connected');
        term.write('✅ Terminal connected!\r\n');
      };
      
      ws.onmessage = (event) => {
        term.write(event.data);
      };
      
      ws.onclose = () => {
        setStatus('disconnected');
        term.write('\r\n💔 Terminal disconnected\r\n');
      };
      
      ws.onerror = (err) => {
        setStatus('error');
        setError('WebSocket connection failed');
        term.write('\r\n❌ Connection error\r\n');
      };

      term.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'data', data }));
        }
      });

      term.onResize(({ cols, rows }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', data: { cols, rows } }));
        }
      });

      terminal.current = term;
      websocket.current = ws;
      fitAddon.current = fit;

      // Handle window resize
      const handleResize = () => {
        setTimeout(() => fit.fit(), 100);
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
      
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  const closeSession = async () => {
    if (websocket.current) {
      websocket.current.close();
    }
    if (terminal.current) {
      terminal.current.dispose();
    }
    
    if (sessionId) {
      try {
        await fetch(`/api/operator/session/${sessionId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Failed to clean up session:', err);
      }
    }
    
    setSessionId(null);
    setStatus('disconnected');
    setError(null);
  };

  useEffect(() => {
    if (sessionId && status === 'connecting') {
      connectTerminal();
    }
  }, [sessionId, status]);

  useEffect(() => {
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
      if (terminal.current) {
        terminal.current.dispose();
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5" />
            <CardTitle>Virtual Computer Terminal</CardTitle>
            <Badge variant={status === 'connected' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!sessionId ? (
              <Button onClick={createSession} size="sm" disabled={status === 'connecting'}>
                <Play className="h-4 w-4 mr-1" />
                Start Session
              </Button>
            ) : (
              <>
                <Button onClick={connectTerminal} size="sm" variant="outline" disabled={status === 'connected'}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reconnect
                </Button>
                <Button onClick={closeSession} size="sm" variant="destructive">
                  <Square className="h-4 w-4 mr-1" />
                  Close Session
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            ❌ {error}
          </div>
        )}
        
        <div 
          ref={terminalRef}
          className="h-96 w-full border border-gray-200 rounded-lg bg-black overflow-hidden"
          style={{ minHeight: '400px' }}
        />
        
        {!sessionId && (
          <div className="mt-4 text-sm text-gray-500 space-y-2">
            <p>🚀 <strong>Virtual Computer Features:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Isolated Python environment with popular libraries</li>
              <li>Persistent file storage during session</li>
              <li>Secure containerized execution</li>
              <li>Real-time terminal interaction</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}