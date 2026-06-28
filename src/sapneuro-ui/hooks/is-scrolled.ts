import { useEffect, useState } from 'react'

export function useIsScrolled({ threshold = 10 }: { threshold?: number } = {}) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
