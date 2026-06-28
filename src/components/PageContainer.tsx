import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '#/sapneuro-ui'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '#/sapneuro-ui/components'

export function PageContainer({
  title,
  description,
  links,
  actions,
  footer,
  scrollable,
  children
}: PropsWithChildren<{
  title: ReactNode
  description?: ReactNode
  links?: Record<string, string>
  actions?: ReactNode
  footer?: ReactNode
  scrollable: boolean
}>) {
  return (
    <Card className="flex-1 flex flex-col h-full min-h-0 mt-4 pt-0 pb-0 gap-2">
      <CardHeader className="shrink-0 pt-2! pb-1! bg-muted border-b">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {links && (
          <div>
            {Object.keys(links).map((key) => (
              <a
                key={key}
                href={links[key]}
                target="_blank"
                rel="noreferrer"
                className="mt-0 pr-3 border-0"
              >
                <div className="inline-flex items-center rounded-full border border-[#efcdd4] bg-[#f8e6ea] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8e2f3f] print:hidden">
                  {key}
                </div>
              </a>
            ))}{' '}
          </div>
        )}
        {actions && <CardAction>{actions}</CardAction>}
      </CardHeader>
      <CardContent
        className={cn(
          scrollable
            ? 'overflow-y-auto print:flex-1 print:min-h-0 print:h-full print:mb-0 print:pb-0'
            : '',
          'flex-1 min-h-0 h-full mb-0 pb-0'
        )}
      >
        {children}
      </CardContent>
      <CardFooter className="shrink-0 flex gap-2 bg-muted/50 border-t pt-2! pb-2 justify-center text-sm text-muted-foreground">
        {footer}
      </CardFooter>
    </Card>
  )
}
