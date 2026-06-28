import { ScriptOnce } from '@tanstack/react-router'
import {
  createContext,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

/*
  This file is adapted from next-themes to work with tanstack start.
  next-themes can be found at https://github.com/pacocoursey/next-themes under the MIT license.
*/

export type ForcedTheme = 'dark' | 'light'
export type Theme = ForcedTheme | 'auto'

export interface UseThemeProps {
  /** Update the theme */
  setTheme: (theme: Theme) => void
  /** Active theme name */
  theme?: Theme
  /** Returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: ForcedTheme
}

export interface ThemeProviderProps {
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean
  /** Key used to store theme setting in localStorage */
  storageKey?: string
  /** Default theme name */
  defaultTheme?: Theme
  /** Force this theme */
  force?: ForcedTheme
}

const ThemeContext = createContext<{
  theme?: Theme
  systemTheme?: ForcedTheme
  setTheme: (theme: Theme) => void
}>({
  setTheme: () => {}
})

export const ThemeProvider = ({
  disableTransitionOnChange = false,
  storageKey = 'selected-theme',
  defaultTheme = 'auto',
  force,
  children
}: PropsWithChildren<ThemeProviderProps>) => {
  const [theme, setThemeState] = useState<Theme | undefined>(force)
  const [systemTheme, setSystemTheme] = useState<ForcedTheme>()

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (force) return
      setAndSaveTheme(
        newTheme,
        systemTheme!,
        disableTransitionOnChange,
        storageKey
      )
      setThemeState(newTheme)
    },
    [disableTransitionOnChange, storageKey, systemTheme, force]
  )

  // useEffect only runs on the client, so now we can safely initialize the store
  useEffect(() => {
    if (!force) setThemeState(getSavedTheme(storageKey, defaultTheme))
    setSystemTheme(getSystemTheme())
  }, [defaultTheme, storageKey, force])

  // Always listen to System preference
  useEffect(() => {
    const handleMediaQuery = (e: MediaQueryListEvent) => {
      const currentSystemTheme = getSystemTheme(e)
      setSystemTheme(currentSystemTheme)
      if (theme === 'auto')
        applyTheme(currentSystemTheme, disableTransitionOnChange)
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')

    media.addEventListener('change', handleMediaQuery)
    return () => media.removeEventListener('change', handleMediaQuery)
  }, [disableTransitionOnChange, theme])

  // localStorage event handling, allow to sync theme changes between tabs
  useEffect(() => {
    const handleStorage = () => {
      setTheme(getSavedTheme(storageKey, defaultTheme))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [defaultTheme, storageKey, setTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        systemTheme,
        setTheme
      }}
    >
      <ThemeScript
        {...{
          storageKey,
          defaultTheme,
          forcedTheme: force
        }}
      />
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): UseThemeProps {
  return useContext(ThemeContext)
}

// Helpers
function getSavedTheme(
  storageKey: string,
  defaultTheme: Theme = 'auto'
): Theme {
  const savedTheme = localStorage.getItem(storageKey)
  return savedTheme === 'light' ||
    savedTheme === 'dark' ||
    savedTheme === 'auto'
    ? savedTheme
    : defaultTheme
}

function getSystemTheme(event?: MediaQueryListEvent): ForcedTheme {
  return (event ?? window.matchMedia('(prefers-color-scheme: dark)')).matches
    ? 'dark'
    : 'light'
}

// Set theme state and save to local storage
function setAndSaveTheme(
  newTheme: Theme,
  systemTheme: ForcedTheme,
  disableTransitionOnChange: boolean,
  storageKey: string
) {
  applyTheme(
    newTheme === 'auto' ? systemTheme : newTheme,
    disableTransitionOnChange
  )

  // Save to storage
  try {
    localStorage.setItem(storageKey ?? 'selected-theme', newTheme)
  } catch {}
}

function applyTheme(theme: ForcedTheme, disableTransitionOnChange: boolean) {
  const d = document.documentElement
  d.classList.remove('light', 'dark')
  d.classList.add(theme)
  if (disableTransitionOnChange) {
    const css = document.createElement('style')
    css.appendChild(
      document.createTextNode(
        '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
      )
    )
    document.head.appendChild(css)

    // Force restyle
    ;(() => window.getComputedStyle(document.body))()

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css)
    }, 1)
  }
}

const ThemeScript = memo(
  ({
    storageKey,
    defaultTheme,
    forcedTheme
  }: {
    storageKey: string
    defaultTheme: Theme
    forcedTheme: ForcedTheme | undefined
  }) => {
    const scriptArgs = JSON.stringify([
      storageKey,
      defaultTheme,
      forcedTheme
    ]).slice(1, -1)

    return (
      <ScriptOnce>{`(${themeScript.toString()})(${scriptArgs})`}</ScriptOnce>
    )
  }
)

const themeScript: (...args: any[]) => void = (
  storageKey,
  defaultTheme,
  forcedTheme
) => {
  const el = document.documentElement

  function updateDOM(theme: string) {
    el.classList.remove('light', 'dark')
    el.classList.add(theme)
  }

  if (forcedTheme) {
    updateDOM(forcedTheme)
  } else {
    try {
      let theme = localStorage.getItem(storageKey) || defaultTheme
      theme =
        theme === 'light' || theme === 'dark' || theme === 'auto'
          ? theme
          : defaultTheme
      theme =
        theme === 'auto'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : theme
      updateDOM(theme)
    } catch {}
  }
}
