
import React from 'react';
import { motion } from 'framer-motion';
import { useExperience, UserRole } from '@/context/ExperienceContext';
import { Eye, Briefcase, GraduationCap, Heart } from 'lucide-react';

interface RoleOptionProps {
  role: UserRole;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

const RoleOption = ({ role, icon, label, description, onClick }: RoleOptionProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="glass-panel p-8 flex flex-col items-center cursor-pointer transition-colors duration-300 glow-effect"
      onClick={onClick}
    >
      <motion.div 
        className="icon-container text-space-purple mb-5 text-4xl"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold mb-3">{label}</h3>
      <p className="text-base text-center text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const ExperienceSelector = () => {
  const { setUserRole, setExperienceSelected } = useExperience();
  
  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setExperienceSelected(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-16"
    >
      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 title-gradient">
            Who are you?
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Select an option to customize your experience on Aayan's portfolio
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <RoleOption
            role="visitor"
            icon={<Eye />}
            label="Visitor"
            description="Just exploring and want to see everything"
            onClick={() => handleRoleSelect('visitor')}
          />
          <RoleOption
            role="recruiter"
            icon={<Briefcase />}
            label="Recruiter"
            description="Looking to hire talent for your team"
            onClick={() => handleRoleSelect('recruiter')}
          />
          <RoleOption
            role="student"
            icon={<GraduationCap />}
            label="Student"
            description="Interested in learning and resources"
            onClick={() => handleRoleSelect('student')}
          />
          <RoleOption
            role="fan"
            icon={<Heart />}
            label="Guest"
            description="Here for the creative work and updates"
            onClick={() => handleRoleSelect('fan')}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExperienceSelector;
