import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { ExperienceProvider } from '@/context/ExperienceContext';
import ExperienceSelector from '@/components/ExperienceSelector';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import Timeline from '@/components/Timeline';
import SkillLibrary from '@/components/SkillLibrary';
import FilteredProjectsSection from '@/components/FilteredProjectsSection';
import InteractiveResume from '@/components/InteractiveResume';
import ContactForm from '@/components/ContactForm';
import NewsletterPopup from '@/components/NewsletterPopup';
import MusicPlayer from '@/components/MusicPlayer';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Instagram, Twitter, Mail, Star, Rocket, Globe, Music2
} from 'lucide-react';

const SectionDivider = () => {
  return <div className="h-6" />;
};

const MainLayout = () => {
  const { experienceSelected } = useExperience();
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen">
      <ParticlesBackground />
      <NewsletterPopup />
      
      <AnimatePresence mode="wait">
        {!experienceSelected ? (
          <ExperienceSelector key="selector" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Navigation />
            
            <section id="home" className="space-section">
              <Hero />
            </section>
            
            <SectionDivider />
            
            <motion.section 
              id="music" 
              className="space-section relative overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <div className="max-w-7xl mx-auto">
                <motion.div
                  className="text-center space-mb"
                >
                  <div className="flex items-center justify-center mb-3">
                    <Music2 className="w-6 h-6 mr-2 text-purple-500 pulse-glow" />
                    <h2 className="text-4xl md:text-5xl font-bold title-gradient">Music Production</h2>
                  </div>
                  <MusicMessage />
                </motion.div>
                
                <MusicPlayer />
                
                <motion.div
                  className="absolute -top-10 right-10 opacity-10 hidden lg:block"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Music2 size={80} />
                </motion.div>
              </div>
            </motion.section>
            
            <SectionDivider />
            
            <motion.section
              id="projects"
              className="space-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <FilteredProjectsSection />
            </motion.section>
            
            <SectionDivider />
            
            <motion.section
              id="resume" 
              className="space-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <InteractiveResume />
            </motion.section>
            
            <SectionDivider />
            
            <motion.section
              id="timeline" 
              className="space-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <Timeline />
            </motion.section>
            
            <SectionDivider />
            
            <motion.section
              id="skills" 
              className="space-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <SkillLibrary />
            </motion.section>
            
            <SectionDivider />
            
            <motion.section 
              id="contact" 
              className="space-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <div className="max-w-4xl mx-auto relative">
                <motion.div
                  className="text-center space-mb"
                >
                  <div className="flex items-center justify-center mb-3">
                    <Mail className="w-6 h-6 mr-2 text-purple-500 pulse-glow" />
                    <h2 className="text-4xl md:text-5xl font-bold title-gradient">Get in Touch</h2>
                  </div>
                  <p className="text-xl max-w-2xl mx-auto">
                    Have a project in mind or want to collaborate? Send me a message and let's create something amazing together!
                  </p>
                </motion.div>
                
                <ContactForm />
                
                <motion.div
                  className="absolute -bottom-10 -left-10 opacity-10 hidden lg:block"
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
                  <Globe size={60} />
                </motion.div>
              </div>
            </motion.section>
            
            <footer className="py-10 px-4 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <motion.div 
                    className="mb-6 md:mb-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-heading font-bold title-gradient mb-2 flex items-center">
                      <Rocket className="mr-2 h-5 w-5" />
                      <a 
                        href="https://www.linkedin.com/in/aayan-bothra-802999272/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        Aayan Bothra
                      </a>
                    </h2>
                    <p className="text-gray-400">
                      Editor • Motion Designer • Fullstack Developer • Musician
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {[
                      { icon: <Github size={20} />, href: "#" },
                      { icon: <Linkedin size={20} />, href: "#" },
                      { icon: <Instagram size={20} />, href: "#" },
                      { icon: <Twitter size={20} />, href: "#" }
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        className="text-gray-400 hover:text-white transition-colors cosmic-btn p-2 rounded-full"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    © {new Date().getFullYear()} All Rights Reserved
                    <div className="flex items-center justify-center mt-2 space-x-1">
                      <span>Designed and Developed by</span>
                      <a 
                        href="https://www.linkedin.com/in/aayan-bothra-802999272/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:opacity-80 transition-opacity"
                      >
                        Aayan Bothra
                      </a>
                      <Star size={14} className="text-yellow-400 pulse-glow" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MusicMessage = () => {
  const { userRole } = useExperience();
  
  const messages = {
    visitor: "Would you like some music for your scrolling journey?",
    recruiter: "Would you like some music for your scrolling evaluation?",
    student: "Would you like some music for your scrolling study session?",
    fan: "Would you like some music for your scrolling exploration?"
  };
  
  return (
    <p className="text-xl max-w-2xl mx-auto">
      {messages[userRole || 'visitor']}
    </p>
  );
};

const Index = () => {
  return (
    <ExperienceProvider>
      <MainLayout />
    </ExperienceProvider>
  );
};

export default Index;
