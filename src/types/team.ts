// src/types/team.ts
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface TeamMember {
  id?: string;  // Made optional to match the actual data
  name: string;
  role: string;
  classifiers: string[] | string;  // Can be array or string
  image: string;
  bio: string;
  socialLinks: SocialLink[];
  featured?: boolean;
  slug?: string;
}

export interface TeamSectionProps {
  members: TeamMember[];
  className?: string;
}

// This type can be used to create a mapping of team member roles to their display names
export type TeamRole = 
  | 'Managing Partner'
  | 'Vertical Partner'
  | 'Trustee'
  | 'Advisory Board'
  | 'Founding Principal'
  | 'Active Fellow'
  | 'Philanthropy';

export const TEAM_ROLES: Record<TeamRole, string> = {
  'Managing Partner': 'Managing Partners',
  'Vertical Partner': 'Vertical Partners',
  'Trustee': 'Trustees',
  'Advisory Board': 'Advisory Board',
  'Founding Principal': 'Founding Team',
  'Active Fellow': 'Active Fellows',
  'Philanthropy': 'Philanthropy Team'
} as const;
