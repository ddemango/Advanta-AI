import { useChatStore } from '@/stores/chatStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  History, 
  FolderOpen, 
  Settings,
  Bot,
  Play
} from 'lucide-react';

export function MobileBottomNav() {
  const { activeTab, setActiveTab, tasks, messages } = useChatStore();
  
  const runningTasks = tasks.filter(task => task.status === 'running').length;
  const totalOutputs = tasks.reduce((acc, task) => acc + task.outputs.length, 0);
  const unreadMessages = 0; // No unread count for now

  const navItems = [
    {
      id: 'chat' as const,
      label: 'Chat',
      icon: MessageCircle,
      badge: null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'tasks' as const,
      label: 'Tasks',
      icon: History,
      badge: runningTasks > 0 ? runningTasks : null,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'output' as const,
      label: 'Output',
      icon: FolderOpen,
      badge: null,
      badgeColor: 'bg-green-500'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      badge: null,
      badgeColor: ''
    }
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 px-1 relative ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
                {item.badge && (
                  <Badge 
                    className={`absolute -top-2 -right-2 h-4 min-w-4 px-1 text-xs text-white ${item.badgeColor} border-white border-2`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs leading-none ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}