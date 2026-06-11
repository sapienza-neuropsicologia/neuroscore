import type { PropsWithChildren } from 'react'

export function SectionPill({ children }: PropsWithChildren) {
  return (
    <div className="mb-2 mt-5 inline-flex items-center rounded-full border border-[#efcdd4] bg-[#f8e6ea] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8e2f3f] print:mt-2 print:border-0 print:bg-transparent print:px-0 print:text-black">
      {children}
    </div>
  )
}
