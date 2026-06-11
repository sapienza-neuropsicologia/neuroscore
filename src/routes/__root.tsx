import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import cherubino from '#/assets/cherubino.svg'
import cherubinoRosso from '#/assets/cherubino-rosso.svg'
import servizio from '#/assets/servizio.svg'

export const Route = createRootRoute({
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
      <NeuroScoreLayout>
        <Outlet />
      </NeuroScoreLayout>
    </QueryClientProvider>
  )
}

export function NeuroScoreLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-linear-to-b from-[#f7efe8] to-[#fffaf6] text-[#2c1f1a] print:bg-white">
      <header className="bg-linear-to-r from-[#742332] to-[#8e2f3f] text-white shadow-sm print:border-b print:border-[#999] print:bg-white print:text-black">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <img
            src={cherubino}
            alt="Sapienza Università di Roma"
            className="h-10 print:hidden"
          />
          <img
            src={cherubinoRosso}
            alt="Sapienza Università di Roma"
            className="hidden h-10 print:block print:h-10"
          />
          <Link
            to="/"
            className="print:hidden px-8 text-2xl [font-variant:small-caps] tracking-wide"
          >
            NeuroScore
          </Link>
          <div className="ml-auto flex gap-3 items-center">
            <div className="flex flex-col text-right text-xs uppercase tracking-wide">
              <div>Servizio di</div>
              <div>Neuropsicologia</div>
            </div>
            <img
              src={servizio}
              alt="Servizio di Neuropsicologia"
              className="h-10 print:block print:h-10"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 p-4 print:p-2 print:pb-14 md:p-6">
        {children}
      </main>

      <footer className="mt-auto bg-linear-to-r from-[#6f2433] to-[#7e2a3a] px-4 py-3 text-xs text-white/85 print:fixed print:right-0 print:bottom-0 print:left-0 print:border-t print:border-[#999] print:bg-white print:px-2 print:py-1.5 print:text-[10px] print:text-black">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-4 print:gap-2">
          <div className="text-left">
            Servizio di Neuropsicologia
            <br />
            Sapienza Università di Roma
            <br />
            Via degli Apuli 9, 00185 Roma
          </div>
          <div className="text-right space-y-1 print:space-y-0.5">
            <div>
              Tel/Whatsapp 06 6229 0987
              <br />
              <a
                href="mailto:servizio.neuropsicologia@uniroma1.it"
                className="hover:text-white print:no-underline print:text-black"
              >
                servizio.neuropsicologia@uniroma1.it
              </a>
              <br />
              <a
                href="https://web.uniroma1.it/neuropsicologia/servizi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white print:no-underline print:text-black"
              >
                https://web.uniroma1.it/neuropsicologia/servizi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
