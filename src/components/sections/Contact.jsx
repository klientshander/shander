import { useState } from 'react'
import { FaLinkedin, FaFacebookMessenger, FaGithub, FaXTwitter } from 'react-icons/fa6'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { FiCopy, FiCheck, FiMapPin, FiSend } from 'react-icons/fi'
import { socials, profile } from '../../data/profile'
import { useUI } from '../../context/UIContext'
import Reveal from '../ui/Reveal'

export default function Contact() {
  const { showToast } = useUI()
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socials.email)
      setCopied(true)
      showToast('Email copied to clipboard')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${socials.email}`
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('Please fill in every required field.')
      return
    }
    const subject = encodeURIComponent(`${form.subject || 'Portfolio inquiry'} from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${socials.email}?subject=${subject}&body=${body}`
    setStatus('Opening your email client…')
    showToast('Message prepared — opening mail client')
  }

  return (
    <>
      <Reveal as="section" className="panel contact-card" aria-label="Contact information">
        <div className="contact-row">
          <HiOutlinePhone aria-hidden="true" />
          <a href={`tel:${socials.phone}`}>{socials.phone}</a>
        </div>

        <div className="contact-row">
          <HiOutlineMail aria-hidden="true" />
          <a href={`mailto:${socials.email}`}>{socials.email}</a>
          <button type="button" className="contact-copy-btn" onClick={copyEmail}>
            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="contact-row">
          <FiMapPin aria-hidden="true" />
          <span>{profile.location}</span>
        </div>

        <div className="contact-socials">
          <a className="social-link-btn" href={socials.linkedin} target="_blank" rel="noreferrer">
            <FaLinkedin aria-hidden="true" /> LinkedIn
          </a>
          <a className="social-link-btn" href={socials.github} target="_blank" rel="noreferrer">
            <FaGithub aria-hidden="true" /> GitHub
          </a>
          <a className="social-link-btn" href={socials.messenger} target="_blank" rel="noreferrer">
            <FaFacebookMessenger aria-hidden="true" /> Messenger
          </a>
          <a className="social-link-btn" href={socials.x} target="_blank" rel="noreferrer">
            <FaXTwitter aria-hidden="true" /> X / Twitter
          </a>
        </div>
      </Reveal>

      <Reveal as="div" className="contact-map" delay={0.05}>
        <div className="contact-map__header">
          <FiMapPin aria-hidden="true" />
          {profile.location} · UTC+8
        </div>
        <div className="contact-map__body">
          <div className="contact-map__pin">
            <span className="contact-map__pin-dot" />
            <span className="contact-map__pin-label">{profile.location}</span>
          </div>
        </div>
      </Reveal>

      <Reveal as="form" className="panel contact-form" delay={0.1} onSubmit={handleSubmit}>
        <div className="contact-form__grid">
          <div className="contact-form__row">
            <label htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="contact-form__row">
            <label htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="contact-form__row">
          <label htmlFor="cf-subject">Subject</label>
          <select
            id="cf-subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          >
            <option value="">Select a topic…</option>
            <option>Job opportunity</option>
            <option>Freelance project</option>
            <option>Collaboration</option>
            <option>Just saying hi</option>
            <option>Other</option>
          </select>
        </div>

        <div className="contact-form__row">
          <label htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            placeholder="What would you like to talk about?"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            required
          />
        </div>

        <div className="contact-form__submit">
          <button type="submit" className="btn btn--solid">
            <FiSend aria-hidden="true" />
            Send message
          </button>
          <span className="contact-form__status">{status}</span>
        </div>
      </Reveal>

      <footer className="page-footer">
        {profile.name} — {new Date().getFullYear()} · Built with React
      </footer>
    </>
  )
}
