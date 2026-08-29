// Shared icon lookup for tech-stack entries — used by both the Sidebar's
// "top skills" grid and the full Techstacks section, keyed by the `icon`
// string in src/data/techstacks.js.
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiPhp,
  SiLaravel,
  SiPython,
  SiMysql,
  SiTensorflow,
  SiScikitlearn,
  SiPandas,
  SiFigma,
  SiGit,
} from 'react-icons/si'
import { FiVideo, FiCode, FiEdit3 } from 'react-icons/fi'

export const techIconMap = {
  html5: SiHtml5,
  css3: SiCss,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  php: SiPhp,
  laravel: SiLaravel,
  python: SiPython,
  mysql: SiMysql,
  tensorflow: SiTensorflow,
  scikitlearn: SiScikitlearn,
  pandas: SiPandas,
  figma: SiFigma,
  canva: FiEdit3,
  git: SiGit,
  video: FiVideo,
}

export const fallbackTechIcon = FiCode
