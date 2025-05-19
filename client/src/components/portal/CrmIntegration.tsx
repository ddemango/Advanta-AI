import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// CRM Integration panel for connecting AI to CRM systems
export function CrmIntegration() {
  // Integration states
  const [selectedCrm, setSelectedCrm] = useState('salesforce');
  const [syncContacts, setSyncContacts] = useState(true);
  const [syncDeals, setSyncDeals] = useState(true);
  const [syncActivities, setSyncActivities] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('daily');
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Simulated CRM platforms
  const crmPlatforms = [
    { id: 'salesforce', name: 'Salesforce', icon: '☁️', color: '#1798c1' },
    { id: 'hubspot', name: 'HubSpot', icon: '🔶', color: '#ff7a59' },
    { id: 'zoho', name: 'Zoho CRM', icon: '🟢', color: '#ea553d' },
    { id: 'dynamics', name: 'Microsoft Dynamics', icon: '🔷', color: '#002050' },
    { id: 'pipedrive', name: 'Pipedrive', icon: '🟩', color: '#26c371' }
  ];

  // Mock connection to CRM
  const handleConnect = () => {
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  // Mock disconnection from CRM
  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
  };

  // Generate synced data stats based on selected CRM
  const getSyncStats = () => {
    switch(selectedCrm) {
      case 'salesforce':
        return { contacts: 1247, deals: 342, activities: 2891, lastSync: '2 hours ago' };
      case 'hubspot':
        return { contacts: 896, deals: 178, activities: 1543, lastSync: '4 hours ago' };
      case 'zoho':
        return { contacts: 642, deals: 154, activities: 1128, lastSync: '1 day ago' };
      case 'dynamics':
        return { contacts: 1872, deals: 489, activities: 3245, lastSync: '6 hours ago' };
      case 'pipedrive':
        return { contacts: 453, deals: 97, activities: 754, lastSync: '12 hours ago' };
      default:
        return { contacts: 0, deals: 0, activities: 0, lastSync: 'Never' };
    }
  };

  const syncStats = getSyncStats();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold">CRM Integration</h3>
        
        <div className="flex items-center space-x-2">
          {connectionStatus === 'connected' ? (
            <Button variant="outline" onClick={handleDisconnect} className="text-red-500 border-red-500 hover:bg-red-500/10">
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={connectionStatus === 'connecting'}>
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
            </Button>
          )}
        </div>
      </div>
      
      {/* CRM Platform Selection */}
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Select CRM Platform</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {crmPlatforms.map((platform) => (
            <div 
              key={platform.id}
              className={`cursor-pointer border rounded-lg p-4 transition-all text-center ${
                selectedCrm === platform.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedCrm(platform.id)}
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
      
      {/* Connection Settings */}
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Connection Settings</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>API Endpoint</Label>
              <Input 
                placeholder="https://api.example.com/v2/" 
                className="mt-2"
                value={`https://api.${selectedCrm}.com/v2/`}
                readOnly
              />
            </div>
            
            <div>
              <Label>API Key</Label>
              <div className="flex space-x-2 mt-2">
                <Input 
                  type="password" 
                  placeholder="Enter your API Key" 
                  value={connectionStatus === 'connected' ? '●●●●●●●●●●●●●●●●●●●●' : ''}
                  readOnly={connectionStatus === 'connected'}
                />
                <Button variant="outline" size="icon">
                  <i className="fas fa-eye"></i>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Authentication Method</Label>
              <Select defaultValue="oauth2">
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select auth method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Environment</Label>
              <Select defaultValue="production">
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Data Synchronization */}
      <Card className="p-6 bg-background">
        <h4 className="text-lg font-medium mb-4">Data Synchronization</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Sync Contacts</h5>
              <p className="text-sm text-muted-foreground">
                Sync contact information between AI and CRM
              </p>
            </div>
            <Switch 
              checked={syncContacts} 
              onCheckedChange={setSyncContacts} 
              disabled={connectionStatus !== 'connected'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Sync Deals/Opportunities</h5>
              <p className="text-sm text-muted-foreground">
                Sync deal stages, values, and activities
              </p>
            </div>
            <Switch 
              checked={syncDeals} 
              onCheckedChange={setSyncDeals} 
              disabled={connectionStatus !== 'connected'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Sync Activities</h5>
              <p className="text-sm text-muted-foreground">
                Sync tasks, calls, meetings, and notes
              </p>
            </div>
            <Switch 
              checked={syncActivities} 
              onCheckedChange={setSyncActivities} 
              disabled={connectionStatus !== 'connected'}
            />
          </div>
          
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="font-medium">Automatic Sync</h5>
                <p className="text-sm text-muted-foreground">
                  Sync data automatically on a schedule
                </p>
              </div>
              <Switch 
                checked={autoSync} 
                onCheckedChange={setAutoSync} 
                disabled={connectionStatus !== 'connected'}
              />
            </div>
            
            {autoSync && (
              <div>
                <Label>Sync Frequency</Label>
                <Select 
                  value={syncFrequency} 
                  onValueChange={setSyncFrequency}
                  disabled={connectionStatus !== 'connected'}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Sync Status */}
      {connectionStatus === 'connected' && (
        <Card className="p-6 bg-background">
          <h4 className="text-lg font-medium mb-4">Sync Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{syncStats.contacts}</div>
              <div className="text-sm text-muted-foreground">Contacts Synced</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{syncStats.deals}</div>
              <div className="text-sm text-muted-foreground">Deals Synced</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{syncStats.activities}</div>
              <div className="text-sm text-muted-foreground">Activities Synced</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-primary mb-1">Last Sync</div>
              <div className="text-lg font-bold">{syncStats.lastSync}</div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline">
              <span className="mr-2">🔄</span> Sync Now
            </Button>
          </div>
        </Card>
      )}
      
      {/* Field Mapping */}
      {connectionStatus === 'connected' && (
        <Card className="p-6 bg-background">
          <h4 className="text-lg font-medium mb-4">Field Mapping</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground">
              <div>AI Field</div>
              <div>CRM Field</div>
              <div>Sync Direction</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center border-b border-border pb-2">
              <div>User Name</div>
              <div className="flex items-center">
                <Select defaultValue="contact_name">
                  <SelectTrigger>
                    <SelectValue placeholder="Map to field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact_name">Contact Name</SelectItem>
                    <SelectItem value="full_name">Full Name</SelectItem>
                    <SelectItem value="display_name">Display Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="bidirectional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bidirectional">↔️ Both Ways</SelectItem>
                    <SelectItem value="to_crm">→ To CRM</SelectItem>
                    <SelectItem value="from_crm">← From CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center border-b border-border pb-2">
              <div>User Email</div>
              <div>
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue placeholder="Map to field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="contact_email">Contact Email</SelectItem>
                    <SelectItem value="primary_email">Primary Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="bidirectional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bidirectional">↔️ Both Ways</SelectItem>
                    <SelectItem value="to_crm">→ To CRM</SelectItem>
                    <SelectItem value="from_crm">← From CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center border-b border-border pb-2">
              <div>Conversation History</div>
              <div>
                <Select defaultValue="activity_notes">
                  <SelectTrigger>
                    <SelectValue placeholder="Map to field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activity_notes">Activity Notes</SelectItem>
                    <SelectItem value="contact_notes">Contact Notes</SelectItem>
                    <SelectItem value="interaction_log">Interaction Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="to_crm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bidirectional">↔️ Both Ways</SelectItem>
                    <SelectItem value="to_crm">→ To CRM</SelectItem>
                    <SelectItem value="from_crm">← From CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center">
              <div>User Preferences</div>
              <div>
                <Select defaultValue="custom_fields">
                  <SelectTrigger>
                    <SelectValue placeholder="Map to field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom_fields">Custom Fields</SelectItem>
                    <SelectItem value="preferences">Preferences</SelectItem>
                    <SelectItem value="contact_details">Contact Details</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select defaultValue="bidirectional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bidirectional">↔️ Both Ways</SelectItem>
                    <SelectItem value="to_crm">→ To CRM</SelectItem>
                    <SelectItem value="from_crm">← From CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-2">
              <span className="mr-2">+</span> Add Field Mapping
            </Button>
          </div>
        </Card>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">Reset Settings</Button>
        <Button disabled={connectionStatus !== 'connected'}>Save Integration</Button>
      </div>
    </div>
  );
}