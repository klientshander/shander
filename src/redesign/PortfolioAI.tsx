import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  FiX,
  FiSend,
  FiTrash2,
  FiArrowUpRight,
  FiMinimize2,
  FiMaximize2,
  FiCode,
  FiUser,
  FiAward,
  FiBriefcase,
  FiLayers,
  FiMail,
  FiChevronRight,
  FiCheckCircle,
} from 'react-icons/fi'
import { profile, socials } from '../data/profile'
import { projects } from '../data/projects'
import { techGroups } from '../data/techstacks'
import { education, academicProgress } from '../data/education'
import { certifications } from '../data/certifications'
import { freelanceOfferings } from '../data/freelance'
import { playClickSound } from '../utils/sound'

export interface AIAction {
  label: string
  type: 'project' | 'section' | 'standalone' | 'external' | 'chess'
  target: string
}

export interface AIProjectPreview {
  id: string
  title: string
  appTitle?: string
  category: string
  description: string
  cover?: string
  tags: string[]
}

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
  timestamp: string
  actions?: AIAction[]
  projectPreview?: AIProjectPreview
  highlights?: { label: string; value: string }[]
}

const QUICK_TOPICS = [
  {
    id: 'topic-projects',
    icon: <FiLayers />,
    title: 'Featured Projects',
    subtitle: 'Personalspace, Grahams & more',
    prompt: 'What are his top projects?',
  },
  {
    id: 'topic-stack',
    icon: <FiCode />,
    title: 'Tech Stack & Skills',
    subtitle: 'PHP, Laravel, React, MySQL',
    prompt: 'What is his tech stack?',
  },
  {
    id: 'topic-story',
    icon: <FiUser />,
    title: 'About & Education',
    subtitle: "BSIS & Dean's Lister journey",
    prompt: 'Who is Shander Santillan?',
  },
  {
    id: 'topic-hire',
    icon: <FiBriefcase />,
    title: 'Freelance & Contact',
    subtitle: 'Services, rates & availability',
    prompt: 'Is he open for freelance or hire?',
  },
]

const SUGGESTED_QUESTIONS = [
  'Tell me about Personalspace',
  'Tell me about Grahams Store',
  'What is his tech stack?',
  'Education & achievements?',
  'Tell me about Pixel Playlist',
  'Mini Hospital Management System',
  'How can I contact him?',
  'Does he play chess?',
]

const SYSTEM_CONTEXT = `
You are "Shander AI", the official interactive portfolio assistant for Klient Shander Santillan (also known as Shander Santillan).
Answer questions concisely, warmly, and accurately based on his portfolio data:

PROFILE:
- Name: Klient Shander Santillan (${profile.name})
- Role: ${profile.role} & UI Designer
- Location: ${profile.location}
- Tagline: ${profile.tagline}
- Availability: ${profile.availability.note} (${profile.statusNote})
- Story: Started coding in Senior High School (HUMSS strand at Escalante National High School, graduated With Honors) out of curiosity about how web apps work under the hood, self-learning PHP and MySQL. Currently a 2nd-year BS Information Systems student at Mount Carmel College of Escalante City Inc. (MCCEI), where he became a 1st Year Dean's Lister.
- Hobbies: Playing chess (strategy & pattern recognition), video editing (CapCut, short-form reels & AMVs), graphic design & UI experimentation.

TECH STACK & SKILLS:
${techGroups.map((g) => `- ${g.label}: ${g.items.map((i) => `${i.name} (${i.level}%)`).join(', ')}`).join('\n')}

PROJECTS (${projects.length} total):
${projects
  .map(
    (p, i) =>
      `${i + 1}. ${p.title} (${p.appTitle}) [${p.category}]: ${p.description} | Tags: ${p.tags.join(', ')} | Live: ${p.liveUrl}`
  )
  .join('\n')}

EDUCATION:
${education.map((e) => `- ${e.school}: ${e.degree} (${e.period}) — Badge: ${e.badge}. ${e.description}`).join('\n')}
- Academic Progress: ${academicProgress.subtitle} (${academicProgress.percent}% complete)

CERTIFICATIONS & ACHIEVEMENTS:
${certifications.map((c) => `- ${c.title} (${c.issuer}, ${c.date}): ${c.description}`).join('\n')}

FREELANCE SERVICES:
${freelanceOfferings.map((f) => `- ${f.title}: ${f.description}`).join('\n')}

CONTACT & SOCIALS:
- Email: ${socials.email}
- Phone: ${socials.phone}
- GitHub: ${socials.github}
- LinkedIn: ${socials.linkedin}
- X (Twitter): ${socials.x}
- Resume: Available to view and download in the Resume section (${profile.resumeUrl}).
`.trim()

function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Antenna */}
      <path
        d="M12 3V6M9.5 3H14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Bot Head Visor Shell */}
      <rect
        x="4"
        y="6"
        width="16"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Side Ear Nodes */}
      <path
        d="M2 10.5V14.5M22 10.5V14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Digital Eyes */}
      <circle cx="9" cy="11.5" r="1.4" fill="currentColor" />
      <circle cx="15" cy="11.5" r="1.4" fill="currentColor" />
      {/* Smile / Audio Wave Line */}
      <path
        d="M9.5 15.5H14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function buildLocalResponse(query: string): {
  text: string
  actions?: AIAction[]
  projectPreview?: AIProjectPreview
  highlights?: { label: string; value: string }[]
} {
  const q = query.toLowerCase().trim()

  // 1. Check for specific project matches first
  for (const proj of projects) {
    const titleLower = proj.title.toLowerCase()
    const appTitleLower = (proj.appTitle || '').toLowerCase()
    const keywords = [
      titleLower,
      appTitleLower,
      proj.id.toLowerCase(),
      ...(titleLower.includes('personalspace') ? ['personal space', 'personalhub', 'vault'] : []),
      ...(titleLower.includes('grahams') ? ['graham', 'dessert', 'grahamstore'] : []),
      ...(titleLower.includes('pixel playlist') ? ['pixel', 'adventure time', 'island song', 'music player'] : []),
      ...(titleLower.includes('hospital') ? ['hospital', 'clinic', 'cliniccare', 'erp'] : []),
      ...(titleLower.includes('student') ? ['student management', 'carmel portal', 'student portal'] : []),
      ...(titleLower.includes('lj libunao') ? ['lj', 'libunao', 'violin', 'violinist'] : []),
      ...(titleLower.includes('spider-man') ? ['spiderman', 'spider-man', 'brand new day'] : []),
      ...(titleLower.includes('video editing') ? ['zenitsu', 'amv'] : []),
    ]

    if (keywords.some((kw) => kw.length > 2 && q.includes(kw))) {
      const actions: AIAction[] = [
        { label: `Open ${proj.title}`, type: 'project', target: proj.id },
      ]
      if (proj.liveUrl && proj.liveUrl !== '#') {
        actions.push({ label: 'Live Preview', type: 'external', target: proj.liveUrl })
      }
      const coverImg =
        proj.cover && !proj.cover.endsWith('.mp4')
          ? proj.cover
          : proj.images?.[0] || '/gallery/background/personalhub/personalhub-dashboard-white.png'

      return {
        text: `**${proj.title}** (${proj.appTitle || proj.category})\n\n${proj.description}${proj.versionNotice ? `\n\n_${proj.versionNotice}_` : ''}`,
        projectPreview: {
          id: proj.id,
          title: proj.title,
          appTitle: proj.appTitle,
          category: proj.category,
          description: proj.description,
          cover: coverImg,
          tags: proj.tags,
        },
        highlights: proj.metrics?.slice(0, 3),
        actions,
      }
    }
  }

  // 2. Greetings
  if (/^(hi|hello|hey|yo|good morning|good afternoon|good evening|sup|greetings)\b/.test(q)) {
    return {
      text: `Hello! 👋 I'm **Shander AI**, Klient Shander Santillan's interactive portfolio assistant.\n\nI can walk you through his **projects**, **PHP/Laravel & React stack**, **academic achievements**, or **freelance availability**. What would you like to know?`,
      actions: [
        { label: 'Explore Projects', type: 'section', target: 'work' },
        { label: 'Full Story (About Me)', type: 'standalone', target: 'about-me' },
      ],
    }
  }

  // 3. Who is Shander / About / Bio / Story
  if (
    q.includes('who is') ||
    q.includes('about shander') ||
    q.includes('about him') ||
    q.includes('tell me about you') ||
    q.includes('background') ||
    q.includes('story') ||
    q.includes('introduce') ||
    q.includes('who are you')
  ) {
    return {
      text: `**Klient Shander Santillan** is a **Web Developer & UI Designer** based in **${profile.location}**.\n\n• **Academic:** 2nd-year **BS Information Systems** student at Mount Carmel College of Escalante City Inc. (MCCEI) and a **1st Year Dean's Lister**.\n• **Origin Story:** Started teaching himself PHP & MySQL late at night during Senior High School (HUMSS strand, graduated **With Honors**).\n• **Core Stack:** PHP, Laravel, React, TypeScript, MySQL, and Tailwind CSS.\n• **Creative Toolkit:** Video editing (CapCut) and UI/graphic design (Figma, Canva).`,
      highlights: [
        { label: 'Standing', value: "Dean's Lister" },
        { label: 'Degree', value: 'BS Info Systems' },
        { label: 'Status', value: 'Open to Work' },
      ],
      actions: [
        { label: 'Read Full About Page', type: 'standalone', target: 'about-me' },
        { label: 'View Projects', type: 'section', target: 'work' },
        { label: 'View Resume', type: 'section', target: 'resume' },
      ],
    }
  }

  // 4. Projects overview
  if (
    q.includes('project') ||
    q.includes('built') ||
    q.includes('portfolio work') ||
    q.includes('best work') ||
    q.includes('top work') ||
    q.includes('apps') ||
    q.includes('what did he make') ||
    q.includes('what has he made')
  ) {
    const topProj = projects[0]
    return {
      text: `Shander has engineered **${projects.length} projects** across full-stack systems, e-commerce, client branding, and interactive media:\n\n• **Personalspace** — Privacy-first personal workspace in PHP, MySQL & Shadcn (v2 Overhaul).\n• **Grahams Store** — Modern online dessert shop in React & Next.js.\n• **Pixel Playlist — Adventure Time** — 8-bit retro audio visualizer & pixel lyrics experience.\n• **Mini Hospital Management System** — Clinical ERP with React, Laravel API & MySQL.\n• **Mini Student Management System** — Centralized school portal in PHP & MySQL.\n• **LJ Libunao Website** — Completed client portfolio for a freelance violinist.`,
      projectPreview: {
        id: topProj.id,
        title: topProj.title,
        appTitle: topProj.appTitle,
        category: topProj.category,
        description: topProj.description,
        cover: topProj.cover,
        tags: topProj.tags,
      },
      actions: [
        { label: 'Open Personalspace', type: 'project', target: 'proj-1' },
        { label: 'Open Grahams Store', type: 'project', target: 'proj-3' },
        { label: 'Browse All Projects', type: 'section', target: 'work' },
      ],
    }
  }

  // 5. Skills / Tech Stack / Languages / Tools
  if (
    q.includes('skill') ||
    q.includes('tech') ||
    q.includes('stack') ||
    q.includes('language') ||
    q.includes('framework') ||
    q.includes('tool') ||
    q.includes('php') ||
    q.includes('laravel') ||
    q.includes('react') ||
    q.includes('mysql') ||
    q.includes('database') ||
    q.includes('frontend') ||
    q.includes('backend') ||
    q.includes('machine learning') ||
    q.includes('python')
  ) {
    const summary = techGroups
      .map((g) => `• **${g.label}:** ${g.items.map((i) => i.name).join(' · ')}`)
      .join('\n')

    return {
      text: `Here is Shander's **Tech Stack & Engineering Toolkit**:\n\n${summary}\n\nHis strongest production stack is **PHP, Laravel, React, JavaScript/TypeScript, and MySQL**, paired with **Figma & CapCut** for UI and motion work.`,
      highlights: [
        { label: 'Frontend', value: 'React · TS · HTML/CSS' },
        { label: 'Backend', value: 'PHP · Laravel · Node' },
        { label: 'Database', value: 'MySQL · PostgreSQL' },
      ],
      actions: [
        { label: 'Go to Skills Section', type: 'section', target: 'skills' },
        { label: 'See Projects', type: 'section', target: 'work' },
      ],
    }
  }

  // 6. Education / School / College / Degree / Dean's Lister
  if (
    q.includes('educat') ||
    q.includes('school') ||
    q.includes('college') ||
    q.includes('university') ||
    q.includes('study') ||
    q.includes('student') ||
    q.includes('degree') ||
    q.includes('course') ||
    q.includes('mccei') ||
    q.includes('mount carmel') ||
    q.includes('escalante') ||
    q.includes('dean') ||
    q.includes('honor')
  ) {
    return {
      text: `**Education & Academic Standing:**\n\n• **Mount Carmel College of Escalante City Inc. (MCCEI)**\n  — *BS in Information Systems* (2nd Year, 2024 – Present)\n  — Honored as a **1st Year Dean's Lister**\n  — **${academicProgress.percent}%** through the 4-year BSIS curriculum\n\n• **Escalante National High School**\n  — *Senior High School — HUMSS Strand (2023 – 2024)*\n  — Graduated **With Honors**`,
      highlights: [
        { label: 'Institution', value: 'MCCEI' },
        { label: 'Honor', value: "Dean's Lister" },
        { label: 'Progress', value: `${academicProgress.percent}% (Year 2)` },
      ],
      actions: [
        { label: 'View Education Section', type: 'section', target: 'education' },
        { label: 'View Certifications', type: 'section', target: 'certifications' },
      ],
    }
  }

  // 7. Certifications & Achievements
  if (
    q.includes('certific') ||
    q.includes('award') ||
    q.includes('achiev') ||
    q.includes('recognition') ||
    q.includes('medal')
  ) {
    const certList = certifications
      .map((c) => `• **${c.title}** — *${c.issuer}* (${c.date}): ${c.description}`)
      .join('\n')
    return {
      text: `**Certifications & Academic Recognitions:**\n\n${certList}`,
      actions: [{ label: 'View Certifications Section', type: 'section', target: 'certifications' }],
    }
  }

  // 8. Freelance / Hire / Services / Rates / Availability
  if (
    q.includes('freelanc') ||
    q.includes('hire') ||
    q.includes('hiring') ||
    q.includes('service') ||
    q.includes('available') ||
    q.includes('availability') ||
    q.includes('commission') ||
    q.includes('work with') ||
    q.includes('job') ||
    q.includes('internship') ||
    q.includes('offer')
  ) {
    const servicesList = freelanceOfferings
      .map((s) => `• **${s.title}:** ${s.description}`)
      .join('\n')
    return {
      text: `**Yes! Shander is ${profile.availability.note.toLowerCase()}** (${profile.statusNote}) and takes on select freelance work:\n\n${servicesList}`,
      highlights: [
        { label: 'Status', value: 'Available Now' },
        { label: 'Recent Client', value: 'LJ Libunao Site' },
        { label: 'Focus', value: 'Web & Video' },
      ],
      actions: [
        { label: 'Open Freelance Page', type: 'standalone', target: 'freelance' },
        { label: 'Contact Section', type: 'section', target: 'contact' },
        { label: 'Send Email Inquiry', type: 'external', target: `mailto:${socials.email}?subject=Project%20Inquiry` },
      ],
    }
  }

  // 9. Contact / Email / Phone / Socials / Location
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('mail') ||
    q.includes('phone') ||
    q.includes('number') ||
    q.includes('reach') ||
    q.includes('github') ||
    q.includes('linkedin') ||
    q.includes('social') ||
    q.includes('location') ||
    q.includes('where is he') ||
    q.includes('based')
  ) {
    return {
      text: `You can reach **Shander Santillan** directly anytime:\n\n• **Email:** ${socials.email}\n• **Phone:** ${socials.phone}\n• **Location:** ${profile.location}\n• **GitHub:** github.com/klientshander\n• **LinkedIn:** Klient Shander Santillan`,
      highlights: [
        { label: 'Location', value: 'Negros Occidental, PH' },
        { label: 'Response', value: 'Fast & Direct' },
      ],
      actions: [
        { label: 'Go to Contact Section', type: 'section', target: 'contact' },
        { label: 'Send Email', type: 'external', target: `mailto:${socials.email}` },
        { label: 'GitHub Profile', type: 'external', target: socials.github },
      ],
    }
  }

  // 10. Resume / CV
  if (q.includes('resume') || q.includes('cv') || q.includes('curriculum vitae') || q.includes('download')) {
    return {
      text: `Shander's **Resume / CV** is ready to view or download! You can inspect his full academic standing, technical stack, and project history in the **Resume** section.`,
      actions: [
        { label: 'Go to Resume Section', type: 'section', target: 'resume' },
        { label: 'Download Resume (.docx)', type: 'external', target: profile.resumeUrl },
      ],
    }
  }

  // 11. Chess / Hobbies / Fun
  if (q.includes('chess') || q.includes('hobby') || q.includes('hobbies') || q.includes('fun') || q.includes('game')) {
    return {
      text: `Beyond coding, Shander is passionate about:\n\n• ♟️ **Chess & Strategy:** Sharpening tactical pattern recognition — you can challenge the interactive chess board right here on the site!\n• 🎬 **Video Editing:** Crafting short-form reels, cinematic cuts, and AMVs.\n• 🎨 **Visual Design:** Experimenting with 3D assets, typography, and brand systems.`,
      actions: [
        { label: 'Play Chess Now ♟️', type: 'chess', target: 'chess' },
        { label: 'More in About Me', type: 'standalone', target: 'about-me' },
      ],
    }
  }

  // 12. Community / Blog / Shop / Resources
  if (q.includes('community') || q.includes('guestbook') || q.includes('blog') || q.includes('shop') || q.includes('resource')) {
    return {
      text: `Explore the portfolio's standalone hubs:\n\n• **Community Board:** Sign the live visitor guestbook.\n• **Blog:** Read Shander's technical notes and thoughts.\n• **Resources:** Curated developer tools and references.\n• **Shop:** Digital templates and starter kits.`,
      actions: [
        { label: 'Community Board', type: 'standalone', target: 'community' },
        { label: 'Read Blog', type: 'standalone', target: 'blog' },
        { label: 'Developer Resources', type: 'standalone', target: 'resources' },
      ],
    }
  }

  // Default comprehensive fallback
  return {
    text: `Here is an overview of **Shander Santillan's Portfolio**:\n\n• **Role:** Web Developer & 2nd-year BS Information Systems Student at MCCEI (1st Year Dean's Lister).\n• **Core Stack:** PHP, Laravel, React, TypeScript, MySQL, Node.js, Tailwind CSS.\n• **Top Projects:** *Personalspace*, *Grahams Store*, *Pixel Playlist — Adventure Time*, *Mini Hospital Management System*, and *LJ Libunao Website*.\n• **Direct Contact:** ${socials.email} | ${socials.phone}`,
    highlights: [
      { label: 'Projects', value: `${projects.length} Showcased` },
      { label: 'Standing', value: "Dean's Lister" },
      { label: 'Status', value: 'Open to Work' },
    ],
    actions: [
      { label: 'View Projects', type: 'section', target: 'work' },
      { label: 'View Tech Stack', type: 'section', target: 'skills' },
      { label: 'Contact Shander', type: 'section', target: 'contact' },
    ],
  }
}

async function queryGeminiIfAvailable(
  userQuestion: string,
  history: ChatMessage[]
): Promise<string | null> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_CONTEXT}\n\nKeep answers concise (under 140 words), friendly, and well-structured with bullet points where helpful.` }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood! I will answer questions about Klient Shander Santillan accurately and concisely.' }],
      },
      ...history.slice(-6).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      {
        role: 'user',
        parts: [{ text: userQuestion }],
      },
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    )

    if (!res.ok) return null
    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
    return typeof reply === 'string' && reply.trim() ? reply.trim() : null
  } catch {
    return null
  }
}

function renderFormattedText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim()
    if (!trimmed) {
      return <div key={lineIdx} className="rd-ai-msg__spacer" />
    }

    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)
    const cleanLine = isBullet ? trimmed.replace(/^(•|-)\s*/, '') : line

    const parts = cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g)
    const content = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return <React.Fragment key={i}>{part}</React.Fragment>
    })

    if (isBullet && (trimmed.startsWith('•') || trimmed.startsWith('- '))) {
      return (
        <div key={lineIdx} className="rd-ai-msg__bullet">
          <span className="rd-ai-msg__bullet-dot" aria-hidden="true">
            →
          </span>
          <span>{content}</span>
        </div>
      )
    }

    return (
      <p key={lineIdx} className="rd-ai-msg__line">
        {content}
      </p>
    )
  })
}

export interface PortfolioAIProps {
  onSelectProject: (project: any) => void
  onNavigateMain: (sectionId: string) => void
  onNavigateStandalone: (standaloneId: string) => void
  onOpenChess: () => void
}

export default function PortfolioAI({
  onSelectProject,
  onNavigateMain,
  onNavigateStandalone,
  onOpenChess,
}: PortfolioAIProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Hi! I'm **Shander AI** — trained on **Klient Shander Santillan's** projects, engineering stack, academic milestones, and services.\n\nPick a topic above or ask me anything below!`,
      timestamp: 'Ready',
      actions: [
        { label: 'Explore Projects', type: 'section', target: 'work' },
        { label: 'Read Full Bio', type: 'standalone', target: 'about-me' },
        { label: 'Contact Shander', type: 'section', target: 'contact' },
      ],
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, messages, isTyping])

  // Global keyboard shortcut: Ctrl+K / Cmd+K to toggle AI Assistant, Escape to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        playClickSound()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const handleActionClick = (action: AIAction) => {
    playClickSound()
    if (action.type === 'project') {
      const found = projects.find((p) => p.id === action.target)
      if (found) {
        onSelectProject(found)
        if (window.innerWidth < 640) setIsOpen(false)
      }
    } else if (action.type === 'section') {
      onNavigateMain(action.target)
      if (window.innerWidth < 640) setIsOpen(false)
    } else if (action.type === 'standalone') {
      onNavigateStandalone(action.target)
      if (window.innerWidth < 640) setIsOpen(false)
    } else if (action.type === 'chess') {
      onOpenChess()
      setIsOpen(false)
    } else if (action.type === 'external') {
      window.open(action.target, '_blank', 'noopener,noreferrer')
    }
  }

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim()
    if (!trimmed || isTyping) return

    playClickSound()
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: nowStr,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const localMatch = buildLocalResponse(trimmed)
    const geminiText = await queryGeminiIfAvailable(trimmed, messages)

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: geminiText || localMatch.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: localMatch.actions,
        projectPreview: localMatch.projectPreview,
        highlights: localMatch.highlights,
      }
      setMessages((prev) => [...prev, replyMsg])
      setIsTyping(false)
    }, geminiText ? 150 : 420)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendQuestion(input)
  }

  const handleClear = () => {
    playClickSound()
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Conversation reset! Select a topic card above or ask me anything about **Shander's projects, tech stack, education, or freelance services**.`,
        timestamp: 'Ready',
        actions: [
          { label: 'Explore Projects', type: 'section', target: 'work' },
          { label: 'About Shander', type: 'standalone', target: 'about-me' },
        ],
      },
    ])
  }

  return createPortal(
    <div className="rd-ai-root">
      {/* Floating Dock Trigger Button */}
      <button
        type="button"
        className={`rd-ai-fab ${isOpen ? 'is-active' : ''}`}
        onClick={() => {
          playClickSound()
          setIsOpen((prev) => !prev)
        }}
        aria-label={isOpen ? 'Close Portfolio AI Assistant' : 'Open Portfolio AI Assistant'}
        aria-expanded={isOpen}
      >
        <span className="rd-ai-fab__glow" aria-hidden="true" />
        <span className="rd-ai-fab__avatar-wrap">
          <img src={profile.avatar} alt="" className="rd-ai-fab__avatar" />
          <span className="rd-ai-fab__status" />
        </span>
        <span className="rd-ai-fab__content">
          <span className="rd-ai-fab__eyebrow">PORTFOLIO AI</span>
          <span className="rd-ai-fab__label">
            {isOpen ? 'Close Assistant' : 'Ask Shander AI'}
          </span>
        </span>
        <span className="rd-ai-fab__badge">
          {isOpen ? <FiX /> : <SparkleIcon />}
        </span>
      </button>

      {/* Interactive AI Window */}
      {isOpen && (
        <section
          className={`rd-ai-panel ${isExpanded ? 'is-expanded' : ''}`}
          role="dialog"
          aria-label="Shander AI Portfolio Assistant"
          data-lenis-prevent
        >
          {/* Ambient Top Spotlight */}
          <div className="rd-ai-panel__ambient" aria-hidden="true" />

          {/* Header */}
          <header className="rd-ai-header">
            <div className="rd-ai-header__left">
              <div className="rd-ai-avatar">
                <img src={profile.avatar} alt={profile.name} />
                <span className="rd-ai-avatar__dot" title="Online & Ready" />
              </div>
              <div className="rd-ai-header__meta">
                <div className="rd-ai-header__title-row">
                  <h3 className="rd-ai-header__title">Shander AI</h3>
                  <span className="rd-ai-header__verified" title="Verified Portfolio Knowledge">
                    <FiCheckCircle />
                  </span>
                  <span className="rd-ai-header__badge">v2.5</span>
                </div>
                <p className="rd-ai-header__sub">
                  <span className="rd-ai-header__live-dot" /> Interactive Portfolio Intelligence
                </p>
              </div>
            </div>

            <div className="rd-ai-header__actions">
              <button
                type="button"
                className="rd-ai-icon-btn"
                onClick={handleClear}
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <FiTrash2 />
              </button>
              <button
                type="button"
                className="rd-ai-icon-btn rd-ai-icon-btn--expand"
                onClick={() => {
                  playClickSound()
                  setIsExpanded((v) => !v)
                }}
                title={isExpanded ? 'Compact view' : 'Expand view'}
                aria-label={isExpanded ? 'Compact view' : 'Expand view'}
              >
                {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button
                type="button"
                className="rd-ai-icon-btn"
                onClick={() => {
                  playClickSound()
                  setIsOpen(false)
                }}
                title="Close (Esc)"
                aria-label="Close assistant"
              >
                <FiX />
              </button>
            </div>
          </header>

          {/* Scrollable Messages & Bento Hub */}
          <div className="rd-ai-messages" data-lenis-prevent>
            {/* Interactive Bento Topic Grid */}
            <div className="rd-ai-bento">
              <div className="rd-ai-bento__head">
                <span className="rd-ai-bento__eyebrow">
                  <SparkleIcon /> QUICK EXPLORER
                </span>
                <span className="rd-ai-bento__hint">Click a topic to ask</span>
              </div>
              <div className="rd-ai-bento__grid">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="rd-ai-topic-card"
                    onClick={() => sendQuestion(topic.prompt)}
                    disabled={isTyping}
                  >
                    <div className="rd-ai-topic-card__top">
                      <span className="rd-ai-topic-card__icon">{topic.icon}</span>
                      <FiChevronRight className="rd-ai-topic-card__arrow" />
                    </div>
                    <strong className="rd-ai-topic-card__title">{topic.title}</strong>
                    <span className="rd-ai-topic-card__sub">{topic.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Stream */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rd-ai-msg ${msg.role === 'user' ? 'rd-ai-msg--user' : 'rd-ai-msg--assistant'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="rd-ai-msg__bot-icon" aria-hidden="true">
                    <SparkleIcon />
                  </div>
                )}
                <div className="rd-ai-msg__bubble-wrap">
                  <div className="rd-ai-msg__bubble">
                    {renderFormattedText(msg.text)}

                    {/* Optional Highlight Stat Pills */}
                    {msg.highlights && msg.highlights.length > 0 && (
                      <div className="rd-ai-highlights">
                        {msg.highlights.map((h, i) => (
                          <div key={i} className="rd-ai-highlight-pill">
                            <span className="rd-ai-highlight-pill__label">{h.label}</span>
                            <strong className="rd-ai-highlight-pill__val">{h.value}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Optional Embedded Project Card */}
                    {msg.projectPreview && (
                      <div
                        className="rd-ai-proj-card"
                        onClick={() =>
                          handleActionClick({
                            label: msg.projectPreview!.title,
                            type: 'project',
                            target: msg.projectPreview!.id,
                          })
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleActionClick({
                              label: msg.projectPreview!.title,
                              type: 'project',
                              target: msg.projectPreview!.id,
                            })
                          }
                        }}
                      >
                        {msg.projectPreview.cover && (
                          <div className="rd-ai-proj-card__media">
                            <img
                              src={msg.projectPreview.cover}
                              alt={msg.projectPreview.title}
                              loading="lazy"
                            />
                            <span className="rd-ai-proj-card__cat">
                              {msg.projectPreview.category}
                            </span>
                          </div>
                        )}
                        <div className="rd-ai-proj-card__body">
                          <div className="rd-ai-proj-card__head">
                            <h4>{msg.projectPreview.title}</h4>
                            <span className="rd-ai-proj-card__open">
                              Inspect <FiArrowUpRight />
                            </span>
                          </div>
                          <div className="rd-ai-proj-card__tags">
                            {msg.projectPreview.tags.slice(0, 4).map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Navigation / Action Chips */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="rd-ai-msg__actions">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="rd-ai-action-chip"
                          onClick={() => handleActionClick(act)}
                        >
                          <span>{act.label}</span>
                          <FiArrowUpRight />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="rd-ai-msg__time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="rd-ai-msg rd-ai-msg--assistant">
                <div className="rd-ai-msg__bot-icon is-pulsing" aria-hidden="true">
                  <SparkleIcon />
                </div>
                <div className="rd-ai-msg__bubble rd-ai-typing">
                  <span />
                  <span />
                  <span />
                  <small className="rd-ai-typing__label">Synthesizing answer...</small>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Horizontal Prompt Carousel */}
          <div className="rd-ai-prompts" data-lenis-prevent>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="rd-ai-prompt-chip"
                onClick={() => sendQuestion(q)}
                disabled={isTyping}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form className="rd-ai-input-bar" onSubmit={handleSubmit}>
            <div className="rd-ai-input-shell">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about Shander's portfolio..."
                className="rd-ai-input"
                maxLength={260}
              />
              <button
                type="submit"
                className="rd-ai-send-btn"
                disabled={!input.trim() || isTyping}
                aria-label="Send question"
              >
                <FiSend />
              </button>
            </div>
            <div className="rd-ai-footer-meta">
              <span>Powered by Shander Knowledge Engine</span>
              <span>Press Esc to close · Ctrl+K</span>
            </div>
          </form>
        </section>
      )}
    </div>,
    document.body
  )
}
