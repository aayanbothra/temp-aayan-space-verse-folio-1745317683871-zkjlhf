import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import ProjectsManager from '@/components/admin/ProjectsManager';
import ResumeManager from '@/components/admin/ResumeManager';
import BlogManager from '@/components/admin/BlogManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import SkillsManager from '@/components/admin/SkillsManager';

const Admin: React.FC = () => {
  const { session, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/auth');
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-space-blue-dark">
        <Loader2 className="w-8 h-8 animate-spin text-space-purple" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4 bg-space-blue-dark">
        <Lock className="w-12 h-12 text-space-purple mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-white">Access Denied</h1>
        <p className="text-gray-300 mb-6">Only the administrator can access this page.</p>
        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-space-blue-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Site
          </Button>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>
          
          <TabsContent value="resume">
            <ResumeManager />
          </TabsContent>
          
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
