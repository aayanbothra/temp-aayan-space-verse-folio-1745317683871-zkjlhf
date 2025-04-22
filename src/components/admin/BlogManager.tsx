
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Blog } from '@/types/blog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import BlogEditor from './BlogEditor';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  FileImage,
  AlertTriangle, 
  Eye,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSlug } from '@/lib/utils';

const BlogManager: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog> | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'preview'>('content');

  const queryClient = useQueryClient();

  // Query to fetch all blog posts
  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Blog[];
    }
  });

  // Mutations
  const createBlog = useMutation({
    mutationFn: async (newBlog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('blogs')
        .insert(newBlog)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success("Blog post created successfully");
    },
    onError: (error) => {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post");
    }
  });

  const updateBlog = useMutation({
    mutationFn: async ({ id, ...blogData }: Blog) => {
      // Update updated_at timestamp
      const updatedBlog = {
        ...blogData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('blogs')
        .update(updatedBlog)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success("Blog post updated successfully");
    },
    onError: (error) => {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
    }
  });

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success("Blog post deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    }
  });

  // Handler functions
  const openCreateEditor = () => {
    setCurrentBlog({
      title: '',
      slug: '',
      content: '',
      tags: [],
      published: false,
      thumbnail: ''
    });
    setEditorTab('content');
    setIsEditorOpen(true);
  };

  const openEditEditor = (blog: Blog) => {
    setCurrentBlog(blog);
    setEditorTab('content');
    setIsEditorOpen(true);
  };

  const confirmDelete = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (blogToDelete) {
      deleteBlog.mutate(blogToDelete);
    }
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const handleSaveBlog = () => {
    if (!currentBlog?.title || !currentBlog?.content) {
      toast.error("Title and content are required");
      return;
    }

    // Generate slug if empty
    if (!currentBlog.slug) {
      currentBlog.slug = generateSlug(currentBlog.title);
    }

    if (currentBlog.id) {
      updateBlog.mutate(currentBlog as Blog);
    } else {
      createBlog.mutate(currentBlog as Omit<Blog, 'id' | 'created_at' | 'updated_at'>);
    }
    setIsEditorOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 border flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex justify-center items-center flex-col h-64">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-xl text-destructive">Failed to load blog posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
        <Button onClick={openCreateEditor} className="flex items-center gap-2">
          <Plus size={16} /> New Post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No blog posts found</p>
          <Button onClick={openCreateEditor} variant="outline">Create your first blog post</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="p-4 border rounded-lg flex justify-between items-start bg-card">
              <div className="flex gap-4 w-full">
                {blog.thumbnail && (
                  <div className="h-24 w-24 overflow-hidden rounded-md flex-shrink-0">
                    <img 
                      src={blog.thumbnail} 
                      alt={blog.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-medium">{blog.title}</h3>
                    <Badge variant={blog.published ? "default" : "outline"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {blog.tags?.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {(blog.tags?.length || 0) > 3 && (
                        <Badge variant="secondary" className="text-xs">+{blog.tags!.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => openEditEditor(blog)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive" 
                    onClick={() => confirmDelete(blog.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Editor Drawer */}
      <Drawer open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="mx-auto w-full max-w-5xl">
            <DrawerHeader className="border-b">
              <div className="flex justify-between items-center">
                <DrawerTitle>{currentBlog?.id ? 'Edit Post' : 'New Post'}</DrawerTitle>
                <Tabs value={editorTab} onValueChange={(value) => setEditorTab(value as 'content' | 'preview')}>
                  <TabsList>
                    <TabsTrigger value="content">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </DrawerHeader>
            <ScrollArea className="h-[calc(90vh-10rem)]">
              <div className="p-6">
                <TabsContent value="content">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          value={currentBlog?.title || ''} 
                          onChange={(e) => setCurrentBlog({...currentBlog!, title: e.target.value})}
                          placeholder="Enter a post title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input 
                          id="slug" 
                          value={currentBlog?.slug || ''} 
                          onChange={(e) => setCurrentBlog({...currentBlog!, slug: e.target.value})}
                          placeholder="url-friendly-title"
                          onBlur={(e) => {
                            if (!e.target.value && currentBlog?.title) {
                              setCurrentBlog({
                                ...currentBlog, 
                                slug: generateSlug(currentBlog.title)
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="thumbnail">Thumbnail URL</Label>
                      <Input 
                        id="thumbnail" 
                        value={currentBlog?.thumbnail || ''} 
                        onChange={(e) => setCurrentBlog({...currentBlog!, thumbnail: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                      {currentBlog?.thumbnail && (
                        <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md bg-muted">
                          <img 
                            src={currentBlog.thumbnail} 
                            alt="Thumbnail preview"
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input 
                        id="tags" 
                        value={currentBlog?.tags?.join(', ') || ''}
                        onChange={(e) => {
                          const tagArray = e.target.value
                            .split(',')
                            .map(item => item.trim())
                            .filter(item => item !== '');
                          setCurrentBlog({...currentBlog!, tags: tagArray});
                        }}
                        placeholder="tech, programming, web development"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="content">Content</Label>
                      <BlogEditor 
                        value={currentBlog?.content || ''} 
                        onChange={(value) => setCurrentBlog({...currentBlog!, content: value})} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="published"
                        checked={currentBlog?.published || false}
                        onCheckedChange={(checked) => setCurrentBlog({...currentBlog!, published: checked})}
                      />
                      <Label htmlFor="published">Publish</Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="prose max-w-none">
                      <h1>{currentBlog?.title || 'Untitled Post'}</h1>
                      {currentBlog?.thumbnail && (
                        <img 
                          src={currentBlog.thumbnail} 
                          alt={currentBlog.title} 
                          className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: currentBlog?.content || '' }} />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
            <DrawerFooter className="border-t">
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveBlog}>
                  {createBlog.isPending || updateBlog.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <>{currentBlog?.id ? 'Update Post' : 'Create Post'}</>
                  )}
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              {deleteBlog.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
              ) : (
                'Delete Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
