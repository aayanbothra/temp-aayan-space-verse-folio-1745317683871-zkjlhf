
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  published: boolean;
}
