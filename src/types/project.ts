
export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  thumbnail?: string | null;
  links?: {
    website?: string;
    [key: string]: string | undefined;
  };
  created_at?: string;
}
