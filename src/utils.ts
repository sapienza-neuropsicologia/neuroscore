export function computePatientAge(birthDate: Date, now: Date = new Date()) {
  if (now < birthDate) throw 'Errore di data'
  let age = now.getFullYear() - birthDate.getFullYear()
  const m = now.getMonth() - birthDate.getMonth()
  if (m < 0) age -= 1
  return age
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export function formatScore(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export function esInterp(pe: number): string {
  if (pe === 0) return '*'
  if (pe === 1) return '°'
  return ''
}

export function asset(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${baseUrl}${cleanPath}`
}
