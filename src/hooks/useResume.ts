
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResumeEntry } from '@/types/resume';
import { toast } from 'sonner';

export function useResume() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['admin-resume'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ResumeEntry[];
    }
  });

  const createEntry = useMutation({
    mutationFn: async (newEntry: Omit<ResumeEntry, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('resume')
        .insert(newEntry)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      toast.success('Resume entry created successfully');
    },
    onError: (error) => {
      console.error('Error creating resume entry:', error);
      toast.error('Failed to create resume entry');
    }
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...entryData }: ResumeEntry) => {
      const { data, error } = await supabase
        .from('resume')
        .update(entryData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      toast.success('Resume entry updated successfully');
    },
    onError: (error) => {
      console.error('Error updating resume entry:', error);
      toast.error('Failed to update resume entry');
    }
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resume')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      toast.success('Resume entry deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting resume entry:', error);
      toast.error('Failed to delete resume entry');
    }
  });

  return {
    entries,
    isLoading,
    error,
    createEntry,
    updateEntry,
    deleteEntry
  };
}
