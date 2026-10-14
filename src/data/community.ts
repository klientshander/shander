export interface CommunityHub {
  id: string
  title: string
  platform: string
  description: string
  url: string
  badge: string
  members: string
  category: 'social' | 'code' | 'collab'
}

export const communityIntro = {
  title: 'Community & Conversation',
  tagline: 'Open spaces, live visitor discussions, and developer connections.',
  description:
    'A public digital commons for tech enthusiasts, students, and collaborators. Leave a message on the live visitor board, chat with other visitors, explore developer channels, or reach out to build something together.',
}

export const communityHubs: CommunityHub[] = [
  {
    id: 'github',
    title: 'GitHub Discussions & Collabs',
    platform: 'GitHub',
    description: 'Explore open-source repositories, request features, report issues, and star school/side projects.',
    url: 'https://github.com/klientshander',
    badge: 'Open Source',
    members: 'Public Repos & Collabs',
    category: 'code',
  },
  {
    id: 'x',
    title: 'Tech Circle & Web Dev Feed',
    platform: 'X / Twitter',
    description: 'Daily dev thoughts, PHP/Laravel tips, React component experiments, and tech updates.',
    url: 'https://x.com/klientshan600',
    badge: 'Microblog',
    members: 'Active Circle',
    category: 'social',
  },
  {
    id: 'linkedin',
    title: 'Professional Network & Students',
    platform: 'LinkedIn',
    description: 'Connect for internship opportunities, freelance consultations, academic collaborations, and industry networking.',
    url: 'https://www.linkedin.com/in/klientshander-santillan-78a3653a4/',
    badge: 'Network',
    members: '500+ Connections',
    category: 'collab',
  },
  {
    id: 'messenger',
    title: 'Direct Dev & Project Inquiries',
    platform: 'Messenger / Chat',
    description: 'Fast direct messaging for project brainstorms, capstone guidance, and quick coding questions.',
    url: 'https://www.facebook.com/',
    badge: 'Direct Chat',
    members: 'Fast Response',
    category: 'collab',
  },
]

export const defaultVisitorAvatars = [
  { id: 'boy', label: 'Boy', src: '/avatars/boy.svg' },
  { id: 'girl', label: 'Girl', src: '/avatars/girl.svg' },
  { id: 'boy-2', label: 'Boy 2', src: '/avatars/boy-2.svg' },
  { id: 'girl-2', label: 'Girl 2', src: '/avatars/girl-2.svg' },
]

export const communityGuidelines = [
  'Be respectful and supportive to fellow builders and students.',
  'Share constructive thoughts, feedback, and technical questions.',
  'No spam, solicitations, or inappropriate content.',
]

