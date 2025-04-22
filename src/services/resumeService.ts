
import { supabase } from "@/integrations/supabase/client";
import { ResumeEntry } from "@/types/resume";

export const resumeService = {
  async getResumeEntries(type?: string): Promise<ResumeEntry[]> {
    let query = supabase
      .from('resume')
      .select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching resume entries:', error);
      throw error;
    }
    
    return data as ResumeEntry[];
  },
  
  async getResumeTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from('resume')
      .select('type');
    
    if (error) {
      console.error('Error fetching resume types:', error);
      throw error;
    }
    
    // Deduplicate types on the client side
    const types = data.map(item => item.type);
    return [...new Set(types)];
  }
};
