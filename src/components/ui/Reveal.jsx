import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Fades + slides its children into view the first time they cross the
 * viewport. `delay` lets callers stagger a list of these.
 */
export default function Reveal({
  children,
  delay = 0,
  as = 'div',
  direction = 'up',
  distance = 20,
  ...rest
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const MotionTag = motion[as] ?? motion.div

  const getInitial = () => {
    if (direction === 'up') return { opacity: 0, y: distance, scale: 0.98 }
    if (direction === 'down') return { opacity: 0, y: -distance, scale: 0.98 }
    if (direction === 'left') return { opacity: 0, x: -distance, scale: 0.98 }
    if (direction === 'right') return { opacity: 0, x: distance, scale: 0.98 }
    return { opacity: 0, scale: 0.96 }
  }

  return (
    <MotionTag
      ref={ref}
      initial={getInitial()}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : getInitial()}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth Apple quintic curve
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
