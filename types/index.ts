// types/index.ts
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image: string
  githubUrl: string
  liveUrl: string
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  coverImage: string
  tags: string[]
  publishedAt: Date
  readingTime: number
}

export interface Skill {
  name: string
  category: string
  level: number
  icon: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate: Date | null
  current: boolean
  description: string[]
  technologies: string[]
  logo: string
}