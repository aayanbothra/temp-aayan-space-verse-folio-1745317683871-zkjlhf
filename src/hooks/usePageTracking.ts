
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';
import { ga } from '@/services/googleAnalytics';

export const usePageTracking = () => {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking the same page twice in a row
    if (previousPath.current === location.pathname) {
      return;
    }
    
    console.log('📊 Page tracking hook triggered for:', location.pathname);
    
    // Track in Supabase
    analytics.pageView(location.pathname)
      .then(() => console.log('✅ Analytics page tracking complete'))
      .catch(err => console.error('❌ Analytics tracking error:', err));
    
    // Additional direct tracking in Google Analytics for redundancy
    ga.pageview(location.pathname);
    
    // Update previous path
    previousPath.current = location.pathname;
  }, [location]);
};
