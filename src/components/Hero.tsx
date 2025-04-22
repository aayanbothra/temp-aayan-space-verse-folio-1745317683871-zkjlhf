import React from 'react';
import { motion } from 'framer-motion';
import { useExperience } from '@/context/ExperienceContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRight, Code, PlayCircle, FileText, Mail, Rocket, Globe, Star } from 'lucide-react';

interface RoleContent {
  headline: React.ReactNode;
  subheadline: string;
  cta: {
    text: string;
    icon: React.ReactNode;
  };
}

const Hero = () => {
  const { userRole } = useExperience();
  const { theme } = useTheme();
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roleContent: Record<string, RoleContent> = {
    visitor: {
      headline: (
        <>
          Hello, I'm <span className="inline-block title-gradient">
            Aayan Bothra
          </span>
        </>
      ),
      subheadline: "Editor • Motion Designer • Fullstack Developer • Musician",
      cta: { text: "Explore My Work", icon: <Rocket className="ml-2 h-5 w-5" /> }
    },
    recruiter: {
      headline: "Looking for Creative Tech Talent?",
      subheadline: "Fullstack Development • Motion Design • Multimedia Production",
      cta: { text: "View My Projects", icon: <Code className="ml-2 h-5 w-5" /> }
    },
    student: {
      headline: "Learn & Explore With Me",
      subheadline: "Tutorials • Resources • Development Journey",
      cta: { text: "Start Learning", icon: <PlayCircle className="ml-2 h-5 w-5" /> }
    },
    fan: {
      headline: "Welcome to My Creative Universe",
      subheadline: "Music • Visual Art • Design • Code",
      cta: { text: "See Latest Work", icon: <FileText className="ml-2 h-5 w-5" /> }
    },
  };
  
  const content = roleContent[userRole || 'visitor'];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 relative overflow-hidden mt-12">
      <motion.div
        className={`fixed w-64 h-64 rounded-full ${
          theme === 'dark' 
            ? 'bg-space-purple/20' 
            : 'bg-purple-300/30'
        } blur-[50px]`}
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -30, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut" 
        }}
        style={{ left: '15%', top: '20%' }}
      />
      
      <motion.div
        className={`fixed w-72 h-72 rounded-full ${
          theme === 'dark' 
            ? 'bg-space-gold/10' 
            : 'bg-amber-200/30'
        } blur-[60px]`}
        animate={{ 
          x: [0, -20, 0], 
          y: [0, 20, 0],
          scale: [1, 1.05, 1] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 12,
          ease: "easeInOut" 
        }}
        style={{ right: '20%', bottom: '30%' }}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl text-center"
      >
        <motion.h1 
          variants={itemVariants} 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight title-gradient"
          style={{ 
            letterSpacing: '-0.02em',
            textShadow: 'none',
          }}
        >
          {content.headline}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants} 
          className={`text-lg sm:text-xl md:text-2xl mt-4 mb-8 ${
            theme === 'dark' 
              ? 'text-gray-300' 
              : 'text-purple-900/90'
          }`}
        >
          {content.subheadline}
        </motion.p>
        
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg" 
            className={`${
              theme === 'dark' 
                ? 'bg-space-purple hover:bg-space-purple/80'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white text-lg px-8 py-6 group transition-all duration-300`}
            onClick={() => window.open('https://www.linkedin.com/in/aayan-bothra-802999272/details/experience/', '_blank')}
          >
            <span>{content.cta.text}</span>
            <motion.span 
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {content.cta.icon}
            </motion.span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={scrollToContact}
            className={`${
              theme === 'dark' 
                ? 'bg-transparent hover:bg-space-purple/80 hover:text-white'
                : 'bg-transparent hover:bg-purple-600 hover:text-white'
            } hero-contact-btn text-lg px-8 py-6 group transition-all duration-300`}
          >
            <span>Contact Me</span>
            <motion.span 
              className="inline-block"
              animate={{ y: [0, -2, 0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Mail className="ml-2 h-5 w-5" />
            </motion.span>
          </Button>
        </motion.div>
        
        <motion.div 
          className="absolute -right-8 bottom-0 opacity-20 hidden md:block"
          animate={{ 
            y: [0, -10, 0], 
            rotate: [0, 10, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        >
          <Globe size={60} className={theme === 'dark' ? 'text-blue-300' : 'text-blue-500'} />
        </motion.div>
        
        <motion.div 
          className="absolute -left-24 -top-16 opacity-30 hidden md:block"
          animate={{ 
            y: [0, 8, 0], 
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star size={40} className={theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
