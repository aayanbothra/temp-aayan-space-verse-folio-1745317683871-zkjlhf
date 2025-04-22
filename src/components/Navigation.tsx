
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code, Music2, FileText, Rocket, Globe, Star, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  
  const navItems = [
    { name: 'Home', href: '#home', icon: <Rocket size={16} className="mr-1" /> },
    { name: 'Blog', href: '/blog', icon: <Book size={16} className="mr-1" /> },
    { name: 'Projects', href: '#projects', icon: <Globe size={16} className="mr-1" /> },
    { name: 'Timeline', href: '#timeline', icon: <Star size={16} className="mr-1" /> },
    { name: 'Skills', href: '#skills', icon: <Code size={16} className="mr-1" /> },
    { name: 'Music', href: '#music', icon: <Music2 size={16} className="mr-1" /> },
    { name: 'Contact', href: '#contact', icon: <FileText size={16} className="mr-1" /> },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-3 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className={`${scrolled ? 'nav-blur-fix' : 'bg-transparent'} flex items-center justify-between transition-all duration-300 py-2 rounded-xl`}>
          <motion.a 
            href="#home"
            className="title-gradient text-xl font-bold tracking-tight hover:opacity-80 transition-opacity ml-4 md:ml-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            AB
          </motion.a>

          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8 py-4">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-purple-900'
                } transition-colors duration-200 flex items-center font-medium`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item.icon}
                {item.name}
              </motion.a>
            ))}
          </nav>
          
          <div className="md:flex items-center hidden mr-4 md:mr-6">
            <ThemeToggle />
          </div>
          
          <div className="md:hidden flex items-center gap-2 mr-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className={`${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-gray-700 hover:text-purple-900 hover:bg-purple-100/50'
              }`}
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="nav-blur-fix mt-2 rounded-lg px-4 py-5 md:hidden mx-4"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-purple-900'
                  } transition-colors duration-200 py-2 flex items-center`}
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  {item.icon}
                  {item.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navigation;
