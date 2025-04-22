
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";

export const projectService = {
  async getProjects(filters?: { category?: string; technologies?: string[] }): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*');
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.technologies && filters.technologies.length > 0) {
      query = query.contains('technologies', filters.technologies);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data as Project[];
  },
  
  async getCategories(): Promise<string[]> {
    // Using select distinct with the column name in the select query
    const { data, error } = await supabase
      .from('projects')
      .select('category');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Deduplicate categories on the client side
    const categories = data.map(item => item.category);
    return [...new Set(categories)];
  },
  
  async getTechnologies(): Promise<string[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('technologies');
    
    if (error) {
      console.error('Error fetching technologies:', error);
      throw error;
    }
    
    // Flatten and get unique technologies
    const allTechnologies = data.flatMap(item => item.technologies);
    return [...new Set(allTechnologies)];
  }
};
