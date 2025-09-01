import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Building, Lock } from 'lucide-react';

export type UserPlan = 'free' | 'pro' | 'enterprise';

interface PlanGateProps {
  feature: string;
  requiredPlans: UserPlan[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PlanGate({ feature, requiredPlans, children, fallback }: PlanGateProps) {
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/ai-portal/me');
        const data = await response.json();
        if (data.ok) {
          setUserPlan(data.user.plan || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch user plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded h-10 w-full" />;
  }

  const hasAccess = requiredPlans.includes(userPlan);

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback || (
    <PlanUpgradePrompt 
      feature={feature}
      requiredPlans={requiredPlans}
      userPlan={userPlan}
    />
  );
}

interface PlanUpgradePromptProps {
  feature: string;
  requiredPlans: UserPlan[];
  userPlan: UserPlan;
}

function PlanUpgradePrompt({ feature, requiredPlans, userPlan }: PlanUpgradePromptProps) {
  const getLowestRequiredPlan = (): UserPlan => {
    const planOrder: UserPlan[] = ['free', 'pro', 'enterprise'];
    for (const plan of planOrder) {
      if (requiredPlans.includes(plan)) {
        return plan;
      }
    }
    return 'pro';
  };

  const targetPlan = getLowestRequiredPlan();

  const planConfig = {
    pro: {
      icon: <Crown className="h-5 w-5" />,
      name: 'Pro',
      price: '$29/month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    enterprise: {
      icon: <Building className="h-5 w-5" />,
      name: 'Enterprise',
      price: 'Custom pricing',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  };

  const config = planConfig[targetPlan as keyof typeof planConfig];

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${config.bgColor} ${config.color}`}>
              <Lock className="h-8 w-8" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {feature} requires {config.name}
            </h3>
            <p className="text-gray-600 text-sm">
              Upgrade to unlock advanced AI capabilities and enhanced productivity features.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {config.icon}
            <Badge variant="secondary" className={config.color}>
              Current: {userPlan.toUpperCase()}
            </Badge>
            <span className="text-gray-400">→</span>
            <Badge className={`${config.color} bg-white border`}>
              Upgrade to {config.name}
            </Badge>
          </div>

          <div className="space-y-2">
            <Button className={`w-full ${config.color} bg-white border hover:bg-gray-50`}>
              <Zap className="h-4 w-4 mr-2" />
              Upgrade to {config.name} - {config.price}
            </Button>
            <p className="text-xs text-gray-500">
              Unlock {feature} and all {config.name} features
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlanBadge() {
  const [plan, setPlan] = useState<UserPlan>('free');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch('/api/ai-portal/me');
        const data = await response.json();
        if (data.ok) {
          setPlan(data.user.plan || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
      }
    };

    fetchPlan();
  }, []);

  const planConfig = {
    free: { color: 'bg-gray-100 text-gray-800', icon: null },
    pro: { color: 'bg-blue-100 text-blue-800', icon: <Crown className="h-3 w-3" /> },
    enterprise: { color: 'bg-purple-100 text-purple-800', icon: <Building className="h-3 w-3" /> }
  };

  const config = planConfig[plan];

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {plan.toUpperCase()}
    </Badge>
  );
}