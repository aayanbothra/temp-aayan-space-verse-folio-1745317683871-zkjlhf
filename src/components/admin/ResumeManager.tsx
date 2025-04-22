import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResumeEntry } from "@/types/resume";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { seedResumeEntries } from '@/data/resumeEntries';

const ResumeManager: React.FC = () => {
  const { data: entries = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-resume'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as ResumeEntry[];
    }
  });

  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);

  // Handle seeding resume entries
  const handleSeedEntries = async () => {
    try {
      setIsSeeding(true);
      await seedResumeEntries();
      await queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      await queryClient.invalidateQueries({ queryKey: ['resumeEntries'] });
      toast.success("Resume entries seeded successfully");
    } catch (error) {
      console.error("Error seeding resume entries:", error);
      toast.error("Failed to seed resume entries");
    } finally {
      setIsSeeding(false);
    }
  };

  // Mutations
  const createEntry = useMutation({
    mutationFn: async (newEntry: Omit<ResumeEntry, 'id'>) => {
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
      queryClient.invalidateQueries({ queryKey: ['resumeEntries'] });
      toast.success("Resume entry created successfully");
    },
    onError: (error) => {
      console.error("Error creating resume entry:", error);
      toast.error("Failed to create resume entry");
    }
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...entryData }: ResumeEntry) => {
      const { data, error } = await supabase
        .from('resume')
        .update(entryData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      queryClient.invalidateQueries({ queryKey: ['resumeEntries'] });
      toast.success("Resume entry updated successfully");
    },
    onError: (error) => {
      console.error("Error updating resume entry:", error);
      toast.error("Failed to update resume entry");
    }
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resume')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      queryClient.invalidateQueries({ queryKey: ['resumeEntries'] });
      toast.success("Resume entry deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting resume entry:", error);
      toast.error("Failed to delete resume entry");
    }
  });

  // Group entries by type
  const entriesByType = useMemo(() => {
    const grouped: Record<string, ResumeEntry[]> = {};
    entries.forEach(entry => {
      if (!grouped[entry.type]) {
        grouped[entry.type] = [];
      }
      grouped[entry.type].push(entry);
    });
    return grouped;
  }, [entries]);

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<ResumeEntry> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const openAddDrawer = () => {
    setCurrentEntry({
      title: '',
      description: '',
      type: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      icon: ''
    });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (entry: ResumeEntry) => {
    setCurrentEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleSaveEntry = () => {
    if (!currentEntry?.title || !currentEntry?.description || !currentEntry?.type || !currentEntry?.date) {
      toast.error("All fields except icon are required");
      return;
    }

    if (currentEntry.id) {
      updateEntry.mutate(currentEntry as ResumeEntry);
    } else {
      createEntry.mutate(currentEntry as Omit<ResumeEntry, 'id'>);
    }
    setIsDrawerOpen(false);
  };

  const confirmDelete = (id: string) => {
    setEntryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (entryToDelete) {
      deleteEntry.mutate(entryToDelete);
    }
    setIsDeleteModalOpen(false);
    setEntryToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 border flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex justify-center items-center flex-col h-64">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-xl text-destructive">Failed to load resume entries</p>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Resume</h2>
        <div className="flex gap-2">
          {entries.length === 0 && (
            <Button 
              onClick={handleSeedEntries} 
              variant="outline"
              disabled={isSeeding}
              className="flex items-center gap-2"
            >
              {isSeeding ? (
                <><Loader2 size={16} className="animate-spin" /> Importing...</>
              ) : (
                <><Download size={16} /> Import Resume Data</>
              )}
            </Button>
          )}
          <Button onClick={openAddDrawer} className="flex items-center gap-2">
            <Plus size={16} /> Add Entry
          </Button>
        </div>
      </div>

      {Object.keys(entriesByType).length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No resume entries found</p>
          {isSeeding ? (
            <Button disabled className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Importing...
            </Button>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <Button onClick={handleSeedEntries} variant="outline" className="flex items-center gap-2">
                <Download size={16} /> Import Resume Data
              </Button>
              <span className="text-xs text-muted-foreground">or</span>
              <Button onClick={openAddDrawer}>Add your first entry</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(entriesByType).map(([type, typeEntries]) => (
            <div key={type}>
              <h3 className="text-lg font-medium mb-4 border-b pb-2">{type}</h3>
              <div className="space-y-3">
                {typeEntries.map((entry) => (
                  <div key={entry.id} className="p-4 border rounded-lg flex justify-between items-start">
                    <div>
                      <div className="flex gap-2 items-center">
                        <h4 className="font-medium">{entry.title}</h4>
                        <Badge variant="outline">{entry.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEditDrawer(entry)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive" 
                        onClick={() => confirmDelete(entry.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Entry Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>{currentEntry?.id ? 'Edit Resume Entry' : 'Add New Resume Entry'}</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="px-6">
              <div className="grid gap-4 py-4 max-h-[60vh]">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={currentEntry?.title || ''} 
                    onChange={(e) => setCurrentEntry({...currentEntry!, title: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Input 
                    id="type" 
                    value={currentEntry?.type || ''} 
                    onChange={(e) => setCurrentEntry({...currentEntry!, type: e.target.value})}
                    placeholder="e.g., work, education, award"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    value={currentEntry?.date || ''} 
                    onChange={(e) => setCurrentEntry({...currentEntry!, date: e.target.value})}
                    placeholder="e.g., Jan 2023 - Present"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon (optional)</Label>
                  <Input 
                    id="icon" 
                    value={currentEntry?.icon || ''} 
                    onChange={(e) => setCurrentEntry({...currentEntry!, icon: e.target.value})}
                    placeholder="e.g., work, education, award"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available icons: work, education, award, project
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={5}
                    value={currentEntry?.description || ''} 
                    onChange={(e) => setCurrentEntry({...currentEntry!, description: e.target.value})}
                  />
                </div>
              </div>
            </ScrollArea>
            <DrawerFooter>
              <Button onClick={handleSaveEntry}>
                {createEntry.isPending || updateEntry.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <>{currentEntry?.id ? 'Update' : 'Create'}</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this resume entry? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              {deleteEntry.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeManager;
