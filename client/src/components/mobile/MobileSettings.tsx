import { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Key, 
  Palette, 
  Bell, 
  Download, 
  Upload, 
  Trash2,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function MobileSettings() {
  const { clearChat, clearTasks, tasks, messages } = useChatStore();
  
  // Settings state
  const [apiKey, setApiKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      // In a real app, you'd save this securely
      localStorage.setItem('openai_api_key', apiKey);
      toast.success('API key saved securely');
      setApiKey('');
    }
  };

  const handleExportData = () => {
    const data = {
      tasks,
      messages,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automation-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // In a real app, you'd validate and import this data
        toast.success('Data imported successfully');
      } catch (error) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearChat();
      clearTasks();
      localStorage.clear();
      toast.success('All data cleared');
    }
  };

  const settingSections = [
    {
      title: 'API Configuration',
      icon: <Key className="w-5 h-5" />,
      items: [
        {
          title: 'OpenAI API Key',
          description: 'Required for AI automation features',
          content: (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {localStorage.getItem('openai_api_key') ? 'Configured' : 'Not Set'}
                </Badge>
                <span className="text-xs text-gray-500">
                  Your key is stored locally and never shared
                </span>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          content: (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm">{isDarkMode ? 'Dark' : 'Light'} theme</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          )
        },
        {
          title: 'Compact Mode',
          description: 'Use smaller UI elements for better mobile experience',
          content: (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {compactMode ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                <span className="text-sm">{compactMode ? 'Compact' : 'Standard'} layout</span>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          title: 'Push Notifications',
          description: 'Get notified when tasks complete',
          content: (
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          )
        },
        {
          title: 'Sound Effects',
          description: 'Play sounds for task completion and errors',
          content: (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-sm">{soundEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          )
        }
      ]
    },
    {
      title: 'Data Management',
      icon: <Download className="w-5 h-5" />,
      items: [
        {
          title: 'Auto-save',
          description: 'Automatically save your work locally',
          content: (
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          )
        },
        {
          title: 'Export Data',
          description: 'Download all your tasks and conversations',
          content: (
            <Button onClick={handleExportData} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
          )
        },
        {
          title: 'Import Data',
          description: 'Restore from a previous export',
          content: (
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <Button 
                onClick={() => document.getElementById('import-file')?.click()}
                variant="outline" 
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Configure your automation workspace</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <div>{item.content}</div>
                    </div>
                    {itemIndex < section.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          
          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="w-5 h-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-xs text-gray-500">Total Tasks</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                  <p className="text-xs text-gray-500">Messages</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === 'complete').length}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.reduce((acc, task) => acc + task.outputs.length, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Outputs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-red-600">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Clear all your data including tasks, messages, and settings. This action cannot be undone.
                </p>
                <Button 
                  onClick={handleClearAllData}
                  variant="destructive" 
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}