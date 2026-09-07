import {
  FiHome,
  FiFolder,
  FiAward,
  FiCode,
  FiBookOpen,
  FiImage,
  FiMail,
} from 'react-icons/fi'

// All sections that are rendered on the page in sequence
export const navItems = [
  { id: 'home', label: 'Home', icon: FiHome, color: 'var(--hue-home)' },
  { id: 'projects', label: 'Projects', icon: FiFolder, color: 'var(--hue-projects)' },
  { id: 'techstacks', label: 'Techstacks', icon: FiCode, color: 'var(--hue-stack)' },
  { id: 'certification', label: 'Certification', icon: FiAward, color: 'var(--hue-cert)' },
  { id: 'education', label: 'Education', icon: FiBookOpen, color: 'var(--hue-education)' },
  { id: 'gallery', label: 'Gallery', icon: FiImage, color: 'var(--hue-gallery)' },
  { id: 'contact', label: 'Contact', icon: FiMail, color: 'var(--hue-contact)' },
]

// Specifically the nav links displayed in the top navbar: Home, Education, Certification, Contact
export const headerNavItems = [
  { id: 'home', label: 'Home', icon: FiHome, color: 'var(--hue-home)' },
  { id: 'education', label: 'Education', icon: FiBookOpen, color: 'var(--hue-education)' },
  { id: 'certification', label: 'Certification', icon: FiAward, color: 'var(--hue-cert)' },
  { id: 'contact', label: 'Contact', icon: FiMail, color: 'var(--hue-contact)' },
]



