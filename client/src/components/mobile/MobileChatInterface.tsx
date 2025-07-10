import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Bot, 
  User, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function MobileChatInterface() {
  const {
    messages,
    currentInput,
    isTyping,
    tasks,
    activeTask,
    setInput,
    addMessage,
    addTask,
    updateTask,
    addTaskLog,
  } = useChatStore();
  
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput;
    setInput('');
    
    // Add user message
    addMessage({
      type: 'user',
      content: userMessage,
    });

    // Simulate AI processing
    addMessage({
      type: 'assistant',
      content: 'Processing your request...',
      status: 'pending',
    });

    // Create task based on input
    const taskId = addTask({
      title: `Task: ${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}`,
      description: userMessage,
      status: 'running',
      type: getTaskType(userMessage),
      progress: 0,
      logs: [],
      outputs: [],
    });

    // Simulate task processing
    setTimeout(() => {
      addTaskLog(taskId, 'Starting task execution...');
      updateTask(taskId, { progress: 25 });
      
      setTimeout(() => {
        addTaskLog(taskId, 'Processing data...');
        updateTask(taskId, { progress: 50 });
        
        setTimeout(() => {
          addTaskLog(taskId, 'Generating output...');
          updateTask(taskId, { progress: 75 });
          
          setTimeout(() => {
            addTaskLog(taskId, 'Task completed successfully');
            updateTask(taskId, { 
              status: 'complete', 
              progress: 100,
              actualTime: Math.floor(Math.random() * 30) + 10 
            });
            
            // Update assistant message
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.type === 'assistant') {
              addMessage({
                type: 'assistant',
                content: `Task completed! I've ${getTaskAction(userMessage)}. Check the Tasks tab for details and outputs.`,
                status: 'complete',
              });
            }
            
            toast.success('Task completed successfully!');
          }, 1000);
        }, 1000);
      }, 1000);
    }, 500);
  };

  const getTaskType = (input: string): 'automation' | 'analysis' | 'generation' | 'scraping' => {
    const lower = input.toLowerCase();
    if (lower.includes('scrape') || lower.includes('extract')) return 'scraping';
    if (lower.includes('analyze') || lower.includes('report')) return 'analysis';
    if (lower.includes('generate') || lower.includes('create')) return 'generation';
    return 'automation';
  };

  const getTaskAction = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('scrape')) return 'scraped the requested data';
    if (lower.includes('analyze')) return 'analyzed the information';
    if (lower.includes('generate')) return 'generated the content';
    if (lower.includes('create')) return 'created the requested output';
    return 'completed the automation';
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Listening... Speak now');
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInput(speechResult);
      setIsListening(false);
      toast.success('Voice input captured');
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice input failed');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const MessageIcon = ({ type, status }: { type: string; status?: string }) => {
    if (type === 'user') return <User className="w-4 h-4" />;
    if (status === 'pending') return <Loader2 className="w-4 h-4 animate-spin" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Bot className="w-4 h-4 text-blue-500" />;
  };

  const currentTask = tasks.find(task => task.id === activeTask);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MessageIcon type={message.type} status={message.status} />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.status && (
                  <div className="flex items-center gap-1 mt-1">
                    <Badge 
                      variant={message.status === 'error' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {message.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-500" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Active Task Status */}
      {currentTask && currentTask.status === 'running' && (
        <Card className="mx-4 mb-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Running Task</span>
              </div>
              <Badge variant="secondary">{currentTask.progress}%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentTask.progress}%` }}
              />
            </div>
            {currentTask.logs.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {currentTask.logs[currentTask.logs.length - 1]}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggested Builds - Horizontally Scrollable */}
      <div className="px-4 pb-3">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[
            "Generate marketing copy",
            "Analyze customer data", 
            "Create automation workflow",
            "Build data pipeline",
            "Generate reports",
            "Process documents",
            "Scrape product data",
            "Email automation"
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs px-3 py-2 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50 flex-shrink-0 min-w-fit"
              onClick={() => setInput(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => {}}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <input
            ref={inputRef}
            value={currentInput}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your automation request..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          <Button
            variant="ghost"
            size="sm"
            className={`text-gray-500 hover:text-gray-700 p-1 ${isListening ? 'text-red-500' : ''}`}
            onClick={handleVoiceInput}
            disabled={isListening}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>
          
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}