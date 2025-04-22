
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogList from '@/components/blog/BlogList';
import { Book, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="space-section pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="flex flex-col items-center justify-center mb-8 pt-12">
            <div className="flex items-center mb-6">
              <Book className="w-6 h-6 mr-2 text-purple-500 pulse-glow" />
              <h1 className="text-4xl md:text-5xl font-bold title-gradient">Galactic Journal</h1>
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 mb-6"
              asChild
            >
              <Link to="/">
                <Home size={18} />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <p className="text-xl max-w-2xl mx-auto mb-12 text-muted-foreground">
            Explore tutorials, insights, and updates from the cosmic realm of development
          </p>
          
          <BlogList />
        </motion.div>
      </section>
      
      <footer className="py-10 px-4 mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Aayan Bothra. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
