import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ChevronDown, ChevronUp, ExternalLink, Github, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Link {
  url: string;
  label: string;
  icon: string;
}

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  icon: React.ReactNode;
  description: string;
  links?: Link[];
  tools?: string[];
  videoUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  image,
  icon,
  description,
  links,
  tools,
  videoUrl,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return <Github size={16} />;
      case 'external':
        return <ExternalLink size={16} />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  const isYoutubeVideo = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="relative">
      <div 
        className={`rounded-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/95'
        } shadow-lg transition-all duration-300`}
      >
        <div 
          className="relative w-full h-48 rounded-t-xl overflow-hidden cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
          />
          <div className={`absolute top-3 right-3 p-2 rounded-full ${theme === 'dark' ? 'bg-black/40' : 'bg-white/70'}`}>
            {icon}
          </div>
          <div className={`absolute bottom-0 left-0 right-0 p-4 ${theme === 'dark' ? 'bg-gradient-to-t from-black/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'}`}>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-space-purple/40 text-white' : 'bg-purple-100 text-purple-800'}`}>
              {category}
            </span>
            <h3 className={`text-xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          </div>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full py-2 flex items-center justify-center ${
            theme === 'dark' 
              ? 'hover:bg-white/5 text-gray-300' 
              : 'hover:bg-purple-50 text-gray-700'
          } rounded-b-xl transition-colors`}
        >
          {isOpen ? (
            <>
              <span className="text-sm mr-1">Show less</span>
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              <span className="text-sm mr-1">Show more</span>
              <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-[99999]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute inset-0 flex items-center justify-center p-4 max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`relative w-full max-w-2xl rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'
                } shadow-2xl`}
                style={{ maxHeight: '90vh' }}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-10 p-1 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
                
                <ScrollArea className="h-full max-h-[90vh] rounded-xl">
                  <div className="w-full h-full">
                    <div className="w-full">
                      {links && isYoutubeVideo(links[0]?.url) ? (
                        <div className="w-full aspect-video">
                          <iframe
                            src={getYoutubeEmbedUrl(links[0].url)}
                            title={title}
                            className="w-full h-full rounded-t-xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <img 
                          src={image} 
                          alt={title}
                          className="w-full object-cover rounded-t-xl max-h-[30vh]"
                        />
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                      </h3>
                      
                      <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {description}
                      </p>
                      
                      {tools && tools.length > 0 && (
                        <div className="mb-6">
                          <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {tools.map((tool, index) => (
                              <span 
                                key={index} 
                                className={`text-xs px-2 py-1 rounded-full ${
                                  theme === 'dark' 
                                    ? 'bg-white/20 text-gray-200' 
                                    : 'bg-purple-50 text-purple-700'
                                }`}
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {links && links.length > 0 && (
                        <div className="flex gap-3 flex-wrap mb-4">
                          {links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center px-3 py-2 rounded-full text-xs font-medium ${
                                theme === 'dark'
                                  ? 'bg-space-purple/30 hover:bg-space-purple/40 text-space-purple-light'
                                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                              }`}
                            >
                              {renderIcon(link.icon)}
                              <span className="ml-1">{link.label}</span>
                            </a>
                          ))}
                        </div>
                      )}
                      
                      <div className="h-4"></div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectCard;
