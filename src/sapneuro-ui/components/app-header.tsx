import { Fragment, type PropsWithChildren, type ReactElement } from 'react'
import { ThemeToggler } from './theme-toggler'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

export interface AppHeaderProps
  extends PropsWithChildren<{
    className?: string
    padding?: number
    leftItems?: ReactElement[]
    centerItems?: ReactElement[]
    rightItems?: ReactElement[]
    sidebarTrigger?: boolean
    themeToggler?: boolean
  }> {}

export const AppHeader = ({
  className = '',
  padding = 3,
  leftItems = [],
  centerItems = [],
  rightItems = [],
  sidebarTrigger,
  themeToggler
}: AppHeaderProps) => {
  return (
    <header className={`sticky top-0 z-50 px-4 backdrop-blur-lg ${className}`}>
      <nav
        className={`mx-auto px-4 flex flex-wrap items-center gap-x-3 gap-y-2 py-${padding}`}
      >
        {sidebarTrigger && <SidebarTrigger className="-ml-1" />}
        {sidebarTrigger && (
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        )}
        {leftItems.map((item, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <only way>
            key={idx}
            className="ml-0 flex items-center gap-x-4 gap-y-1 pb-1 sm:w-auto sm:flex-nowrap sm:pb-0"
          >
            {item}
          </div>
        ))}
        {centerItems.length > 0 && (
          <div className="mx-auto flex items-center gap-x-4 gap-y-1 pb-1 text-sm sm:w-auto sm:flex-nowrap sm:pb-0">
            {centerItems}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {themeToggler && <ThemeToggler />}
          {rightItems.map((item, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <only way>
            <Fragment key={idx}>{item}</Fragment>
          ))}
        </div>
      </nav>
    </header>
  )
}
