
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { projectService } from '@/services/projectService';
import ProjectFilters from './ProjectFilters';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@/types/project';
import { Code, PlayCircle, Music, FileText } from 'lucide-react';

// Hard-coded projects from the original ProjectsSection for fallback
const fallbackProjects = [
  {
    id: "fallback-1",
    title: "Phenomenon 2024",
    category: "Web Development",
    image: "/lovable-uploads/332c21db-c220-4bc2-972b-7f0d10f930bf.png",
    thumbnail: "/lovable-uploads/332c21db-c220-4bc2-972b-7f0d10f930bf.png",
    icon: <Code />,
    description: "I developed this website for Bangalore's biggest Cultural and Carnival fest. I led the UI Design, constructed all the animated components and set up the backend payments and registrations database. I utilized the cutting edge of FullStack including ReactTS, NextJS, ExpressJS, Firebase API and Razorpay API",
    links: [
      { url: "https://sjbhs.edu.in/phenomenon/", label: "Visit Website", icon: "external" }
    ],
    technologies: ["React", "TypeScript", "Next.js", "Express.js", "Firebase", "Razorpay API", 
      "UI/UX Design", "Frontend Development", "Backend Development"]
  },
  {
    title: "SJBHSMUN 2024",
    category: "Web Development",
    image: "/lovable-uploads/3760a91e-25d7-4c38-8f67-560434cad553.png",
    icon: <Code />,
    description: "I developed this website for our city wide MUN Conference, using ReactTS, NextJS, ExpressJS and the Razorpay API. I set up backend infrastructure and a one of its kind UID system to provide each delegate with a unique ID used across the conference.",
    links: [
      { url: "https://sjbhs.edu.in/sjbhsmun/", label: "Visit Website", icon: "external" }
    ],
    tools: [
      "React", "TypeScript", "Next.js", "Express.js", "Razorpay API", 
      "UID System Development", "Backend Architecture"
    ]
  },
  {
    title: "Bifrost 2024",
    category: "Web Development",
    image: "/lovable-uploads/b0ed3ebd-c369-49e9-adee-232c7ac7d503.png",
    icon: <Code />,
    description: "I designed, programmed and managed the website for the Commerce fest of SJBHS, Bifrost 2024. I explored figma, HTML, CSS and JavaScript to set up a well rounded website to facilitate the fest. I also managed the registrations backend co-ordinating with multiple teams.",
    links: [
      { url: "https://sjbhs.edu.in/bifrost/", label: "Visit Website", icon: "external" }
    ],
    tools: [
      "HTML5", "CSS3", "JavaScript", "Figma", "UI/UX Design", "Frontend Development"
    ]
  },
  {
    title: "Transcendence 2024",
    category: "Web Development",
    image: "/lovable-uploads/941b3537-95b1-4e9c-ac61-aee0c39ac305.png",
    icon: <Code />,
    description: "I designed, programmed and managed the website for the International Science, Technology and eSports fest of SJBHS, Transcendence 2024. I explored figma, HTML, CSS and JavaScript to set up a well rounded website to facilitate the fest.",
    links: [
      { url: "https://sjbhs.edu.in/transcendence/", label: "Visit Website", icon: "external" }
    ],
    tools: [
      "HTML5", "CSS3", "JavaScript", "Figma", "UI/UX Design", "Frontend Development"
    ]
  },
  {
    title: "Personal Portfolio",
    category: "Web Development",
    image: "/lovable-uploads/12c50d1f-f8c2-4b01-a8a9-75b8091274d9.png",
    icon: <Code />,
    description: "A modern, interactive portfolio website showcasing my work across various creative disciplines. Features a dynamic theme system, smooth animations, particle effects, and responsive design. Built with cutting-edge web technologies for optimal performance and user experience.",
    links: [
      { url: "https://linkedin.com/in/aayan-bothra-802999272", label: "Visit Profile", icon: "external" }
    ],
    tools: [
      "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI"
    ]
  },
  {
    title: "Cinematic Fest Trailer",
    category: "Motion Design",
    image: "/lovable-uploads/5a7cff3c-2bc2-4882-8613-736e1efd7f22.png",
    icon: <PlayCircle />,
    description: "A dynamic and visually striking fest trailer that combines professional cinematography, motion graphics, and sound design. Created for the 2024 season, this piece showcases advanced editing techniques and creative storytelling through visual effects.",
    links: [
      { url: "https://youtu.be/_5I4BoBhLBU", label: "Watch Trailer", icon: "external" }
    ],
    tools: [
      "Adobe After Effects", "Adobe Premiere Pro", "DaVinci Resolve", "Sound Design"
    ]
  },
  {
    title: "Melodic Rock Production",
    category: "Music Production",
    image: "/lovable-uploads/9716ecc2-24c6-4a91-b314-be4fc178a83b.png",
    icon: <Music />,
    description: "A full rock production showcasing melodic guitar work, dynamic drumming, and layered instrumentation. The track demonstrates modern production techniques, musical arrangement, and professional mixing/mastering skills.",
    links: [
      { url: "https://www.youtube.com/watch?v=ct-F5UsvdyM", label: "Watch on YouTube", icon: "external" }
    ],
    tools: [
      "FL Studio", "Electric Guitar", "Bass Guitar", "Piano/Keys", "Drum Programming"
    ]
  },
  {
    title: "Brand Identity",
    category: "Graphic Design",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
    icon: <FileText />,
    description: "Complete brand identity design for a tech startup, including logo design, color palette, typography system, and brand guidelines document.",
    links: [
      { url: "https://dribbble.com/aayanbothra", label: "View on Dribbble", icon: "external" }
    ],
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Figma"]
  }
];

const FilteredProjectsSection = () => {
  const [filters, setFilters] = useState<{ category?: string; technologies?: string[] }>({});
  
  // Updated useQuery implementation with meta object for error handling
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getProjects(filters),
    meta: {
      onError: () => {
        console.error('Error fetching projects, falling back to static data');
      }
    }
  });
  
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Web Development': return <Code />;
      case 'Motion Design': return <PlayCircle />;
      case 'Music Production': return <Music />;
      case 'Graphic Design': return <FileText />;
      default: return <Code />;
    }
  };
  
  const handleFilterChange = (newFilters: { category?: string; technologies?: string[] }) => {
    setFilters(newFilters);
  };
  
  // Use database projects with fallback to static projects if empty
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  
  // Filter projects based on selected category
  const filteredProjects = filters.category 
    ? displayProjects.filter(project => project.category === filters.category)
    : displayProjects;
  
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold title-gradient mb-4">Featured Projects</h2>
          <p className="text-xl max-w-2xl mx-auto">
            A selection of my work across various creative disciplines
          </p>
        </motion.div>
        
        <ProjectFilters onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No projects found matching the selected filters.</p>
            <button 
              onClick={() => setFilters({})} 
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProjects.map((project, index) => {
              // Safely access properties with type checking
              const projectWithId = 'id' in project ? project.id : `fallback-${index}`;
              const projectImage = 'thumbnail' in project ? project.thumbnail : 
                                  'image' in project ? project.image : 
                                  "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop";
              const projectTools = 'technologies' in project ? project.technologies : 
                                  'tools' in project ? project.tools : [];
              
              // Fix: Add null check before using Object.entries
              const projectLinks = 'links' in project && project.links ? 
                                  (Array.isArray(project.links) ? project.links : 
                                  Object.entries(project.links).map(([label, url]) => ({ 
                                    label, 
                                    url: url as string, 
                                    icon: "external" 
                                  }))) : [];
              
              return (
                <ProjectCard
                  key={projectWithId}
                  title={project.title}
                  category={project.category}
                  image={projectImage}
                  icon={getIconForCategory(project.category)}
                  description={project.description}
                  links={projectLinks}
                  tools={projectTools}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FilteredProjectsSection;
