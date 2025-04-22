
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  initialY: number;
}

const generateParticle = (width: number, height: number, theme: string): Particle => {
  const size = Math.random() * 2.5 + 1;
  
  let color = '';
  if (theme === 'dark') {
    const colors = [
      `rgba(139, 92, 246, ${Math.random() * 0.7 + 0.3})`,
      `rgba(14, 165, 233, ${Math.random() * 0.7 + 0.3})`,
      `rgba(217, 70, 239, ${Math.random() * 0.7 + 0.3})`,
      `rgba(249, 115, 22, ${Math.random() * 0.6 + 0.2})`,
    ];
    color = colors[Math.floor(Math.random() * colors.length)];
  } else {
    const colors = [
      `rgba(196, 181, 253, ${Math.random() * 0.6 + 0.2})`,
      `rgba(147, 197, 253, ${Math.random() * 0.6 + 0.2})`,
      `rgba(251, 207, 232, ${Math.random() * 0.6 + 0.2})`,
      `rgba(254, 215, 170, ${Math.random() * 0.5 + 0.2})`,
    ];
    color = colors[Math.floor(Math.random() * colors.length)];
  }

  const x = Math.random() * width;
  const y = Math.random() * height;
  
  return {
    x,
    y,
    initialY: y,
    size,
    color,
    speedY: Math.random() * 0.2 + 0.05,
  };
};

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  
  let themeValue = 'dark';
  try {
    const { theme } = useTheme();
    themeValue = theme;
  } catch (error) {
    console.log("ThemeProvider not available yet, defaulting to dark theme");
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        if (canvasRef.current) {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);
  
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      // Increase particle count for better coverage
      const particleCount = Math.min(Math.floor((dimensions.width * dimensions.height) / 15000), 70);
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push(generateParticle(dimensions.width, dimensions.height, themeValue));
      }
      
      setParticles(newParticles);
    }
  }, [dimensions, themeValue]);
  
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make sure canvas covers the full window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particles[index].y -= particle.speedY;
        
        if (particles[index].y < -10) {
          particles[index].y = dimensions.height + 10;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, dimensions]);
  
  return (
    <canvas 
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="particles-container fixed inset-0 z-0"
    />
  );
};

export default ParticlesBackground;
