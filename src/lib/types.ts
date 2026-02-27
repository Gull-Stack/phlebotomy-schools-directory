export interface School {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  state_code: string;
  website: string | null;
  program_type: 'online' | 'hybrid' | 'in-person';
  tuition_low: number;
  tuition_high: number;
  program_length_weeks: number;
  program_length_display: string;
  accreditation: string[];
  certifications_prepared: string[];
  financial_aid: boolean;
  externship_included: boolean;
  externship_hours: number | null;
  highlights: string[];
  national: boolean;
  description: string | null;
  logo_url: string | null;
  vote_count: number;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}
