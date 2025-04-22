
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/context/ThemeContext';
import { 
  Search, 
  X, 
  Info
} from 'lucide-react';

// Define Skill type to match Supabase schema
interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  description?: string;
}

const SkillLibrary = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  
  // Fetch skills from Supabase
  const { data: skillsData = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('proficiency', { ascending: false });
      
      if (error) throw error;
      return data as Skill[];
    }
  });

  // Get all unique skill categories plus Adobe filter
  const categories = ['all', ...Array.from(new Set(skillsData.map(skill => skill.category))), 'adobe'];
  
  // Filter skills based on active filter and search query
  const filteredSkills = skillsData.filter(skill => {
    // Filter by category or Adobe tag
    const matchesFilter = 
      activeFilter === 'all' ? true : 
      activeFilter === 'adobe' ? skill.name.toLowerCase().includes('adobe') : 
      skill.category.toLowerCase() === activeFilter.toLowerCase();
    
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' ? true :
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleSkillClick = (skill: Skill) => {
    setActiveSkill(activeSkill?.id === skill.id ? null : skill);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold title-gradient mb-4">Skill Library</h2>
          <p className={`text-xl max-w-2xl mx-auto mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            A comprehensive collection of my technical and creative abilities across various disciplines
          </p>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-3xl mx-auto mb-8">
            <div className="relative flex-grow max-w-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                <Search 
                  className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
                  size={18} 
                  strokeWidth={2.5} 
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-10 ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white focus:ring-space-purple' 
                      : 'bg-white border-purple-100 text-gray-800 focus:ring-purple-400'
                  } border rounded-full py-3 focus:outline-none focus:ring-2`}
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === category 
                      ? theme === 'dark'
                        ? 'bg-space-purple text-white' 
                        : 'bg-purple-600 text-white'
                      : theme === 'dark'
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-purple-100/50 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              onClick={() => handleSkillClick(skill)}
              className={`skill-card cursor-pointer ${
                activeSkill?.id === skill.id 
                  ? theme === 'dark' 
                    ? 'border-space-purple/50' 
                    : 'border-purple-300'
                  : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-space-purple/20 text-space-purple-light' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {/* Consider mapping icon names to actual icons from lucide-react */}
                  <span>{skill.icon || '🔧'}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{skill.name}</h3>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {skill.description || 'No description available'}
                  </p>
                  
                  {skill.proficiency && (
                    <div className={`w-full ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} h-2 rounded-full overflow-hidden`}>
                      <motion.div 
                        className="h-full skill-bar"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-space-purple/10 text-gray-400' 
                        : 'bg-purple-50 text-gray-500'
                    }`}>
                      {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredSkills.length === 0 && (
          <div className="text-center py-10">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              No skills match your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillLibrary;
