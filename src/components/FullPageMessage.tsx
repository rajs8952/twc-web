/** A centred one-liner for loading and redirect states. */
export function FullPageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6 text-muted" aria-live="polite">
      {children}
    </div>
  )
}
