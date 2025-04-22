
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { resumeService } from '@/services/resumeService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, GraduationCap, Award, Star, FileText, Code, Music, Video, Globe } from 'lucide-react';

const ResumeTimelineEntry: React.FC<{
  title: string;
  date: string;
  description: string;
  icon?: string;
  index: number;
}> = ({ title, date, description, icon, index }) => {
  const getIcon = () => {
    switch(icon) {
      case 'work': return <Briefcase className="w-5 h-5 text-primary" />;
      case 'education': return <GraduationCap className="w-5 h-5 text-primary" />;
      case 'award': return <Award className="w-5 h-5 text-primary" />;
      case 'project': return <FileText className="w-5 h-5 text-primary" />;
      case 'code': return <Code className="w-5 h-5 text-primary" />;
      case 'music': return <Music className="w-5 h-5 text-primary" />;
      case 'video': return <Video className="w-5 h-5 text-primary" />;
      case 'web': return <Globe className="w-5 h-5 text-primary" />;
      default: return <Star className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="mb-8 last:mb-0"
    >
      <Card className="overflow-hidden backdrop-blur-md bg-opacity-20 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-muted flex items-center justify-center">
                {getIcon()}
              </div>
              <CardTitle>{title}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">{date}</div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base whitespace-pre-line">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InteractiveResume: React.FC = () => {
  const { data: resumeTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ['resumeTypes'],
    queryFn: () => resumeService.getResumeTypes(),
  });

  const [activeType, setActiveType] = useState<string | undefined>(resumeTypes[0]);

  const { data: resumeEntries = [], isLoading } = useQuery({
    queryKey: ['resumeEntries', activeType],
    queryFn: () => resumeService.getResumeEntries(activeType),
    enabled: Boolean(activeType),
  });

  // Set active type when resumeTypes loads
  React.useEffect(() => {
    if (resumeTypes.length > 0 && !activeType) {
      setActiveType(resumeTypes[0]);
    }
  }, [resumeTypes, activeType]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold title-gradient mb-4">Interactive Resume</h2>
        <p className="text-xl max-w-2xl mx-auto">
          Explore my professional experience, education, and achievements
        </p>
      </div>

      {typesLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : resumeTypes.length > 0 ? (
        <Tabs 
          value={activeType || resumeTypes[0]} 
          onValueChange={setActiveType}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            {resumeTypes.map(type => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {resumeTypes.map(type => (
            <TabsContent key={type} value={type} className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {resumeEntries
                    .filter(entry => entry.type === type)
                    .map((entry, index) => (
                      <ResumeTimelineEntry
                        key={entry.id}
                        title={entry.title}
                        date={entry.date}
                        description={entry.description}
                        icon={entry.icon || type}
                        index={index}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p>No resume data available. Please add resume entries in the admin panel.</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveResume;
