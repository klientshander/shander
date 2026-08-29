import {
  FiUser,
  FiFolder,
  FiAward,
  FiCode,
  FiBookOpen,
  FiImage,
  FiMail,
} from 'react-icons/fi'

// No separate "home" page — About doubles as the landing section, matching
// the reference layout: About is CH.00 / index 00.
export const navItems = [
  { id: 'about', label: 'About', icon: FiUser, color: 'var(--hue-about)' },
  { id: 'projects', label: 'Projects', icon: FiFolder, color: 'var(--hue-projects)' },
  { id: 'certification', label: 'Certification', icon: FiAward, color: 'var(--hue-cert)' },
  { id: 'techstacks', label: 'Techstacks', icon: FiCode, color: 'var(--hue-stack)' },
  { id: 'education', label: 'Education', icon: FiBookOpen, color: 'var(--hue-education)' },
  { id: 'gallery', label: 'Gallery', icon: FiImage, color: 'var(--hue-gallery)' },
  { id: 'contact', label: 'Contact me', icon: FiMail, color: 'var(--hue-contact)' },
]
