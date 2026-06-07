import React, { useEffect, useRef } from 'react'

const ParticleBackground = () => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const isMobileRef = useRef(window.innerWidth < 768)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particleCount = isMobileRef.current ? 20 : 40
    const particles = []

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 4 + 2
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = ['rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(34, 211, 238, 0.6)'][
          Math.floor(Math.random() * 3)
        ]
      }

      update(mouseX, mouseY) {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0) this.x = window.innerWidth
        if (this.x > window.innerWidth) this.x = 0
        if (this.y < 0) this.y = window.innerHeight
        if (this.y > window.innerHeight) this.y = 0

        // 鼠标避开效果
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 100

        if (distance < repelRadius && !isMobileRef.current) {
          const angle = Math.atan2(dy, dx)
          const force = (repelRadius - distance) / repelRadius
          this.x -= Math.cos(angle) * force * 2
          this.y -= Math.sin(angle) * force * 2
        }
      }

      draw(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    particlesRef.current = particles

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update(mouseRef.current.x, mouseRef.current.y)
        particle.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      isMobileRef.current = window.innerWidth < 768
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ background: 'transparent' }}
    />
  )
}

export default ParticleBackground
