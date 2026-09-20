// Freelance services & offerings for Shander Santillan
export const freelanceIntro = {
  title: 'freelance',
  subtitle:
    'Available for select freelance work web development, video editing, and photo editing.',
}

export const freelanceOfferings = [
  {
    id: 'web-development',
    index: '01',
    number: '1',
    title: 'Web Development',
    status: 'Client Project Completed',
    projectTitle: 'LJ Libunao Artist Portfolio Website',
    description:
      'Designed and built a full portfolio website for LJ Kevin Libunao, a freelance violinist from initial concept through final deployment. Delivered a complete redesign covering hero, achievements, gallery, services, testimonials, and contact sections.',
    tags: ['React', 'Vite', 'Tailwind CSS'],
    actionLabel: 'Inquire Web Development',
    subject: 'Freelance Inquiry: Web Development (LJ Libunao Reference)',
  },
  {
    id: 'video-editing',
    index: '02',
    number: '2',
    title: 'Video Editing',
    description:
      'Edit both short-form content (reels, promos, social clips) and longer-form video (vlogs, event coverage) pacing, cuts, color, and sound design tailored to the platform and purpose.',
    actionLabel: 'Inquire Video Editing',
    subject: 'Freelance Inquiry: Video Editing',
  },
  {
    id: 'portfolio-design',
    index: '03',
    number: '3',
    title: 'Portfolio Design & Development',
    description:
      'Help fellow students design and build their own portfolio websites from layout and content structure to a working, deployed site so classmates without a dev background can still showcase their work professionally.',
    actionLabel: 'Inquire Portfolio Design',
    subject: 'Freelance Inquiry: Portfolio Design & Development',
  },
]

// Backwards-compatible alias
export const freelanceServices = freelanceOfferings
