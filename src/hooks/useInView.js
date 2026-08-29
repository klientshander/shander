import { useRef } from 'react'
import { useInView as useFramerInView } from 'framer-motion'

/**
 * Returns a ref to attach to an element and a boolean that flips to true
 * once the element enters the viewport. Respects prefers-reduced-motion.
 */
export function useInView(options = { once: true, margin: '0px 0px -40px 0px' }) {
  const ref = useRef(null)
  const inView = useFramerInView(ref, options)
  return [ref, inView]
}
