import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';

const ProjectsManager: React.FC = () => {
  const {
    projects = [],
    isLoading,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();

  // Add/Edit Project Modal State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);

  const openAddModal = () => {
    setCurrentProject({
      title: '',
      description: '',
      category: '',
      technologies: [],
      links: {}
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setCurrentProject(project);
    setIsAddEditModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!currentProject?.title || !currentProject?.description || !currentProject?.category) {
      toast.error("Title, description, and category are required");
      return;
    }

    if (currentProject.id) {
      updateProject.mutate(currentProject as Project);
    } else {
      createProject.mutate(currentProject as Omit<Project, 'id' | 'created_at'>);
    }
    setIsAddEditModalOpen(false);
  };

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (projectToDelete) {
      deleteProject.mutate(projectToDelete);
    }
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
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
        <h2 className="text-xl font-semibold">Manage Projects</h2>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={16} /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No projects found</p>
          <Button onClick={openAddModal} variant="outline">Add your first project</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="font-medium">{project.title}</h3>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                <div className="flex gap-1 flex-wrap mt-2">
                  {project.technologies?.slice(0, 3).map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <Badge variant="secondary" className="text-xs">+{project.technologies!.length - 3} more</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => openEditModal(project)}
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive" 
                  onClick={() => confirmDelete(project.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Project Dialog */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentProject?.id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={currentProject?.title || ''} 
                onChange={(e) => setCurrentProject({...currentProject!, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                rows={3}
                value={currentProject?.description || ''} 
                onChange={(e) => setCurrentProject({...currentProject!, description: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={currentProject?.category || ''} 
                onChange={(e) => setCurrentProject({...currentProject!, category: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label>Technologies (comma separated)</Label>
              <Input 
                value={currentProject?.technologies?.join(', ') || ''}
                onChange={(e) => {
                  const techArray = e.target.value
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item !== '');
                  setCurrentProject({...currentProject!, technologies: techArray});
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label>Thumbnail URL</Label>
              <Input 
                value={currentProject?.thumbnail || ''} 
                onChange={(e) => setCurrentProject({...currentProject!, thumbnail: e.target.value || null})}
              />
            </div>

            <div className="grid gap-2">
              <Label>Website/External Link</Label>
              <Input 
                value={currentProject?.links?.website || ''}
                onChange={(e) => {
                  const links = {...(currentProject?.links || {})};
                  if (e.target.value) {
                    links.website = e.target.value;
                  } else {
                    delete links.website;
                  }
                  setCurrentProject({...currentProject!, links});
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProject}>
              {createProject.isPending || updateProject.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <>{currentProject?.id ? 'Update' : 'Create'}</>
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
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              {deleteProject.isPending ? (
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

export default ProjectsManager;
