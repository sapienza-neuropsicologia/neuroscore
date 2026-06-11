import { type LinkProps, useNavigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function LinkBadge({
  title,
  subtitle,
  to,
  params,
  children
}: PropsWithChildren<{
  title: string
  subtitle?: string
  to: LinkProps['to']
  params: LinkProps['params']
}>) {
  const navigate = useNavigate()
  const handleClick = () => {
    // Esegue la navigazione della card esterna
    navigate({ to, params })
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ???
    // biome-ignore lint/a11y/useKeyWithClickEvents: ???
    <div
      onClick={handleClick}
      className="block cursor-pointer rounded-lg border border-[#e8d8cc] bg-white px-4 py-3 transition hover:border-[#cba893] hover:bg-[#fffaf6]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-semibold text-[#2c1f1a]">{title}</div>
          {subtitle && <div className="text-xs text-[#6f5a4f]">{subtitle}</div>}
        </div>

        {children && <div className="flex items-center gap-1">{children}</div>}
      </div>
    </div>
  )
}
