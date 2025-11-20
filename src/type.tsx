export interface Chapter {
  file: string;
  order: number;
  slug: number;
  title: string;
  description?: string;
  tags?: string[];
  content:string;
}

export interface Book {
  title: string;
  slug: string;
  description: string;
  author: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;    // timestamp
  updatedAt: number;    // timestamp
  status: boolean;
  cover: string;
  chapters: Chapter[];
}
