
import { supabase } from '@/integrations/supabase/client';
import { ga } from './googleAnalytics';

// Generate a simple session ID using timestamp and random number
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  page_url?: string;
}

export const analytics = {
  async trackEvent({ event_type, event_data = {}, page_url }: AnalyticsEvent) {
    try {
      // Get current user ID if available
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Send to Google Analytics first (won't fail if GA isn't loaded)
      ga.event({ 
        action: event_type, 
        category: 'custom_events',
        label: page_url || window.location.pathname,
        value: undefined
      });
      
      // Try to store in Supabase if the table exists
      try {
        // Note: We're only attempting this if the table exists in your schema
        // You may need to create this table in your Supabase project
        console.log('Attempting to track event in Supabase:', {
          event_type,
          event_data,
          session_id: SESSION_ID,
          page_url: page_url || window.location.pathname,
          user_agent: navigator.userAgent,
          user_id: userId
        });
        
        // This is intentionally commented out as the table doesn't exist in the schema
        // Uncomment this when you've created the analytics_events table
        /*
        const { error } = await supabase
          .from('analytics_events')
          .insert({
            event_type,
            event_data,
            session_id: SESSION_ID,
            page_url: page_url || window.location.pathname,
            user_agent: navigator.userAgent,
            user_id: userId
          });

        if (error) {
          console.error('Error tracking event in Supabase:', error);
        }
        */
      } catch (supabaseError) {
        console.error('Failed to track event in Supabase:', supabaseError);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  },

  async pageView(page_url?: string) {
    const currentPath = page_url || window.location.pathname;
    
    // Record in Supabase analytics
    this.trackEvent({
      event_type: 'page_view',
      page_url: currentPath
    });
    
    // Ensure we're also directly calling GA
    ga.pageview(currentPath);
    
    return true;
  }
};
