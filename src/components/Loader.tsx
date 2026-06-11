import { Loader as LucideLoader } from 'lucide-react'

export function Loader() {
  return (
    <div className="mt-4 flex justify-center">
      <LucideLoader size={20} className="animate-spin" />
    </div>
  )
}
