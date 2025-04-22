
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Skill {
  id?: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  description?: string;
  created_at?: string;
}

export function useSkills() {
  const queryClient = useQueryClient();

  const { data: skills = [], isLoading, error } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Skill[];
    }
  });

  const createSkill = useMutation({
    mutationFn: async (newSkill: Omit<Skill, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('skills')
        .insert(newSkill)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill created successfully');
    },
    onError: (error) => {
      console.error('Error creating skill:', error);
      toast.error('Failed to create skill');
    }
  });

  const updateSkill = useMutation({
    mutationFn: async ({ id, ...skillData }: Skill) => {
      const { data, error } = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill updated successfully');
    },
    onError: (error) => {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
    }
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  });

  return {
    skills,
    isLoading,
    error,
    createSkill,
    updateSkill,
    deleteSkill
  };
}
