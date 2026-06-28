import { useLocation } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb'

export function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/')

  const names = segmentNames(segments)

  segments.pop()
  for (let i = 1; i < segments.length; i++)
    segments[i] = `${segments[i - 1]}/${segments[i]}`
  segments[0] = '/'

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={segment}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={segment}>{names[index]}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </Fragment>
        ))}
        <BreadcrumbItem key="_last">
          <BreadcrumbPage>{names.at(-1)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbComponent>
  )
}

function segmentNames(segments: string[]) {
  const names = segments.map(humanizeString)
  names[0] = 'Home'
  return names
}

function humanizeString(word: string) {
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
  return capitalized.replace(/[-_]/g, ' ')
}
