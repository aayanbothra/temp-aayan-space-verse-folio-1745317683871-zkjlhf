import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Play, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Types for editing projects
interface EditingProject {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  tool: string;
  duration: string;
  genre: string;
}

// Sample editing projects
const editingProjects: EditingProject[] = [
  {
    id: 1,
    title: "Cinematic Fest Trailer",
    thumbnail: "/lovable-uploads/5a7cff3c-2bc2-4882-8613-736e1efd7f22.png",
    videoUrl: "https://www.youtube.com/embed/_5I4BoBhLBU",
    tool: "After Effects, Premiere Pro, DaVinci Resolve",
    duration: "2:30",
    genre: "Trailer"
  },
  {
    id: 2,
    title: "Motion Typography",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/BHACKCNDMW8",
    tool: "After Effects",
    duration: "1:30",
    genre: "Motion Graphics"
  },
  {
    id: 3,
    title: "Nature Transitions",
    thumbnail: "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/BHACKCNDMW8",
    tool: "DaVinci Resolve",
    duration: "3:45",
    genre: "Showreel"
  },
  {
    id: 4,
    title: "Product Showcase",
    thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/BHACKCNDMW8",
    tool: "Final Cut Pro",
    duration: "2:30",
    genre: "Commercial"
  },
  {
    id: 5,
    title: "Cinematic Trailer",
    thumbnail: "https://images.unsplash.com/photo-1599240211563-17590b1e568c?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/BHACKCNDMW8",
    tool: "Adobe Premiere Pro",
    duration: "1:45",
    genre: "Trailer"
  },
  {
    id: 6,
    title: "3D Animation",
    thumbnail: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2074&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/BHACKCNDMW8",
    tool: "Cinema 4D + After Effects",
    duration: "0:55",
    genre: "Animation"
  }
];

const EditingSection = () => {
  const [selectedProject, setSelectedProject] = useState<EditingProject | null>(null);
  const { theme } = useTheme();

  const openVideoModal = (project: EditingProject) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="editing" className={`py-20 px-4 relative ${
      theme === 'light' 
        ? 'bg-purple-50/50 backdrop-blur-sm' 
        : 'bg-space-blue/30'
    }`}>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={`w-full h-full ${
          theme === 'light'
            ? 'bg-gradient-to-b from-transparent via-purple-100/20 to-transparent'
            : ''
        }`} />
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold title-gradient mb-4">Video Editing & Motion Design</h2>
          <div className="max-w-3xl mx-auto">
            <p className={`text-xl ${theme === 'light' ? 'text-gray-800' : 'text-gray-300'} mb-8`}>
              Crafting visual narratives through careful timing, dynamic transitions, and engaging motion graphics. 
              My editing style balances technical precision with creative flair to create memorable visual experiences.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {editingProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel overflow-hidden cursor-pointer group transition-all duration-300"
              onClick={() => openVideoModal(project)}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <motion.div 
                  className="absolute inset-0 bg-space-blue-dark/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-14 h-14 rounded-full bg-space-purple flex items-center justify-center">
                    <Play className="text-white ml-1" />
                  </div>
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === 'light' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-space-purple/20 text-space-purple-light'
                  }`}>
                    {project.tool}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === 'light' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-space-purple/20 text-space-purple-light'
                  }`}>
                    {project.duration}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    theme === 'light' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-space-purple/20 text-space-purple-light'
                  }`}>
                    {project.genre}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Film className="mr-2" size={16} />
                  <span>Click to watch</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal with improved animation */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={closeVideoModal}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={closeVideoModal}
                  className="absolute -right-2 -top-12 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="text-white" />
                </button>
                
                <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedProject.videoUrl} 
                    title={selectedProject.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                
                <div className="glass-panel p-4 mt-4">
                  <h3 className="text-xl font-bold mb-1">{selectedProject.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      theme === 'light' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-space-purple/20 text-space-purple-light'
                    }`}>
                      {selectedProject.tool}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      theme === 'light' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-space-purple/20 text-space-purple-light'
                    }`}>
                      {selectedProject.genre}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EditingSection;
