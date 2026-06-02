'use client'

import { useEffect } from 'react'

export default function HomeAnimations() {
  useEffect(() => {
    let active = true
    let benefitsSectionObs = null
    let ctaSectionObs = null

    // Dynamic import to prevent Node.js/SSR errors with browser-reliant libraries
    import('animejs').then((module) => {
      if (!active) return
      const { animate, stagger } = module

      // 1. HERO ENTRANCE ANIMATIONS
      // Subtitle: fade in & slide down
      animate('.anime-hero-subtitle', {
        opacity: [0, 0.5],
        translateY: [-20, 0],
        duration: 1200,
        ease: 'outExpo',
        delay: 100,
      })

      // Title: fade in, scale & expand letter spacing
      animate('.anime-hero-title', {
        opacity: [0, 1],
        scale: [0.95, 1],
        letterSpacing: ['-4px', '2px'],
        duration: 1600,
        ease: 'outExpo',
        delay: 200,
      })

      // Description: fade in & slide up
      animate('.anime-hero-desc', {
        opacity: [0, 0.6],
        translateY: [20, 0],
        duration: 1400,
        ease: 'outExpo',
        delay: 350,
      })

      // CTA buttons: fade in & slide up staggered
      animate('.anime-hero-cta', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
        ease: 'outExpo',
        delay: stagger(150, { start: 500 }),
      })

      // Scroll indicator container: fade in
      animate('.anime-hero-scroll', {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 1000,
        ease: 'outExpo',
        delay: 900,
      })

      // Scroll indicator line: looping animation
      animate('.anime-hero-scroll-line', {
        height: ['0px', '40px'],
        opacity: [0.3, 1, 0.3],
        loop: true,
        duration: 2000,
        ease: 'inOutQuad',
      })

      // 2. HERO BACKGROUND FLOATING PARTICLES (Bubbles/Drops)
      const bubbleContainer = document.querySelector('.hero-bubbles-container')
      if (bubbleContainer) {
        bubbleContainer.innerHTML = '' // Reset container
        const bubbleCount = 15
        for (let i = 0; i < bubbleCount; i++) {
          const bubble = document.createElement('div')
          const size = Math.random() * 18 + 6 // 6px to 24px
          const leftPosition = Math.random() * 100 // 0% to 100%
          
          bubble.style.position = 'absolute'
          bubble.style.bottom = '-30px'
          bubble.style.left = `${leftPosition}%`
          bubble.style.width = `${size}px`
          bubble.style.height = `${size}px`
          bubble.style.borderRadius = '50%'
          bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 70%, rgba(168,212,224,0.15) 100%)'
          bubble.style.border = '1px solid rgba(255,255,255,0.06)'
          bubble.style.boxShadow = '0 4px 12px rgba(168,212,224,0.05)'
          bubble.style.pointerEvents = 'none'
          
          bubbleContainer.appendChild(bubble)
          
          // Animate floating up, swaying side to side, scaling and fading
          animate(bubble, {
            translateY: [0, -window.innerHeight - 50],
            translateX: [0, (Math.random() - 0.5) * 120],
            scale: [0.5, 1.2, 0.4],
            opacity: [0, 0.7, 0],
            duration: Math.random() * 8000 + 8000, // 8s to 16s
            delay: Math.random() * 5000,
            loop: true,
            ease: 'outQuad',
          })
        }
      }



      // 4. BENEFITS STAGGER ENTRANCE (Using IntersectionObserver)
      const benefitsSection = document.querySelector('.anime-benefits-trigger')
      if (benefitsSection) {
        // Initial setup to avoid flickers
        const cards = document.querySelectorAll('.anime-benefit-card')
        cards.forEach(card => {
          card.style.opacity = '0'
          card.style.transform = 'translateY(40px) scale(0.95)'
        })

        benefitsSectionObs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate('.anime-benefit-card', {
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.95, 1],
                delay: stagger(150),
                duration: 1200,
                ease: 'outExpo',
              })
              benefitsSectionObs.unobserve(entry.target)
            }
          })
        }, { threshold: 0.15 })

        benefitsSectionObs.observe(benefitsSection)
      }

      // 5. CTA CONTAINER ENTRANCE (Using IntersectionObserver)
      const ctaSection = document.querySelector('.anime-cta-trigger')
      if (ctaSection) {
        const ctaCard = document.querySelector('.anime-cta-card')
        if (ctaCard) {
          ctaCard.style.opacity = '0'
          ctaCard.style.transform = 'translateY(30px) scale(0.95)'
        }

        ctaSectionObs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate('.anime-cta-card', {
                opacity: [0, 1],
                scale: [0.95, 1],
                translateY: [30, 0],
                duration: 1200,
                ease: 'outExpo',
              })
              ctaSectionObs.unobserve(entry.target)
            }
          })
        }, { threshold: 0.15 })

        ctaSectionObs.observe(ctaSection)
      }
    })

    // Clean up observers and active flags on component unmount
    return () => {
      active = false
      if (benefitsSectionObs) benefitsSectionObs.disconnect()
      if (ctaSectionObs) ctaSectionObs.disconnect()
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Container for dynamically spawned bubble particles */}
      <div className="hero-bubbles-container absolute inset-0 w-full h-full" />
    </div>
  )
}
