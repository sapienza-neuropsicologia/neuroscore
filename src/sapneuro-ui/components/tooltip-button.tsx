import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../utils'
import { Button, type buttonVariants } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function TooltipButton({
  className,
  tooltip,
  side,
  ...props
}: Omit<ComponentProps<'button'>, 'aria-label'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    tooltip?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
  }) {
  return tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(className, 'cursor-pointer')}
          aria-label={tooltip}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    <Button className={cn(className, 'cursor-pointer')} {...props} />
  )
}
