// `level` is a self-rated familiarity out of 100 — purely illustrative for
// the skill bars & radar chart. Adjust these to reflect your own comfort
// with each tool.
export const techGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'HTML', icon: 'html5', level: 92 },
      { name: 'CSS', icon: 'css3', level: 90 },
      { name: 'JavaScript', icon: 'javascript', level: 88 },
      { name: 'TypeScript', icon: 'typescript', level: 70 },
      { name: 'React', icon: 'react', level: 78 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'PHP', icon: 'php', level: 90 },
      { name: 'Laravel', icon: 'laravel', level: 72 },
      { name: 'Python', icon: 'python', level: 55 },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    items: [{ name: 'MySQL', icon: 'mysql', level: 90 }],
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    items: [
      { name: 'TensorFlow', icon: 'tensorflow', level: 40 },
      { name: 'scikit-learn', icon: 'scikitlearn', level: 60 },
      { name: 'Pandas', icon: 'pandas', level: 65 },
    ],
  },
  {
    id: 'design',
    label: 'Design & Tools',
    items: [
      { name: 'Figma', icon: 'figma', level: 65 },
      { name: 'Canva', icon: 'canva', level: 85 },
      { name: 'CapCut', icon: 'video', level: 80 },
      { name: 'Git', icon: 'git', level: 68 },
    ],
  },
]

// Aggregate per-group average, used by the radar chart.
export const radarCategories = techGroups.map((group) => ({
  label: group.label,
  value: Math.round(group.items.reduce((sum, item) => sum + item.level, 0) / group.items.length) / 100,
}))
