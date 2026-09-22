import {
  FiHome,
  FiFolder,
  FiAward,
  FiCode,
  FiBookOpen,
  FiImage,
  FiMail,
  FiFileText,
  FiBriefcase,
  FiShoppingBag,
} from 'react-icons/fi'

// All navigation items supported across the portfolio
export const navItems = [
  { id: 'home', label: 'Home', icon: FiHome, color: 'var(--hue-home)' },
  { id: 'projects', label: 'Projects', icon: FiFolder, color: 'var(--hue-projects)' },
  { id: 'techstacks', label: 'Tech Stacks', icon: FiCode, color: 'var(--hue-stack)' },
  { id: 'certification', label: 'Certification', icon: FiAward, color: 'var(--hue-cert)' },
  { id: 'education', label: 'Education', icon: FiBookOpen, color: 'var(--hue-education)' },
  { id: 'resources', label: 'Resources', icon: FiBookOpen, color: 'var(--hue-education)', standalone: true },
  { id: 'cv', label: 'my CV', icon: FiFileText, color: 'var(--hue-about)', standalone: true },
  { id: 'gallery', label: 'Gallery', icon: FiImage, color: 'var(--hue-gallery)', standalone: true },
  { id: 'freelance', label: 'Freelancing', icon: FiBriefcase, color: 'var(--hue-contact)', standalone: true },
  { id: 'contact', label: 'Contact', icon: FiMail, color: 'var(--hue-contact)', standalone: true },
  { id: 'shop', label: 'Shop', icon: FiShoppingBag, color: 'var(--hue-projects)', standalone: true },
]

// The continuous main scroll sections (visitors only see these when scrolling the main page)
export const mainScrollSections = ['home', 'projects', 'techstacks', 'certification', 'education']

// Standalone sections accessible only when explicitly clicked via navlinks
export const standaloneSections = ['resources', 'cv', 'gallery', 'freelance', 'contact', 'shop']

// Top navbar links (Desktop & Mobile Drawer)
export const headerNavItems = [
  { id: 'home', label: 'Home', icon: FiHome, color: 'var(--hue-home)' },
  { id: 'projects', label: 'Projects', icon: FiFolder, color: 'var(--hue-projects)' },
  { id: 'education', label: 'Education', icon: FiBookOpen, color: 'var(--hue-education)' },
  { id: 'freelance', label: 'Freelancing', icon: FiBriefcase, color: 'var(--hue-contact)' },
  { id: 'cv', label: 'my CV', icon: FiFileText, color: 'var(--hue-about)' },
  { id: 'gallery', label: 'Gallery', icon: FiImage, color: 'var(--hue-gallery)' },
]
