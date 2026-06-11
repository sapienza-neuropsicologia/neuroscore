import type {
  FunctionComponent,
  MouseEventHandler,
  PropsWithChildren
} from 'react'
import { Button } from './Button'
import { SectionPill } from './SectionPill'

export interface ButtonProps {
  icon: FunctionComponent<{ size: number }>
  label: string
  tooltip?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Card({
  title,
  subtitle,
  links,
  actions = [],
  bottomLine = 'right',
  hideHeaderInPrint = false,
  scrollable = false,
  className,
  children
}: PropsWithChildren<{
  title: string
  subtitle?: string
  links?: Record<string, string>
  actions?: ButtonProps[]
  bottomLine?: 'center' | 'right'
  hideHeaderInPrint?: boolean
  scrollable?: boolean
  className?: string
}>) {
  const headerClass = hideHeaderInPrint
    ? 'bg-linear-to-r from-[#94364a] to-[#6e2331] px-5 py-4 text-white print:hidden'
    : 'bg-linear-to-r from-[#94364a] to-[#6e2331] px-5 py-4 text-white print:bg-white print:px-2 print:py-1.5 print:text-black'
  const bodyClass = scrollable
    ? 'min-h-0 flex-1 overflow-y-auto p-4 print:p-2 md:p-5'
    : 'p-4 print:p-2 md:p-5'
  const sectionClass = scrollable
    ? `flex flex-col overflow-hidden rounded-2xl border border-[#e8d8cc] bg-white shadow-lg print:rounded-none print:border-0 print:shadow-none ${className ?? ''}`
    : `overflow-hidden rounded-2xl border border-[#e8d8cc] bg-white shadow-lg print:rounded-none print:border-0 print:shadow-none ${className ?? ''}`

  return (
    <section className={sectionClass}>
      <div className={headerClass}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold print:text-base">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-white/85 print:mt-0.5 print:text-xs print:text-black/80">
                {subtitle}
              </p>
            ) : null}
            {links
              ? Object.keys(links).map((key) => (
                  <a
                    key={key}
                    href={links[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="pr-3"
                  >
                    <SectionPill>{key}</SectionPill>
                  </a>
                ))
              : null}
          </div>
          {actions.length > 0 ? (
            <div className="flex shrink-0 items-center gap-0.5 self-center print:hidden">
              {actions.map(({ icon, label, tooltip, disabled, onClick }) => (
                <Button
                  key={label}
                  tooltip={tooltip}
                  icon={icon}
                  iconSize={18}
                  disabled={disabled}
                  variant="dark"
                  onClick={onClick}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className={bodyClass}>
        {children}
        {actions.length > 0 ? (
          <div
            className={`mt-4 flex gap-2 ${bottomLine === 'right' ? 'justify-end' : 'justify-center'}`}
          >
            {actions.map(({ icon, label, tooltip, disabled, onClick }) => (
              <Button
                key={label}
                label={label}
                tooltip={tooltip}
                disabled={disabled}
                icon={icon}
                iconSize={16}
                border={true}
                onClick={onClick}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
