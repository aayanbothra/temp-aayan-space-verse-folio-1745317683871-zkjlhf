
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Stars, Sun, Orbit } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      size="icon" 
      variant="ghost" 
      className="relative rounded-full w-10 h-10 bg-transparent transition-all duration-300 mr-2 md:mr-4"
      onClick={toggleTheme} 
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6 overflow-hidden flex items-center justify-center">
        {/* Dark Mode Icon with Animation */}
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === 'dark' ? 0 : 180,
            scale: theme === 'dark' ? 1 : 0,
            opacity: theme === 'dark' ? 1 : 0
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="absolute"
        >
          <Moon className="text-purple-300" />
        </motion.div>

        {/* Light Mode Icon with Animation */}
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === 'light' ? 0 : -180,
            scale: theme === 'light' ? 1 : 0,
            opacity: theme === 'light' ? 1 : 0
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="absolute"
        >
          <Sun className="text-amber-400" />
        </motion.div>
      </div>
      
      {/* Orbiting Stars Animation for Dark Mode */}
      {theme === 'dark' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear"
            }}
            className="absolute w-full h-full"
          >
            <Stars className="absolute text-purple-300/40 w-2 h-2 top-0 right-[4px]" />
            <Stars className="absolute text-purple-300/20 w-3 h-3 bottom-[2px] left-[3px]" />
          </motion.div>
        </motion.div>
      )}
      
      {/* Orbiting Sun Rays for Light Mode */}
      {theme === 'light' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear"
            }}
            className="absolute w-full h-full"
          >
            <Orbit className="absolute text-amber-300/40 w-full h-full" />
          </motion.div>
        </motion.div>
      )}
    </Button>
  );
};

export default ThemeToggle;
