import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight,
  Play, 
  MoreVertical,
  Download,
  Share,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bot,
  FileText,
  Database,
  Zap
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';

export function MobileTaskHistory() {
  const { tasks, updateTask, setActiveTask, addTaskLog } = useChatStore();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'automation': return <Zap className="w-4 h-4" />;
      case 'analysis': return <Database className="w-4 h-4" />;
      case 'generation': return <FileText className="w-4 h-4" />;
      case 'scraping': return <Bot className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'complete': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRerunTask = (task: any) => {
    updateTask(task.id, {
      status: 'running',
      progress: 0,
      logs: [...task.logs, `${new Date().toLocaleTimeString()}: Task restarted`]
    });
    setActiveTask(task.id);
    toast.success('Task restarted');
  };

  const handleDeleteTask = (taskId: string) => {
    // In a real app, you'd remove from store
    toast.success('Task deleted');
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automation': return 'bg-purple-100 text-purple-800';
      case 'analysis': return 'bg-blue-100 text-blue-800';
      case 'generation': return 'bg-green-100 text-green-800';
      case 'scraping': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Bot className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500 mb-4">Start a conversation in the Chat tab to create your first automation task.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2 className="text-lg font-semibold text-gray-900">Task History</h2>
        <p className="text-sm text-gray-500">{tasks.length} total tasks</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <Collapsible 
                open={expandedTasks.has(task.id)}
                onOpenChange={() => toggleExpanded(task.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${getTypeColor(task.type)}`}>
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">
                            {task.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className={getStatusColor(task.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(task.status)}
                                {task.status}
                              </div>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {expandedTasks.has(task.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {task.status === 'running' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Task Details */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      
                      {/* Timing Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <p className="font-medium">{task.createdAt.toLocaleTimeString()}</p>
                        </div>
                        {task.actualTime && (
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-medium">{formatDuration(task.actualTime)}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Logs */}
                      {task.logs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Logs</h4>
                          <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                            {task.logs.slice(-5).map((log, index) => (
                              <p key={index} className="text-xs text-gray-600 mb-1 last:mb-0">
                                {log}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Outputs */}
                      {task.outputs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Outputs</h4>
                          <div className="space-y-2">
                            {task.outputs.map((output) => (
                              <div key={output.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium">{output.name}</span>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRerunTask(task)}
                          disabled={task.status === 'running'}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Rerun
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Share className="w-3 h-3 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}