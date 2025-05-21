import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@/lib/animations';

// Import the placeholder components that we'll replace with real implementations
const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Analytics Dashboard</h3>
        <div className="flex items-center space-x-4">
          <select className="bg-background border border-border rounded px-3 py-1">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Total Queries', 'Active Users', 'Avg. Response Time', 'Completion Rate'].map((metric, i) => (
          <Card key={i} className="p-4 bg-background">
            <div className="text-sm text-muted-foreground">{metric}</div>
            <div className="text-3xl font-bold text-primary mt-1">
              {i === 0 ? '942' : i === 1 ? '341' : i === 2 ? '1.2s' : '94.7%'}
            </div>
            <div className="text-xs text-green-500 mt-2">
              <span className="inline-block mr-1">&#9650;</span> 
              {i === 0 ? '12.5%' : i === 1 ? '8.2%' : i === 2 ? '15.3%' : '2.1%'} from previous period
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Usage Trends</h4>
        <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
          <p className="text-muted-foreground">Interactive usage analytics chart</p>
        </div>
      </Card>
    </div>
  );
};

const BotControlPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Bot Control Panel</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-green-500">Online</label>
            <div className="w-10 h-5 bg-green-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <span className="mr-2">🔄</span> Restart Bot
          </Button>
        </div>
      </div>
      
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Select Bot to Manage</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Customer Service Bot', 'Sales Assistant', 'Technical Support', 'Onboarding Guide'].map((bot, i) => (
            <div 
              key={i}
              className={`cursor-pointer border rounded-lg p-4 ${i === 0 ? 'border-primary bg-primary/10' : 'border-border'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{bot}</div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  i < 2 ? 'bg-green-500/20 text-green-500' : 
                  i === 2 ? 'bg-amber-500/20 text-amber-500' : 
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {i < 2 ? 'active' : i === 2 ? 'maintenance' : 'draft'}
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>{i === 0 ? 532 : i === 1 ? 347 : i === 2 ? 218 : 0} queries</span>
                <span>⭐ {i < 3 ? (4.8 - (i * 0.2)).toFixed(1) : 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="bg-background">
        <div className="flex border-b">
          <div className="px-4 py-2 font-medium border-b-2 border-primary">General</div>
          <div className="px-4 py-2 text-muted-foreground">Training</div>
          <div className="px-4 py-2 text-muted-foreground">Responses</div>
          <div className="px-4 py-2 text-muted-foreground">Integration</div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Learning Mode</label>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Allows the bot to learn from conversations
                  </div>
                  <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label>Response Speed</label>
                  <span className="text-sm text-muted-foreground">Balanced</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Knowledge Base</label>
                <select className="w-full bg-background border border-border rounded-md p-2">
                  <option>Latest Available Data</option>
                  <option>Up to 2023</option>
                  <option>Up to 2022</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2">Bot Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start bg-muted">
                    <span className="mr-2">🌐</span> Public
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🔒</span> Private
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const CrmIntegration = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">CRM Integration</h3>
        <Button>Connect</Button>
      </div>
      
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Select CRM Platform</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { name: 'Salesforce', icon: '☁️', color: '#1798c1' },
            { name: 'HubSpot', icon: '🔶', color: '#ff7a59' },
            { name: 'Zoho CRM', icon: '🟢', color: '#ea553d' },
            { name: 'MS Dynamics', icon: '🔷', color: '#002050' },
            { name: 'Pipedrive', icon: '🟩', color: '#26c371' }
          ].map((platform, i) => (
            <div 
              key={i}
              className={`cursor-pointer border rounded-lg p-4 transition-all text-center ${
                i === 0 ? 'border-primary bg-primary/10' : 'border-border'
              }`}
            >
              <div 
                className="text-2xl mb-2 mx-auto w-12 h-12 flex items-center justify-center rounded-full"
                style={{ backgroundColor: `${platform.color}20` }}
              >
                {platform.icon}
              </div>
              <div className="font-medium">{platform.name}</div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Connection Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">API Endpoint</label>
            <input 
              className="w-full bg-background border border-border rounded-md p-2"
              value="https://api.salesforce.com/v2/"
              readOnly
            />
          </div>
          
          <div>
            <label className="block mb-2">API Key</label>
            <div className="flex space-x-2">
              <input 
                type="password" 
                className="w-full bg-background border border-border rounded-md p-2"
                placeholder="Enter your API Key"
              />
              <Button variant="outline" className="px-3">
                <i className="fas fa-eye"></i>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <section className="py-20 relative overflow-hidden" id="client-portal">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client AI Suite</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access enterprise-grade tools to manage your AI solutions with comprehensive dashboards for analytics, bot controls, and CRM integrations.
          </p>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Card className="backdrop-blur-sm bg-background/70 border-primary/20 shadow-lg">
            <Tabs defaultValue="analytics" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
                <TabsTrigger value="bot-controls">Bot Controls</TabsTrigger>
                <TabsTrigger value="crm-integration">CRM Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="bot-controls" className="space-y-4">
                <BotControlPanel />
              </TabsContent>
              
              <TabsContent value="crm-integration" className="space-y-4">
                <CrmIntegration />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Ready to integrate these tools into your business workflow?
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href="/calculator">Build My AI Stack</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}