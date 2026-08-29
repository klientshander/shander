# Shander Santillan — Portfolio

A single-page personal portfolio built with **React + Vite**. Fixed sidebar profile and social links, a floating nav rail with color-coded sections, light/dark mode, keyboard shortcuts, a command palette, and a fully responsive layout down to mobile.

**Live sections:** About · Projects · Certification · Techstacks · Education · Gallery · Contact

---

## ✨ Features

- **One-page scroll layout** — every section lives on one page; the nav rail smooth-scrolls to it and updates the URL hash for deep linking (`#projects`, `#contact`, etc.)
- **Active-section tracking** — an `IntersectionObserver` highlights the current nav item as you scroll, no manual state syncing
- **Command palette** — `⌘K` / `Ctrl+K` opens a searchable jump-to-section menu
- **Keyboard shortcuts** — `←` / `→` move between sections, `D` toggles the theme, `Esc` closes any open overlay
- **Light/dark mode** — persisted to `localStorage` and defaults to the visitor's OS preference on first visit
- **Scroll progress bar**, **back-to-top button**, and **toast notifications**
- **Lightbox, certificate modal, and video modal** for viewing gallery images, certificates, and project demos up close
- **Color-coded sections** — each nav item and section banner carries its own accent hue (About = blue, Projects = purple, Certification = gold, etc.) for quick visual orientation
- **Reduced-motion aware** — animations are skipped automatically if the visitor's OS requests reduced motion
- **Fully data-driven content** — update your info by editing plain JS files in `src/data/`, no component code required

---

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Animation | Framer Motion |
| Icons | react-icons |
| Styling | Plain CSS with design tokens (no framework lock-in) |
| Fonts | Space Grotesk (display), Inter (body), JetBrains Mono (mono accents) |

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

---

## ✏️ Editing your content

All personal content lives in `src/data/` — you don't need to touch component code to update it:

| File | What it controls |
|---|---|
| `src/data/profile.js` | Name, role, location, tagline, avatar, résumé link, typing-effect roles, social links |
| `src/data/nav.js` | Sidebar/nav-rail items, order, icons, and accent colors |
| `src/data/sectionMeta.js` | Each section's banner copy (channel label, eyebrow, title, blurb) |
| `src/data/education.js` | Education timeline |
| `src/data/certifications.js` | Certification cards |
| `src/data/techstacks.js` | Tech stack, grouped by category |
| `src/data/techIcons.js` | Icon + color mapping for individual technologies |
| `src/data/projects.js` | Project cards |
| `src/data/gallery.js` | Gallery images and captions |

### Adding a profile photo

Drop your image in `public/` (e.g. `public/avatar.jpg`) and set:

```js
// src/data/profile.js
avatar: '/avatar.jpg'
```

### Adding a résumé

Drop your résumé in `public/resume.pdf` — it's already linked from `profile.js` via `resumeUrl`.

### Adding gallery images

Drop images in `public/gallery/` and reference them in `src/data/gallery.js`:

```js
{ id: 'g-1', src: '/gallery/photo1.jpg', caption: 'Hackathon 2025' }
```

### Changing the color theme

Design tokens (colors, fonts, spacing, radii) live at the top of `src/styles/index.css` under `:root`. Section accent hues (`--hue-about`, `--hue-projects`, etc.) can be tweaked independently of the rest of the palette.

---

## 📁 Project structure

```
src/
├── components/
│   ├── Sidebar.jsx            # Profile card, socials, primary nav
│   ├── NavRail.jsx            # Floating section nav + theme toggle
│   ├── chrome/                # Global UI: progress bar, toast, command
│   │                            palette, lightbox, modals, back-to-top
│   ├── sections/               # One component per nav section
│   └── ui/                     # Reusable UI pieces (typing text, marquee,
│                                  skills radar, sparkline, reveal, etc.)
├── context/
│   └── UIContext.jsx           # Shared overlay/modal state (cmd palette,
│                                  lightbox, toasts)
├── data/                       # All editable content (see table above)
├── hooks/
│   ├── useTheme.js             # Dark/light mode with localStorage persistence
│   └── useInView.js            # Scroll-reveal helper
├── styles/
│   ├── index.css               # Design tokens + global reset
│   ├── chrome.css              # Styles for global chrome components
│   └── sections.css            # Shared section/card patterns
├── App.jsx                     # Page shell, scroll/keyboard logic, routing
└── main.jsx                    # Entry point
```

---

## ⌨️ Keyboard shortcuts

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open command palette |
| `←` / `→` | Jump to previous / next section |
| `D` | Toggle light/dark theme |
| `Esc` | Close any open overlay (palette, lightbox, modal) |

---

## ♿ Accessibility

- Semantic landmarks (`nav`, `main`, `aside`, `header`, `section`)
- Visible keyboard focus states throughout
- Respects `prefers-reduced-motion` — animations are disabled for visitors who request it
- Interactive overlays (command palette, modals, lightbox) close on `Esc` and trap focus appropriately

---

## 📦 Deployment

This is a static Vite build — deploy the output of `npm run build` (the `dist/` folder) to any static host: **Vercel**, **Netlify**, **GitHub Pages**, or Cloudflare Pages all work out of the box.

```bash
npm run build
```

Upload the contents of `dist/` to your host of choice.
