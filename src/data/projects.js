// `cover` paths follow the /public/gallery/background/<name>.png convention —
// drop your screenshots in there with matching filenames and they'll appear
// automatically. Leave `cover` empty and a generated placeholder is used
// instead. `videoUrl` accepts a YouTube link or a direct .mp4/.webm file.
export const projects = [
  {
    id: 'proj-1',
    title: 'Personalspace',
    description:
      'A single-user personal workspace no admin account can view, reset, or reuse your login. Built for privacy-first personal productivity.',
    tags: ['PHP', 'MySQL', 'HTML', 'CSS'],
    category: 'System',
    liveUrl: 'https://personalspace.free.nf/index.php?page=login',
    codeUrl: '#',
    icon: 'lock',
    cover: '/gallery/background/personal-space.png',
    metrics: [
      { label: 'Backend', value: 'PHP' },
      { label: 'Database', value: 'MySQL' },
    ],
    progress: 95,
    videoUrl: '',
  },
  {
    id: 'proj-2',
    title: 'Mini Hospital Management System',
    description:
      'A full-featured hospital management system with patient records, appointment scheduling, and analytics React frontend, Laravel API backend, MySQL for data integrity.',
    tags: ['React', 'Laravel', 'MySQL'],
    category: 'System',
    liveUrl: '#',
    codeUrl: '#',
    icon: 'activity',
    cover: '/gallery/background/Hospital.png',
    metrics: [
      { label: 'Backend', value: 'Laravel' },
      { label: 'Frontend', value: 'React' },
    ],
    progress: 80,
    videoUrl: '',
  },
  {
    id: 'proj-3',
    title: 'Grahams Store',
    description:
      'A modern online dessert store showcasing Graham-based treats, with a warm palette, product catalog, and inviting bakery-style atmosphere.',
    tags: ['PHP', 'HTML', 'CSS'],
    category: 'Brand',
    liveUrl: '#',
    codeUrl: '#',
    icon: 'shopping',
    cover: '/gallery/background/Grahams.png',
    metrics: [
      { label: 'Type', value: 'Store' },
      { label: 'Backend', value: 'PHP' },
    ],
    progress: 100,
    videoUrl: '',
  },
  {
    id: 'proj-4',
    title: 'Brand New Day Spider-Man',
    description:
      'A brand identity project wordmarks, color systems, and visual languages built to be instantly recognizable, with a Spider-Man themed redesign.',
    tags: ['React', 'Brand Identity'],
    category: 'Brand',
    liveUrl: '#',
    codeUrl: '#',
    icon: 'brand',
    cover: '/gallery/background/Brandnewday.png',
    metrics: [
      { label: 'Type', value: 'Brand' },
      { label: 'Framework', value: 'React' },
    ],
    progress: 100,
    videoUrl: '',
  },
  {
    id: 'proj-5',
    title: 'Creative Video Editing',
    description:
      'A video-editing portfolio piece focused on clean cuts, cinematic pacing, transitions, typography, and short-form visual storytelling.',
    tags: ['CapCut', 'Motion', 'Video Editing'],
    category: 'Video Editing',
    liveUrl: '#',
    codeUrl: '#',
    icon: 'video',
    cover: '',
    videoUrl: '/gallery/Zenitsu.mp4',
    metrics: [
      { label: 'Editing', value: 'CapCut' },
      { label: 'Feature', value: 'Zenitsu AMV' },
    ],
    progress: 100,
  },
  {
    id: 'proj-6',
    title: 'Picture and Graphic design',
    description:
      'A visual design collection featuring poster layouts, social graphics, photo composition, typography, and polished promotional artwork.',
    tags: ['Figma', 'Graphic Design', 'Photoshop'],
    category: 'Picture/Design',
    liveUrl: '#',
    codeUrl: '#',
    icon: 'design',
    cover: '/gallery/my-gallery/lj-libunao.jpg',
    metrics: [
      { label: 'Design', value: 'Figma' },
      { label: 'Output', value: 'Graphics' },
    ],
    progress: 100,
    videoUrl: '',
  },
  {
    id: 'proj-7',
    title: 'Mini Student Management System',
    description:
      'A web-based application for schools and teachers to manage student records add, view, update, search, and delete from one centralized platform.',
    tags: ['PHP', 'MySQL', 'HTML', 'CSS'],
    category: 'System',
    liveUrl: 'https://studentscarmel.infinityfreeapp.com/index.php?page=login',
    codeUrl: '#',
    icon: 'users',
    cover: '/gallery/background/Student.png',
    metrics: [
      { label: 'Backend', value: 'PHP' },
      { label: 'Database', value: 'MySQL' },
    ],
    progress: 100,
    videoUrl: '',
  },
]

export const projectCategories = [...new Set(projects.map((p) => p.category))]
