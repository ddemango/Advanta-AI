import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface UserActivity {
  pageVisits: Record<string, number>;
  toolsUsed: string[];
  lastVisited: Record<string, number>;
  preferences: string[];
  sessionStart: number;
}

interface UserBehavior {
  isNewUser: boolean;
  favoriteCategories: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  visitedPages: string[];
  timeSpentOnPages: Record<string, number>;
}

export function useUserTracking() {
  const [location] = useLocation();
  const [userActivity, setUserActivity] = useState<UserActivity>(() => {
    const stored = localStorage.getItem('advanta-user-activity');
    return stored ? JSON.parse(stored) : {
      pageVisits: {},
      toolsUsed: [],
      lastVisited: {},
      preferences: [],
      sessionStart: Date.now()
    };
  });

  const [pageStartTime, setPageStartTime] = useState(Date.now());

  // Track page visits and time spent
  useEffect(() => {
    const currentPath = location;
    const now = Date.now();
    
    // Update page visit count
    setUserActivity(prev => {
      const updated = {
        ...prev,
        pageVisits: {
          ...prev.pageVisits,
          [currentPath]: (prev.pageVisits[currentPath] || 0) + 1
        },
        lastVisited: {
          ...prev.lastVisited,
          [currentPath]: now
        }
      };
      
      localStorage.setItem('advanta-user-activity', JSON.stringify(updated));
      return updated;
    });

    setPageStartTime(now);

    // Track when user leaves the page
    return () => {
      const timeSpent = Date.now() - pageStartTime;
      if (timeSpent > 5000) { // Only track if spent more than 5 seconds
        setUserActivity(prev => {
          const updated = {
            ...prev,
            lastVisited: {
              ...prev.lastVisited,
              [`${currentPath}_duration`]: timeSpent
            }
          };
          localStorage.setItem('advanta-user-activity', JSON.stringify(updated));
          return updated;
        });
      }
    };
  }, [location]);

  // Track tool usage
  const trackToolUsage = (toolId: string) => {
    setUserActivity(prev => {
      const updated = {
        ...prev,
        toolsUsed: prev.toolsUsed.includes(toolId) ? prev.toolsUsed : [...prev.toolsUsed, toolId]
      };
      localStorage.setItem('advanta-user-activity', JSON.stringify(updated));
      return updated;
    });
  };

  // Analyze user behavior patterns
  const getUserBehavior = (): UserBehavior => {
    const totalVisits = Object.values(userActivity.pageVisits).reduce((sum, count) => sum + count, 0);
    const isNewUser = totalVisits < 3;
    
    // Determine experience level based on tools used and page depth
    let experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (userActivity.toolsUsed.length > 5) experienceLevel = 'advanced';
    else if (userActivity.toolsUsed.length > 2) experienceLevel = 'intermediate';

    // Find favorite categories based on page visits
    const categoryVisits: Record<string, number> = {};
    Object.entries(userActivity.pageVisits).forEach(([page, count]) => {
      if (page.includes('marketing') || page.includes('content') || page.includes('headline')) {
        categoryVisits.marketing = (categoryVisits.marketing || 0) + count;
      } else if (page.includes('business') || page.includes('strategy') || page.includes('pricing')) {
        categoryVisits.strategy = (categoryVisits.strategy || 0) + count;
      } else if (page.includes('sales') || page.includes('email')) {
        categoryVisits.sales = (categoryVisits.sales || 0) + count;
      } else if (page.includes('brand') || page.includes('design')) {
        categoryVisits.branding = (categoryVisits.branding || 0) + count;
      } else if (page.includes('ai') || page.includes('prompt') || page.includes('gpt')) {
        categoryVisits.ai = (categoryVisits.ai || 0) + count;
      }
    });

    const favoriteCategories = Object.entries(categoryVisits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([category]) => category);

    return {
      isNewUser,
      favoriteCategories,
      experienceLevel,
      visitedPages: Object.keys(userActivity.pageVisits),
      timeSpentOnPages: userActivity.lastVisited
    };
  };

  // Get personalized recommendations based on behavior
  const getPersonalizedPreferences = () => {
    const behavior = getUserBehavior();
    const preferences: string[] = [];

    // Add preferences based on experience level
    if (behavior.experienceLevel === 'beginner') {
      preferences.push('easy-to-use', 'quick-setup', 'templates');
    } else if (behavior.experienceLevel === 'advanced') {
      preferences.push('customization', 'automation', 'advanced-features');
    }

    // Add category preferences
    preferences.push(...behavior.favoriteCategories);

    // Add time-based preferences
    const sessionDuration = Date.now() - userActivity.sessionStart;
    if (sessionDuration > 300000) { // 5+ minutes
      preferences.push('comprehensive-tools');
    } else {
      preferences.push('quick-tools');
    }

    return preferences;
  };

  return {
    userActivity,
    trackToolUsage,
    getUserBehavior,
    getPersonalizedPreferences
  };
}