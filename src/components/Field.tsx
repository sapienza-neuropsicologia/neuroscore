import type { PropsWithChildren } from 'react'

export function Field(
  props: PropsWithChildren<{ label: string; for: string }>
) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={props.for}
        className="text-xs font-semibold uppercase tracking-wide text-[#6f5a4f]"
      >
        {props.label}
      </label>
      {props.children}
    </div>
  )
}
