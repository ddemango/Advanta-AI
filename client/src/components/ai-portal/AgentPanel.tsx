import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Plus, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Target,
  Workflow,
  BarChart3,
  Edit3
} from 'lucide-react';
import { AgentDagEditor } from './AgentDagEditor';

interface Agent {
  id: string;
  name: string;
  description?: string;
  defaultModel?: string;
  createdAt: string;
}

interface AgentRun {
  id: string;
  agentId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  goal: string;
  creditsUsed: number;
  createdAt: string;
  finishedAt?: string;
  error?: string;
  steps?: AgentStep[];
}

interface AgentStep {
  id: string;
  index: number;
  tool: string;
  status: 'queued' | 'running' | 'done' | 'error';
  error?: string;
  startedAt?: string;
  finishedAt?: string;
}

const statusIcons = {
  queued: Clock,
  running: Loader2,
  done: CheckCircle,
  succeeded: CheckCircle,
  failed: XCircle,
  error: XCircle,
  cancelled: Square
};

const statusColors = {
  queued: 'text-yellow-500',
  running: 'text-blue-500',
  done: 'text-green-500',
  succeeded: 'text-green-500',
  failed: 'text-red-500',
  error: 'text-red-500',
  cancelled: 'text-gray-500'
};

export function AgentPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeRun, setActiveRun] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Create/Run forms
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showDagEditor, setShowDagEditor] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [runGoal, setRunGoal] = useState('');

  useEffect(() => {
    loadAgents();
    loadRuns();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      if (data.ok) {
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadRuns = async () => {
    try {
      const response = await fetch('/api/agent-runs');
      const data = await response.json();
      if (data.ok) {
        setRuns(data.runs || []);
      }
    } catch (error) {
      console.error('Failed to load runs:', error);
    }
  };

  const createAgent = async () => {
    if (!newAgentName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAgentName,
          description: newAgentDescription,
          defaultModel: 'gpt-4o'
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        setAgents(prev => [data.agent, ...prev]);
        setNewAgentName('');
        setNewAgentDescription('');
        setShowCreateAgent(false);
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async (agentId: string) => {
    if (!runGoal.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: runGoal })
      });
      
      const data = await response.json();
      if (data.ok) {
        setRunGoal('');
        loadRuns();
        // Start polling for updates
        pollRunStatus(data.runId);
      } else if (response.status === 403) {
        alert('DeepAgent functionality requires Pro or Enterprise plan. Please upgrade to access multi-step agents.');
      }
    } catch (error) {
      console.error('Failed to run agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const pollRunStatus = async (runId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/agent-runs/${runId}`);
        const data = await response.json();
        if (data.ok && data.run) {
          setRuns(prev => prev.map(r => r.id === runId ? data.run : r));
          
          if (['succeeded', 'failed', 'cancelled'].includes(data.run.status)) {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Failed to poll run status:', error);
        clearInterval(pollInterval);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DeepAgent Studio</h2>
          <p className="text-gray-600">Multi-step AI agents with tool chains</p>
        </div>
        <Button 
          onClick={() => setShowCreateAgent(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              My Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No agents created yet. Create your first multi-step agent to get started.
              </p>
            ) : (
              agents.map(agent => (
                <div
                  key={agent.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <h3 className="font-medium">{agent.name}</h3>
                  {agent.description && (
                    <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="secondary">{agent.defaultModel || 'gpt-4o'}</Badge>
                      <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAgent(agent);
                        setShowDagEditor(true);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit Workflow
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Agent Runner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Run Agent
              {selectedAgent && <Badge variant="outline">{selectedAgent.name}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedAgent ? (
              <>
                <div>
                  <label className="text-sm font-medium">Goal</label>
                  <Textarea
                    value={runGoal}
                    onChange={(e) => setRunGoal(e.target.value)}
                    placeholder="Describe what you want the agent to accomplish..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={() => runAgent(selectedAgent.id)}
                  disabled={loading || !runGoal.trim()}
                  className="w-full flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {loading ? 'Starting Agent...' : 'Run Agent'}
                </Button>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select an agent to run it
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No agent runs yet
            </p>
          ) : (
            <div className="space-y-3">
              {runs.slice(0, 10).map(run => {
                const StatusIcon = statusIcons[run.status];
                const agent = agents.find(a => a.id === run.agentId);
                
                return (
                  <div
                    key={run.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setActiveRun(activeRun?.id === run.id ? null : run)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-5 w-5 ${statusColors[run.status]} ${run.status === 'running' ? 'animate-spin' : ''}`} />
                        <div>
                          <p className="font-medium line-clamp-1">{run.goal}</p>
                          <p className="text-sm text-gray-600">
                            {agent?.name || 'Unknown Agent'} • {run.creditsUsed} credits
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(run.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    {run.error && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {run.error}
                      </div>
                    )}
                    
                    {activeRun?.id === run.id && run.steps && (
                      <div className="mt-3 pl-8 space-y-2">
                        <p className="text-sm font-medium">Execution Steps:</p>
                        {run.steps.map(step => {
                          const StepIcon = statusIcons[step.status];
                          return (
                            <div key={step.id} className="flex items-center gap-2 text-sm">
                              <StepIcon className={`h-4 w-4 ${statusColors[step.status]}`} />
                              <span className="capitalize">{step.tool}</span>
                              {step.error && <span className="text-red-600">- {step.error}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle>Create New Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="My Research Agent"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newAgentDescription}
                  onChange={(e) => setNewAgentDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => setShowCreateAgent(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={createAgent} 
                  disabled={loading || !newAgentName.trim()}
                  className="flex-1"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DAG Editor Modal */}
      {showDagEditor && editingAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                Edit Workflow: {editingAgent.name}
              </h2>
              <Button
                onClick={() => {
                  setShowDagEditor(false);
                  setEditingAgent(null);
                }}
                variant="outline"
              >
                Close
              </Button>
            </div>
            <div className="p-4 h-[calc(100%-80px)] overflow-auto">
              <AgentDagEditor 
                agentId={editingAgent.id}
                initial={undefined} // In production, pass saved graph data
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentPanel;