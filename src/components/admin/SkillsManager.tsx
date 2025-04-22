
import React, { useState } from 'react';
import { useSkills, Skill } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2 
} from 'lucide-react';

const SkillsManager: React.FC = () => {
  const {
    skills = [],
    isLoading,
    createSkill,
    updateSkill,
    deleteSkill
  } = useSkills();

  // Add/Edit Skill Modal State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);

  const openAddModal = () => {
    setCurrentSkill({
      name: '',
      category: '',
      proficiency: 80,
      description: ''
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsAddEditModalOpen(true);
  };

  const handleSaveSkill = () => {
    if (!currentSkill?.name || !currentSkill?.category) {
      toast.error("Name and category are required");
      return;
    }

    if (currentSkill.id) {
      updateSkill.mutate(currentSkill as Skill);
    } else {
      createSkill.mutate(currentSkill as Omit<Skill, 'id' | 'created_at'>);
    }
    setIsAddEditModalOpen(false);
  };

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setSkillToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (skillToDelete) {
      deleteSkill.mutate(skillToDelete);
    }
    setIsDeleteModalOpen(false);
    setSkillToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 border flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Skills</h2>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={16} /> Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No skills found</p>
          <Button onClick={openAddModal} variant="outline">Add your first skill</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="font-medium">{skill.name}</h3>
                  <Badge variant="outline">{skill.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{skill.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{width: `${skill.proficiency}%`}}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => openEditModal(skill)}
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive" 
                  onClick={() => confirmDelete(skill.id!)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Skill Dialog */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentSkill?.id ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={currentSkill?.name || ''} 
                onChange={(e) => setCurrentSkill({...currentSkill!, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={currentSkill?.category || ''} 
                onChange={(e) => setCurrentSkill({...currentSkill!, category: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={currentSkill?.description || ''} 
                onChange={(e) => setCurrentSkill({...currentSkill!, description: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proficiency">Proficiency (%)</Label>
              <Input 
                id="proficiency" 
                type="number"
                min={0}
                max={100}
                value={currentSkill?.proficiency || 80} 
                onChange={(e) => setCurrentSkill({...currentSkill!, proficiency: Number(e.target.value)})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSkill}>
              {createSkill.isPending || updateSkill.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <>{currentSkill?.id ? 'Update' : 'Create'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this skill? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              {deleteSkill.isPending ? (
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

export default SkillsManager;
