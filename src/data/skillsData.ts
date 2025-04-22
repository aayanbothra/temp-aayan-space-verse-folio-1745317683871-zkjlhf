// This file contains the default skills data to seed into Supabase
// These skills are extracted from the Timeline component

export interface SkillSeed {
  name: string;
  category: string;
  description?: string;
  proficiency: number;
  icon?: string;
}

export const skillsData: SkillSeed[] = [
  // Web Development Skills
  { name: "React", category: "Development", description: "Frontend library for building user interfaces", proficiency: 95, icon: "🧩" },
  { name: "TypeScript", category: "Development", description: "Strongly typed programming language", proficiency: 90, icon: "📘" },
  { name: "Next.js", category: "Development", description: "React framework for production", proficiency: 85, icon: "🚀" },
  { name: "Express.js", category: "Development", description: "Web application framework for Node.js", proficiency: 80, icon: "🛠️" },
  { name: "Firebase", category: "Development", description: "Platform for web and mobile app development", proficiency: 85, icon: "🔥" },
  { name: "Razorpay API", category: "Development", description: "Payment gateway integration", proficiency: 75, icon: "💰" },
  { name: "Webflow", category: "Development", description: "Visual web development platform", proficiency: 80, icon: "🌊" },
  { name: "HTML5", category: "Development", description: "Markup language for web pages", proficiency: 95, icon: "🌐" },
  { name: "CSS3", category: "Development", description: "Style sheet language", proficiency: 90, icon: "🎨" },
  { name: "JavaScript", category: "Development", description: "Programming language for the web", proficiency: 95, icon: "📜" },
  { name: "Framer Motion", category: "Development", description: "Animation library for React", proficiency: 85, icon: "✨" },
  
  // Design Skills
  { name: "UI/UX Design", category: "Design", description: "User interface & experience design", proficiency: 90, icon: "📱" },
  { name: "Figma", category: "Design", description: "Collaborative interface design tool", proficiency: 85, icon: "🖌️" },
  { name: "Adobe Photoshop", category: "Design", description: "Raster graphics editor", proficiency: 80, icon: "🖼️" },
  { name: "Adobe Illustrator", category: "Design", description: "Vector graphics editor", proficiency: 75, icon: "✏️" },
  { name: "Adobe After Effects", category: "Design", description: "Digital motion graphics and compositing", proficiency: 85, icon: "🎬" },
  { name: "Adobe Premiere Pro", category: "Design", description: "Video editing software", proficiency: 90, icon: "🎥" },
  { name: "DaVinci Resolve", category: "Design", description: "Color grading and video editing", proficiency: 80, icon: "🎞️" },
  
  // Music Production Skills
  { name: "Logic Pro X", category: "Music", description: "Digital audio workstation", proficiency: 90, icon: "🎵" },
  { name: "FL Studio", category: "Music", description: "Digital audio workstation", proficiency: 85, icon: "🎹" },
  { name: "Piano", category: "Music", description: "Keyboard instrument", proficiency: 85, icon: "🎹" },
  { name: "Guitar", category: "Music", description: "Stringed instrument", proficiency: 80, icon: "🎸" },
  { name: "Vocal Production", category: "Music", description: "Recording and processing vocals", proficiency: 75, icon: "🎤" },
  { name: "Sound Design", category: "Music", description: "Creating audio elements", proficiency: 80, icon: "🔊" },
  
  // Other Technical Skills
  { name: "Python", category: "Development", description: "General-purpose programming language", proficiency: 85, icon: "🐍" },
  { name: "OpenCV", category: "Development", description: "Computer vision library", proficiency: 75, icon: "👁️" },
  { name: "Machine Learning", category: "Development", description: "AI algorithms that learn from data", proficiency: 70, icon: "🧠" },
  { name: "Computer Vision", category: "Development", description: "Field of computer science focused on enabling computers to see", proficiency: 70, icon: "📷" },
  { name: "Web Scraping", category: "Development", description: "Extracting data from websites", proficiency: 80, icon: "🕸️" },
  
  // Leadership & Management Skills
  { name: "Team Leadership", category: "Management", description: "Leading and motivating teams", proficiency: 90, icon: "👥" },
  { name: "Project Management", category: "Management", description: "Planning and overseeing projects", proficiency: 85, icon: "📋" },
  { name: "Client Management", category: "Management", description: "Managing client relationships", proficiency: 85, icon: "🤝" },
  { name: "Content Operations", category: "Management", description: "Managing content creation workflows", proficiency: 80, icon: "📊" },
  { name: "Public Speaking", category: "Communication", description: "Presenting to audiences", proficiency: 85, icon: "🎤" },
  
  // Specialized Skills
  { name: "Cinematography", category: "Media", description: "Art of motion-picture photography", proficiency: 85, icon: "🎦" },
  { name: "Color Grading", category: "Media", description: "Altering/enhancing colors in images/video", proficiency: 80, icon: "🌈" },
  { name: "Directing", category: "Media", description: "Managing creative aspects of production", proficiency: 80, icon: "🎬" },
  { name: "Motion Graphics", category: "Media", description: "Animated graphic design", proficiency: 85, icon: "✨" },
  { name: "App Marketing", category: "Marketing", description: "Promoting mobile applications", proficiency: 75, icon: "📱" },
  { name: "Promo Editing", category: "Media", description: "Creating promotional videos", proficiency: 85, icon: "🎞️" },
  { name: "Robotics", category: "Technology", description: "Design and operation of robots", proficiency: 70, icon: "🤖" },
  { name: "Education", category: "Communication", description: "Teaching and knowledge transfer", proficiency: 85, icon: "🎓" },
  { name: "Outreach", category: "Communication", description: "Connecting with communities", proficiency: 80, icon: "🌐" },
  
  // Gaming Skills
  { name: "Game Strategy", category: "Gaming", description: "Strategic gameplay planning", proficiency: 90, icon: "🎮" },
  { name: "Team Communication", category: "Communication", description: "Effective team interaction", proficiency: 90, icon: "🗣️" },
  { name: "Competitive Leadership", category: "Gaming", description: "Leading teams in competitive environments", proficiency: 85, icon: "🏆" }
];

export const seedSkills = async () => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    // Check if skills already exist
    const { data: existingSkills, error: checkError } = await supabase
      .from('skills')
      .select('name')
      .limit(1);
    
    if (checkError) throw checkError;
    
    // If skills exist, don't seed
    if (existingSkills && existingSkills.length > 0) {
      console.log('Skills already exist, skipping seed');
      return;
    }
    
    // Insert all skills
    const { error: insertError } = await supabase
      .from('skills')
      .insert(skillsData);
    
    if (insertError) throw insertError;
    
    console.log('Successfully seeded skills data');
  } catch (error) {
    console.error('Error seeding skills:', error);
    throw error;
  }
};
