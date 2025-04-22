import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Calendar, Code, FileText, Laptop, Music, Video, Award, Briefcase, 
  Edit, Globe, Users, School, Mic, Headphones, Globe as Web 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

// Types for timeline data
interface TimelineEntry {
  id: number;
  date: string;
  title: string;
  role: string;
  type: string;
  location?: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  skills: string[];
  links?: { text: string; url: string }[];
  image?: string;
}

// Timeline data with your experiences
const timelineData: TimelineEntry[] = [
  {
    id: 1,
    date: "Apr 2025 – Present",
    title: "Upstream Social",
    role: "Editor & Graphic Designer",
    type: "Part-time · Hybrid",
    location: "Bangalore Urban, India",
    description: "Leveraged design and editing tools to create compelling social media content.",
    bullets: [
      "Edited reels and videos for digital campaigns",
      "Designed Instagram posts, stories, and highlight covers",
      "Developed branded assets in line with Upstream's marketing strategy",
      "Collaborated remotely to meet fast-paced content deadlines"
    ],
    skills: ["Premiere Pro", "Photoshop", "Social Media Strategy"],
    icon: <Edit className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 2,
    date: "Dec 2024 – Present",
    title: "Paradoxical Media",
    role: "Founder & CEO",
    type: "Full-time · Remote",
    location: "Ontario, Canada",
    description: "Founded a creative agency combining media production and functional web solutions.",
    bullets: [
      "Delivered design-first websites for content creators and startups",
      "Handled client onboarding, creative direction, and project management",
      "Produced visual content, brand kits, and scalable design systems",
      "Oversaw a remote team and streamlined workflows using Notion & Trello"
    ],
    skills: ["Branding", "Web Design", "Client Management", "Content Creation"],
    icon: <Briefcase className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 3,
    date: "Aug 2024 – Mar 2025",
    title: "Social Environment Education Foundation",
    role: "Web Developer",
    type: "Volunteer",
    description: "Designed and maintained a website to amplify SEEF's sustainability mission.",
    bullets: [
      "Implemented SEO-optimized web layouts using Webflow",
      "Created infographics and motion reels for campaigns",
      "Enhanced accessibility and cross-device performance",
      "Collaborated with environmentalists to convert ideas into visuals"
    ],
    skills: ["Webflow", "Motion Design", "Graphic Design", "Sustainability"],
    icon: <Web className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 4,
    date: "Nov 2023 – Mar 2025",
    title: "St. Joseph's Boys' High School",
    role: "Head of Media, Tech & Design",
    type: "Part-time",
    description: "Pioneered digital innovation across interschool events and mentoring programs.",
    bullets: [
      "Led 20+ students in full-stack dev, filmmaking, and branding",
      "Designed, coded, and deployed fest websites with live reg systems",
      "Built visual identities, trailers, and promotional campaigns",
      "Co-led the tech division for flagship events (MUN, fests, productions)"
    ],
    skills: ["React", "Leadership", "Digital Content", "UX/UI Design"],
    icon: <School className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 5,
    date: "Jan 2024 – Aug 2024",
    title: "SJBHS MUN 2024",
    role: "Committee Head – Media & Tech Division",
    type: "Production & Branding",
    description: "Directed all media, tech, and design operations for a national-level MUN.",
    bullets: [
      "Managed 10+ team members across video, edit, and web teams",
      "Produced cinematic trailers with Dune-inspired visuals",
      "Developed a full-stack website with animated interactions and portals",
      "Coordinated equipment shoots, promo releases, and online rollouts"
    ],
    skills: ["Event Branding", "Web Dev", "Filmmaking", "Framer Motion"],
    icon: <Users className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 6,
    date: "Jul 2023 – Present",
    title: "Editors x Clients",
    role: "Founder",
    type: "Startup Lead",
    description: "Built an online marketplace connecting creators with editors & designers.",
    bullets: [
      "Launched a platform servicing over 300 clients globally",
      "Onboarded and managed a vetted team of 12+ creative professionals",
      "Handled client negotiations, pricing models, and performance tracking",
      "Developed custom tools to streamline project delivery"
    ],
    skills: ["Startup Strategy", "Content Operations", "Team Leadership"],
    icon: <Briefcase className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 7,
    date: "Jan 2020 – Present",
    title: "Independent Artist",
    role: "Musician & Producer",
    type: "Frontman & Composer",
    description: "Composed, produced, and published original music across genres.",
    bullets: [
      "Released 30+ original compositions with full mixing & mastering",
      "Led a competition-winning band as vocalist and multi-instrumentalist",
      "Scored short films and stage plays with cinematic music",
      "Built a YouTube channel with 1.2K+ subscribers for music content"
    ],
    skills: ["Logic Pro X", "Piano", "Guitar", "Vocal Production"],
    icon: <Music className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 8,
    date: "Jun 2021 – Dec 2023",
    title: "VALORANT – Asia Pacific Region",
    role: "Radiant-Ranked Player",
    type: "Esports Competitor",
    description: "Achieved Radiant rank (Top 500) and led multiple tournament squads.",
    bullets: [
      "Played competitive scrims and official APAC qualifiers",
      "Led team compositions, in-game strategy, and VOD reviews",
      "Balanced gameplay with editing highlight reels and analysis content"
    ],
    skills: ["Game Strategy", "Team Communication", "Competitive Leadership"],
    icon: <Award className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 9,
    date: "2022 – Present",
    title: "National & City-Level Placements",
    role: "Filmmaker & Editor",
    type: "Visual Storytelling",
    description: "Directed and edited short films and trailers for fests and competitions.",
    bullets: [
      "Awarded city-level placements for cinematic trailers",
      "Developed scripts, storyboards, and production timelines",
      "Edited with Adobe Premiere Pro and DaVinci Resolve"
    ],
    skills: ["Cinematography", "Color Grading", "Directing"],
    icon: <Video className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 13,
    date: "Mar 2024",
    title: "Aurum 2024 – Loyola Technology Center",
    role: "Educator & Fundraiser",
    type: "Volunteer · STEM Outreach",
    description: "Took my passion for tech and turned it into action.",
    bullets: [
      "Led a charity drive to provide STEM courses and tech to underfunded schools",
      "Ran robotics and coding workshops, enabling hands-on tech exposure",
      "Delivered talks on STEM careers, inspiring future innovators",
      "Helped bridge the opportunity gap for students in underserved areas"
    ],
    skills: ["Public Speaking", "Robotics", "Education", "Outreach"],
    icon: <School className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 14,
    date: "Aug 2023 – Sep 2023",
    title: "Intel Corporation",
    role: "Machine Learning Intern",
    type: "AI for Good · 2 mos",
    description: "Built a smart traffic light system using AI and real-time object detection.",
    bullets: [
      "Used Python, OpenCV, and CaffeNet to recognize obstacles & pedestrians",
      "Designed a system that adjusted traffic flow dynamically",
      "Ranked in top 3 nationally; recognized for UN SDG alignment",
      "Shadowed Intel ML engineers and explored real-world neural networks"
    ],
    skills: ["Python", "OpenCV", "Machine Learning", "Computer Vision"],
    icon: <Code className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 15,
    date: "Aug 2021 – Oct 2021",
    title: "JangliDonkey",
    role: "Manager – Content & Ads",
    type: "Creative Strategy & Ops · 3 mos",
    description: "Went from editor to engine.",
    bullets: [
      "Managed 200+ marketing/product videos and ad campaigns",
      "Boosted CTR and conversions through data-driven video content",
      "Trained & led 4 new team members; established efficient workflows",
      "Used web scraping to guide marketing research & audience targeting"
    ],
    skills: ["Video Editing", "Marketing Analytics", "Team Management", "Web Scraping"],
    icon: <Video className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  },
  {
    id: 16,
    date: "Aug 2020 – Nov 2020",
    title: "LFYD",
    role: "Video Editor – App Promotions",
    type: "Motion Design & Editing · 4 mos",
    description: "Turned raw footage into app downloads.",
    bullets: [
      "Created promotional videos that led to 8,000+ new installs",
      "Used Camtasia to design motion graphics and dynamic feature reels",
      "Balanced visual appeal with clear user journeys",
      "Developed editing fundamentals through trial, error, and persistence"
    ],
    skills: ["Camtasia", "Motion Graphics", "App Marketing", "Promo Editing"],
    icon: <Edit className="text-space-purple" />,
    links: [{ text: "View Project", url: "#" }]
  }
];

const Timeline = () => {
  const { theme } = useTheme();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="timeline" className="py-20 px-4" ref={timelineRef}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold title-gradient mb-4">My Journey</h2>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            A chronological timeline of my key projects, roles, and experiences
          </p>
        </motion.div>

        <div className="relative">
          <div className="timeline-line"></div>

          {timelineData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex flex-col md:flex-row md:items-center gap-4 mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-space-purple shadow-lg shadow-space-purple/50 flex items-center justify-center z-10">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
              </div>
              
              <div className={`md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} pl-8 md:pl-0`}>
                <div className={`px-4 py-2 rounded-lg glass-panel flex items-center justify-center ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <Calendar className="mr-2 text-space-purple" size={16} />
                  <span className="font-medium">{entry.date}</span>
                </div>
              </div>

              <motion.div 
                className={`md:w-1/2 glass-panel p-6 ml-8 md:ml-0 ${
                  index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'
                }`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-start mb-3">
                  <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-purple-100/50'} mr-3`}>
                    {entry.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{entry.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-space-purple/20 text-space-purple-light' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {entry.role}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {entry.description}
                </p>

                <ul className="mb-4 space-y-2">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-space-purple"></span>
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {entry.location && (
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    📍 {entry.location}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        theme === 'dark' 
                          ? 'border-space-purple/30 text-gray-300' 
                          : 'border-purple-300 text-purple-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {entry.links && (
                  <div className="flex gap-2">
                    {entry.links.map((link, i) => (
                      <a 
                        key={i}
                        href={link.url}
                        className={`text-sm px-3 py-1 rounded-full border ${
                          theme === 'dark' 
                            ? 'border-space-purple/30 hover:bg-space-purple/20 text-gray-200' 
                            : 'border-purple-300 hover:bg-purple-100 text-purple-800'
                        } transition-colors`}
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
