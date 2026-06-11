import type { FunctionComponent, MouseEventHandler } from 'react'

export function Button({
  label,
  tooltip,
  icon: Icon,
  iconSize = 18,
  border = false,
  disabled,
  variant = 'default',
  hpadding = true,
  vpadding = true,
  onClick
}: {
  label?: string
  tooltip?: string
  icon?: FunctionComponent<{ size: number }>
  iconSize?: number
  border?: boolean
  disabled?: boolean
  variant?: 'default' | 'dark'
  hpadding?: boolean
  vpadding?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  let style =
    'flex items-center gap-2 rounded-md transition-colors cursor-pointer'
  if (variant === 'default')
    style += ' text-[#6f5a4f] hover:bg-[#fff0f0] hover:text-red-500'
  else if (variant === 'dark')
    style += ' text-white/70 hover:bg-white/15 hover:text-red-300'
  if (border) style += ' btn-secondary'
  if (hpadding) style += ' px-1.5'
  if (vpadding) style += ' py-1.5'

  return (
    <button
      type="button"
      title={tooltip}
      aria-label={tooltip}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className={style}
    >
      {Icon && <Icon size={iconSize} />}
      {label}
    </button>
  )
}
