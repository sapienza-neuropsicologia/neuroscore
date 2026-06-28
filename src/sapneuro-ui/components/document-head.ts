import type { AnyRouteMatch } from '@tanstack/react-router'

export function documentHead({
  siteTitle,
  siteDescription,
  styleSheet,
  charSet = 'utf-8',
  viewport = 'width=device-width, initial-scale=1'
}: {
  siteTitle?: string
  siteDescription?: string
  styleSheet?: string
  charSet?: string
  viewport?: string
}): {
  meta?: AnyRouteMatch['meta']
  links?: AnyRouteMatch['links']
  scripts?: AnyRouteMatch['headScripts']
  styles?: AnyRouteMatch['styles']
} {
  return {
    meta: [
      {
        charSet
      },
      {
        name: 'viewport',
        content: viewport
      },
      siteTitle
        ? {
            name: 'apple-mobile-web-app-title',
            content: siteTitle
          }
        : undefined,
      siteDescription
        ? {
            name: 'description',
            content: siteDescription
          }
        : undefined
    ],
    links: [
      styleSheet
        ? {
            rel: 'stylesheet',
            href: styleSheet
          }
        : undefined,
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        sizes: '96x96'
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg'
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest'
      }
    ]
  }
}
