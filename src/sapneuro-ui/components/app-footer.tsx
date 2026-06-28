import type { ReactNode } from 'react'
import { cn } from '../utils'

export interface AppFooterProps {
  className?: string
  leftItems?: ReactNode
  rightItems?: ReactNode
}

export function AppFooter({
  className = '',
  leftItems,
  rightItems
}: AppFooterProps) {
  return (
    <footer
      className={cn(
        'flex-shrink-0 sticky md:relative',
        'mt-20 border-t border-(--line) px-4 py-2.5',
        className
      )}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-2 gap-4 print:gap-2">
        <div className="text-left">{leftItems}</div>
        <div className="text-right space-y-1 print:space-y-0.5">
          {rightItems}
        </div>
      </div>
    </footer>
  )
}
