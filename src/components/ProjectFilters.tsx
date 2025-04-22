
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from 'lucide-react';

interface ProjectFiltersProps {
  onFilterChange: (filters: { category?: string; technologies?: string[] }) => void;
}

const categories = [
  "Web Development",
  "Motion Design",
  "Music Production",
  "Graphic Design"
];

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  
  useEffect(() => {
    onFilterChange({ 
      category: selectedCategory, 
      technologies: selectedTechnologies.length > 0 ? selectedTechnologies : undefined 
    });
  }, [selectedCategory, selectedTechnologies, onFilterChange]);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? undefined : value);
  };
  
  const handleTechnologyClick = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };
  
  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTechnologies([]);
  };
  
  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select
            value={selectedCategory || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full hover:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="hover:bg-purple-500/10 focus:bg-purple-500/10"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(selectedCategory || selectedTechnologies.length > 0) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-1 hover:border-purple-500 hover:text-purple-500"
          >
            Clear Filters <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;
