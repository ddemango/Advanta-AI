import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'complete' | 'error';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  type: 'automation' | 'analysis' | 'generation' | 'scraping';
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  logs: string[];
  outputs: TaskOutput[];
  estimatedTime?: number;
  actualTime?: number;
}

export interface TaskOutput {
  id: string;
  type: 'file' | 'text' | 'data' | 'url';
  name: string;
  content?: string;
  url?: string;
  size?: number;
  mimeType?: string;
  preview?: string;
}

interface ChatStore {
  // Chat state
  messages: ChatMessage[];
  isTyping: boolean;
  currentInput: string;
  
  // Task state
  tasks: Task[];
  activeTask: string | null;
  
  // UI state
  activeTab: 'chat' | 'tasks' | 'output' | 'settings';
  isMobile: boolean;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setTyping: (typing: boolean) => void;
  setInput: (input: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addTaskLog: (taskId: string, log: string) => void;
  addTaskOutput: (taskId: string, output: TaskOutput) => void;
  setActiveTask: (taskId: string | null) => void;
  
  // UI actions
  setActiveTab: (tab: 'chat' | 'tasks' | 'output' | 'settings') => void;
  setMobile: (mobile: boolean) => void;
  
  // Utilities
  clearChat: () => void;
  clearTasks: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      isTyping: false,
      currentInput: '',
      tasks: [],
      activeTask: null,
      activeTab: 'chat',
      isMobile: false,
      
      // Chat actions
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      
      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },
      
      setTyping: (typing) => set({ isTyping: typing }),
      setInput: (input) => set({ currentInput: input }),
      
      // Task actions
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: 0,
          logs: [],
          outputs: [],
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          activeTask: newTask.id,
        }));
        return newTask.id;
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      addTaskLog: (taskId, log) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { 
                  ...task, 
                  logs: [...task.logs, `${new Date().toLocaleTimeString()}: ${log}`],
                  updatedAt: new Date()
                }
              : task
          ),
        }));
      },
      
      addTaskOutput: (taskId, output) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { 
                  ...task, 
                  outputs: [...task.outputs, output],
                  updatedAt: new Date()
                }
              : task
          ),
        }));
      },
      
      setActiveTask: (taskId) => set({ activeTask: taskId }),
      
      // UI actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setMobile: (mobile) => set({ isMobile: mobile }),
      
      // Utilities
      clearChat: () => set({ messages: [] }),
      clearTasks: () => set({ tasks: [], activeTask: null }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        messages: state.messages,
        tasks: state.tasks,
        activeTab: state.activeTab,
      }),
    }
  )
);