
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Blog } from '@/types/blog';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as Blog;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container pt-32 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container pt-32 flex flex-col items-center justify-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blog')} variant="outline">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Format publish date
  const publishDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <Button
              variant="outline"
              size="sm"
              className="mb-8 flex items-center gap-2"
              asChild
            >
              <Link to="/blog">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold title-gradient mb-6">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{publishDate}</span>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={16} />
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {blog.thumbnail && (
              <div className="mb-8">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-auto max-h-96 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div 
              className="prose max-w-none lg:prose-xl dark:prose-invert prose-headings:title-gradient prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.div>
      </article>
      
      <footer className="py-10 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Aayan Bothra. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
