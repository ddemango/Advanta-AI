import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Save, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowDefinition {
  name: string;
  description: string;
  steps: WorkflowStep[];
}

interface WorkflowPreviewProps {
  workflow: WorkflowDefinition;
  onSave: (workflow: WorkflowDefinition) => void;
  onExecute: (workflow: WorkflowDefinition) => void;
  onEdit: () => void;
  isLoading?: boolean;
}

const appIcons: Record<string, string> = {
  slack: '💬',
  notion: '📝',
  airtable: '📊',
  calendly: '📅',
  gmail: '📧',
  stripe: '💳',
  hubspot: '🏢',
  trello: '📋',
  discord: '🎮',
  zoom: '📹',
  webhook: '🔗'
};

export function WorkflowPreview({ workflow, onSave, onExecute, onEdit, isLoading }: WorkflowPreviewProps) {
  const getStepIcon = (app: string) => appIcons[app.toLowerCase()] || '⚡';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{workflow.name}</span>
              <Badge variant="outline" className="text-xs">
                {workflow.steps.length} steps
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workflow Steps Visualization */}
        <div className="space-y-4">
          {workflow.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {index > 0 && (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div className={`flex items-center gap-3 p-4 rounded-lg flex-1 ${
                step.type === 'trigger' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : step.type === 'condition'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="text-2xl">
                  {step.type === 'trigger' ? '⏰' : step.type === 'condition' ? '❓' : '⚡'}
                </div>
                <div>
                  <div className="font-medium text-sm">{step.name}</div>
                  <div className="text-xs text-gray-600">
                    {Object.keys(step.config).length > 0 
                      ? Object.entries(step.config).slice(0, 2).map(([key, value]) => 
                          `${key}: ${typeof value === 'string' ? value.slice(0, 30) : value}`
                        ).join(', ')
                      : 'No configuration'
                    }
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs capitalize">
                  {step.type}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={() => onSave(workflow)} disabled={isLoading} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Workflow
          </Button>
          <Button 
            onClick={() => onExecute(workflow)} 
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Test Run
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}