import React from 'react'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiAngular,
  SiPhp,
  SiLaravel,
  SiNodedotjs,
  SiExpress,
  SiApache,
  SiPython,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiTensorflow,
  SiScikitlearn,
  SiPandas,
  SiFigma,
  SiGit,
  SiAnthropic,
  SiGooglegemini,
  SiOpencode,
  SiCanvas,
} from 'react-icons/si'
import { FiCode } from 'react-icons/fi'

const SmoothCss3Icon = (props) =>
  React.createElement(
    'svg',
    {
      role: 'img',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      width: '1em',
      height: '1em',
      ...props,
    },
    React.createElement('path', {
      d: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z',
    })
  )

const SmoothCapCutIcon = (props) =>
  React.createElement(
    'svg',
    {
      role: 'img',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      width: '1em',
      height: '1em',
      ...props,
    },
    React.createElement('path', {
      d: 'M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v2.38L14.12 12 21 16.37v2.38A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75v-2.38L9.88 12 3 7.63V5.25zm2.25-.25a.25.25 0 0 0-.25.25v1.26L12 10.95l7-4.44V5.25a.25.25 0 0 0-.25-.25H5.25zm13.5 14a.25.25 0 0 0 .25-.25v-1.26L12 13.05l-7 4.44v1.26c0 .138.112.25.25.25h13.5z',
    })
  )

const SmoothHarnessIcon = (props) =>
  React.createElement(
    'svg',
    {
      role: 'img',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      width: '1em',
      height: '1em',
      ...props,
    },
    React.createElement('path', {
      d: 'M12 2L3.5 6.9v10.2L12 22l8.5-4.9V6.9L12 2zm0 2.31l6.5 3.75v7.88L12 19.69l-6.5-3.75V8.06L12 4.31zm-3.25 4.19v7h2v-2.5h2.5V15.5h2v-7h-2v2.5h-2.5V8.5h-2z',
    })
  )

export const techIconMap = {
  html5: SiHtml5,
  css3: SmoothCss3Icon,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  angular: SiAngular,
  php: SiPhp,
  laravel: SiLaravel,
  nodejs: SiNodedotjs,
  express: SiExpress,
  apache: SiApache,
  python: SiPython,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  tensorflow: SiTensorflow,
  scikitlearn: SiScikitlearn,
  pandas: SiPandas,
  codex: SiOpencode,
  claude: SiAnthropic,
  antigravity: SiGooglegemini,
  harness: SmoothHarnessIcon,
  figma: SiFigma,
  canva: SiCanvas,
  git: SiGit,
  video: SmoothCapCutIcon,
}

export const techColorMap = {
  html5: '#e34f26',
  css3: '#1572b6',
  javascript: '#f7df1e',
  typescript: '#3178c6',
  react: '#61dafb',
  nextjs: '#ffffff',
  tailwindcss: '#38bdf8',
  angular: '#dd0031',
  php: '#777bb4',
  laravel: '#ff2d20',
  nodejs: '#339933',
  express: '#9ba1b0',
  apache: '#d22128',
  python: '#3776ab',
  mysql: '#4479a1',
  postgresql: '#4169e1',
  mongodb: '#47a248',
  tensorflow: '#ff6f00',
  scikitlearn: '#f7931e',
  pandas: '#818cf8',
  codex: '#10b981',
  claude: '#d97757',
  antigravity: '#8e75b2',
  harness: '#38bdf8',
  figma: '#f24e1e',
  canva: '#00c4cc',
  git: '#f05032',
  video: '#a855f7',
}

export const fallbackTechIcon = FiCode
