import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Registry hook, rewritten the same way the carousel and the theme toggle
 * were: `set-state-in-effect` is a lint error here, so the media query is a
 * store subscription instead. Server snapshot is false, so the first paint
 * keeps the desktop config and hydration markup matches.
 */
export function useIsMobile(): boolean {
  const isMobile = React.useSyncExternalStore(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(
        `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
      )
      mediaQueryList.addEventListener("change", onStoreChange)
      return () => {
        mediaQueryList.removeEventListener("change", onStoreChange)
      }
    },
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches,
    () => false
  )

  return isMobile
}
