
import React from 'react';
import { Link } from 'react-router-dom';
import type { Blog } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

const BlogCard = ({ blog, className }: BlogCardProps) => {
  return (
    <Link to={`/blog/${blog.slug}`} className={cn("glass-panel p-6 block", className)}>
      {blog.thumbnail && (
        <div className="aspect-video mb-4 overflow-hidden rounded-lg">
          <img 
            src={blog.thumbnail} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <h2 className="text-2xl font-heading font-bold title-gradient mb-2">{blog.title}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags?.map((tag) => (
          <span 
            key={tag}
            className="px-2 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <time className="text-sm text-muted-foreground">
        {new Date(blog.created_at).toLocaleDateString()}
      </time>
    </Link>
  );
};

export default BlogCard;
