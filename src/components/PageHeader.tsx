import type { LucideIcon } from 'lucide-react'

/** A tracker page's title, with its icon on a tile of its accent colour. */
export function PageHeader({ title, description, icon: Icon, accent }: { title: string; description: string; icon: LucideIcon; accent: string }) {
  return (
    <header className="mb-6 flex items-center gap-4 sm:mb-8">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: accent }}>
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-0.5 text-muted">{description}</p>
      </div>
    </header>
  )
}
