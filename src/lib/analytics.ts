
import { supabase } from "@/integrations/supabase/client";

export const trackPageView = async (page: string) => {
  try {
    await supabase
      .from('analytics')
      .insert([{ page, views: 1 }]);
    console.log('Page view tracked:', page);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};
