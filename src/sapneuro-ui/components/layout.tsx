import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { useIsScrolled } from '../hooks/is-scrolled'
import { cn } from '../utils'
import cherubino from '../assets/cherubino.svg'
import cherubinoRosso from '../assets/cherubino-rosso.svg'
import neuropsi from '../assets/neuropsi.svg'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'

const Logo = () => (
  <div className="font-calibri font-light small-caps">
    <div className="flex items-center gap-4">
      <Link
        to="/"
        className="flex items-center gap-4 text-inherit no-underline group"
      >
        <img
          src={neuropsi}
          alt="Logo Neuropsicologia Sapienza"
          className="h-10"
        />
        <div className="flex flex-col">
          <p className="text-white text-2xl font-calibri font-light print:text-black">
            Sapienza Neuropsicologia
          </p>
        </div>
      </Link>
    </div>
  </div>
)

export function Layout({ children }: PropsWithChildren) {
  const isScrolled = useIsScrolled({ threshold: 30 })
  return (
    <div className="w-screen flex flex-col h-screen overflow-hidden">
      <AppHeader
        className={cn(
          isScrolled
            ? 'bg-sapienza-red/80 backdrop-blur-md'
            : 'bg-sapienza-red',
          'text-white print:bg-white print:text-black'
        )}
        padding={2}
        leftItems={[<Logo key="logo" />]}
        rightItems={[
          <img
            key="cherubino"
            src={cherubino}
            alt="Logo Sapienza"
            className="h-10 hidden md:block print:hidden"
          />,
          <img
            key="cherubinoRosso"
            src={cherubinoRosso}
            alt="Logo Sapienza"
            className="h-10 hidden print:block print:h-10"
          />
        ]}
        themeToggler={true}
      />

      <main className="flex-1 min-h-0 m-0 px-3 py-2 flex flex-col w-full">
        {children}
      </main>

      <footer
        className={cn(
          'flex-shrink-0 sticky md:relative',
          'border-t border-(--line) m-0 px-4 py-1.5',
          'bg-sapienza-red text-white text-xs text-center print:hidden'
        )}
      >
        © 2026 Servizio di Neuropsicologia - Sapienza Università di Roma
      </footer>

      <AppFooter
        className="hidden print:block print:fixed print:right-0 print:bottom-0 print:left-0 print:border-t print:border-[#999] print:bg-white print:px-2 print:py-1.5 print:text-[10px] print:text-black"
        leftItems={
          <>
            Servizio di Neuropsicologia
            <br />
            Sapienza Università di Roma
            <br />
            Via degli Apuli 9, 00185 Roma
          </>
        }
        rightItems={
          <>
            {' '}
            Tel/Whatsapp 06 6229 0987
            <br />
            Email:{' '}
            <a
              href="mailto:servizio.neuropsicologia@uniroma1.it"
              className="underline print:no-underline"
            >
              servizio.neuropsicologia@uniroma1.it
            </a>
            <br />
            Web:{' '}
            <a
              href="https://web.uniroma1.it/neuropsicologia/servizi"
              target="_blank"
              rel="noopener noreferrer"
              className="underline print:no-underline"
            >
              https://web.uniroma1.it/neuropsicologia/servizi
            </a>
          </>
        }
      />
    </div>
  )
}
