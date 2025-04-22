
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface MeteorDividerProps {
  className?: string;
}

const MeteorDivider: React.FC<MeteorDividerProps> = ({ className = '' }) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!dividerRef.current) return;
    
    const divider = dividerRef.current;
    const createMeteor = () => {
      if (!divider) return;
      
      // Create meteor element
      const meteor = document.createElement('div');
      meteor.classList.add('meteor');
      
      // Set meteor size and position
      const size = Math.random() * 2 + 1;
      const startPosition = Math.random() * divider.offsetWidth;
      
      meteor.style.width = `${size}px`;
      meteor.style.height = `${size * 30}px`;
      meteor.style.left = `${startPosition}px`;
      meteor.style.top = '-50px';
      
      // Apply color based on theme
      if (theme === 'dark') {
        meteor.style.background = 'linear-gradient(transparent, rgba(255, 255, 255, 0.8))';
        meteor.style.boxShadow = '0 0 10px 2px rgba(255, 255, 255, 0.7)';
      } else {
        meteor.style.background = 'linear-gradient(transparent, rgba(139, 92, 246, 0.8))';
        meteor.style.boxShadow = '0 0 10px 2px rgba(139, 92, 246, 0.7)';
      }
      
      // Add to divider
      divider.appendChild(meteor);
      
      // Animate meteor
      const animation = meteor.animate([
        { 
          top: '-50px', 
          left: `${startPosition}px`,
          opacity: 1 
        },
        { 
          top: `${divider.offsetHeight + 50}px`, 
          left: `${startPosition + 100}px`, 
          opacity: 0 
        }
      ], {
        duration: Math.random() * 1000 + 500,
        easing: 'ease-in'
      });
      
      // Remove meteor after animation completes
      animation.onfinish = () => {
        meteor.remove();
      };
    };
    
    // Create meteors at random intervals
    const intervalId = setInterval(() => {
      if (Math.random() > 0.7) {
        createMeteor();
      }
    }, 300);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [theme]);

  return (
    <div 
      ref={dividerRef} 
      className={`section-divider ${className}`} 
      aria-hidden="true"
    >
      <div className={`absolute inset-x-0 h-px top-1/2 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-transparent via-space-purple/30 to-transparent' 
          : 'bg-gradient-to-r from-transparent via-purple-400/30 to-transparent'
      }`} />
    </div>
  );
};

export default MeteorDivider;
