
export const resumeEntries = [
  {
    type: "education",
    title: "St. Joseph's Boys' High School",
    description: "Class Rank: Top 10% (Decile)",
    date: "Present",
    icon: "education"
  },
  {
    type: "experience",
    title: "Founder & CEO, Editors x Clients",
    description: "Spearheaded an online media startup, delivering premium edited content and graphics to over 300 aspiring content creators.\n\nOrchestrated a team of 12 professionals, optimizing task allocation, payment processes, and deadline adherence, resulting in a 140% profit margin.\n\nEngineered and deployed a client-facing website, enhancing service accessibility and streamlining payment integration.\n\nCultivated strong client relationships, receiving 150+ positive testimonials across platforms like Discord and Twitter.",
    date: "September 2021 - Present",
    icon: "work"
  },
  {
    type: "experience",
    title: "Junior AI/ Machine Learning Intern at Intel Corporation",
    description: "Innovated a smart traffic light system utilizing AI and Machine Learning to enhance road safety by detecting pedestrians and obstacles.\n\nEarned recognition for aligning the project with the UN's Sustainable Development Goals, placing it among the top three in Intel's National AI For Youth program.\n\nGained hands-on experience in a corporate environment, shadowing experts in the machine learning department and applying theoretical knowledge to real-world challenges.\n\nDeveloped a deeper understanding of AI principles and their potential to drive sustainable technological advancements.",
    date: "August 2023 - September 2023",
    icon: "work"
  },
  {
    type: "experience",
    title: "Committee Head, Head of Media & Tech",
    description: "Directed the media and tech division for two consecutive years, significantly boosting conference participation through strategic marketing efforts.\n\nMentored 27 peers in content creation, design, and web development, fostering a collaborative and innovative environment.\n\nProduced high-impact media content, including teasers and trailers, that garnered over 100,000 views on social media.\n\nEnhanced leadership skills by managing multiple teams and overseeing the entire media and tech operations of the conference.",
    date: "July 2023 - November 2024",
    icon: "work"
  },
  {
    type: "experience",
    title: "Head of Media, Tech & Design at St. Joseph's Boys' High School",
    description: "Mentored 20+ peers in mastering social media marketing, filmmaking, and design, contributing to the success of school events and online presence.\n\nConducted workshops on web development, teaching HTML, CSS, and JavaScript to peers and junior students.\n\nDeveloped promotional materials and managed websites for four inter-school fests, leading to a 40% increase in participant turnout.\n\nProgrammed, designed and maintained the websites for the fests, setting up the backend architecture and databases to ensure a streamlined experience for participants.\n\nDeepened understanding of digital marketing and the technical aspects of web design and development.",
    date: "November 2023 - Present",
    icon: "work"
  },
  {
    type: "award",
    title: "BGS World School Valedictorian",
    description: "Top 2 of 57 (2023) - 97% Score",
    date: "2023",
    icon: "award"
  },
  {
    type: "award",
    title: "National Cyber Olympiad",
    description: "Rank 1 in City, 17 in Country and 102 Internationally",
    date: "2022",
    icon: "award"
  },
  {
    type: "award",
    title: "General Proficiency Award",
    description: "St. Joseph's Boys' High School - English & Computer Science",
    date: "2024",
    icon: "award"
  },
  {
    type: "award",
    title: "UN Sustainable Project Award",
    description: "Intel Corporation India & CBSE - Top 3 of 4000",
    date: "2024",
    icon: "award"
  },
  {
    type: "experience",
    title: "Editor, Designer & Programmer at Social Environment Education Foundation",
    description: "Conceptualized and executed a content strategy aimed at raising environmental awareness, significantly increasing the foundation's outreach.\n\nDesigned and optimized the SEEF website, enhancing user experience through thoughtful layout and aesthetic choices.\n\nProduced diverse media content that effectively communicated the foundation's mission to a broad audience.\n\nAcquired valuable experience in environmental advocacy and the role of media in shaping public perceptions.",
    date: "August 2024 - Present",
    icon: "work"
  }
];

// Helper function to seed the database
export const seedResumeEntries = async () => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  console.log('Starting to seed resume entries...');
  
  for (const entry of resumeEntries) {
    const { error } = await supabase
      .from('resume')
      .insert(entry);
      
    if (error) {
      console.error('Error inserting resume entry:', error);
    } else {
      console.log(`Successfully inserted entry: ${entry.title}`);
    }
  }
  
  console.log('Finished seeding resume entries');
};
