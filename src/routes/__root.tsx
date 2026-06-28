import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ServiceTermsChecker } from '#/components/ServiceTerms'
import { ThemeProvider } from '#/sapneuro-ui'
import { documentHead, Layout, TooltipProvider } from '#/sapneuro-ui/components'
import styleSheet from '#/styles.css?url'

export const Route = createRootRoute({
  head: () =>
    documentHead({
      siteTitle: 'NeuroScore',
      siteDescription: 'Scoring semi-automatico di test neuropsicologici',
      styleSheet,
      charSet: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }),
  component: RootComponent
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Layout>
            <ServiceTermsChecker>
              <Outlet />
            </ServiceTermsChecker>
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
