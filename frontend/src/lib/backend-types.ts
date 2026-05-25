export interface BackendProject {
  id: string
  name: string
  language?: string
  description?: string
  full_description?: string
  source_url?: string | null
  skills?: string[]
  impact?: string
  image_url?: string | null
  order_index?: number
  created_at?: string
}

export interface BackendBlog {
  id: string
  title: string
  content: string
  category: string
  tags?: string[]
  image_url?: string | null
  github_url?: string | null
  linkedin_url?: string | null
  other_url?: string | null
  views?: number
  created_at?: string
}

export interface BackendExperience {
  id: string
  role: string
  company: string
  duration: string
  description: string
  achievements?: string[]
  order_index?: number
}

export interface BackendSkill {
  id: string
  name: string
  category?: string
  proficiency?: number
  order_index?: number
}

export interface BackendEducation {
  id: string
  degree: string
  institution: string
  duration: string
  description?: string
  order_index?: number
}

export interface ContactPayload {
  name: string
  email: string
  subject?: string
  message: string
}
