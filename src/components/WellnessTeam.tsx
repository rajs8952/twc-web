import { Mail, Phone } from 'lucide-react'
import { EMERGENCY_NUMBER, WELLNESS_TEAM, telHref } from '@/lib/wellness-team'

/** The support team's contact details. */
export function WellnessTeam() {
  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {WELLNESS_TEAM.map((c) => (
          <li key={c.id} className="rounded-3xl bg-white p-4 ring-1 ring-line">
            <p className="font-bold">{c.name}</p>
            <p className="mt-0.5 text-sm text-muted">{c.description}</p>
            <div className="mt-3 space-y-1 text-sm font-semibold">
              {c.phone && (
                <a href={telHref(c.phone)} className="flex items-center gap-2 text-tide-700 hover:underline">
                  <Phone className="h-4 w-4" aria-hidden /> {c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 break-all text-tide-700 hover:underline">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden /> {c.email}
                </a>
              )}
              {!c.phone && !c.email && !c.url && <p className="text-muted">Details coming soon</p>}
            </div>
          </li>
        ))}
      </ul>
      {EMERGENCY_NUMBER && (
        <p className="mt-4 text-sm text-muted">
          In an emergency, call <a href={telHref(EMERGENCY_NUMBER)} className="font-bold text-ink underline">{EMERGENCY_NUMBER}</a>.
        </p>
      )}
    </>
  )
}
