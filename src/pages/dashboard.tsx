import { addDays, greeting, startOfDay } from '@rajs8952/core/dates'
import { errorMessage } from '@rajs8952/core/errors'
import { exerciseRange } from '@rajs8952/core/exercise'
import { effectiveGoal } from '@rajs8952/core/hydration'
import { meditationRange } from '@rajs8952/core/meditation'
import { moodRange } from '@rajs8952/core/mood'
import { sleepRange } from '@rajs8952/core/sleep'
import { weightRange } from '@rajs8952/core/weight'
import { latestInterventions } from '@rajs8952/interventions'
import { hubSummaries, type HubSummary, type TrackerData } from '@rajs8952/trackers/hub'
import { TRACKERS, type TrackerId } from '@rajs8952/trackers/registry'
import { useStoredProfile, useTrackerStorage } from '@rajs8952/ui'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { HubCard } from '@/components/HubCard'
import { InterventionBanner } from '@/components/InterventionBanner'
import { MemberShell, useMember } from '@/components/MemberShell'
import { WellnessTeam } from '@/components/WellnessTeam'
import { useDismissed } from '@/lib/use-dismissed'

/** The Hub: today's progress on every tracker, plus any alerts. */
export default function DashboardPage() {
  return (
    <MemberShell>
      <Hub />
    </MemberShell>
  )
}

function Hub() {
  const storage = useTrackerStorage()
  const { profile, error: profileError } = useStoredProfile()
  const { firstName } = useMember()
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null)
  const [waterMl, setWaterMl] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    const now = new Date()
    Promise.all([
      storage.mood.list(moodRange(now)),
      storage.meditation.list(meditationRange(now)),
      storage.sleep.list(sleepRange(now)),
      storage.weight.list(weightRange(now)),
      storage.exercise.list(exerciseRange(now)),
    ])
      .then(([mood, meditation, sleep, weight, exercise]) => alive && setTrackerData({ mood, meditation, sleep, weight, exercise }))
      .catch((e) => {
        if (!alive) return
        const failed = { ok: false as const, error: errorMessage(e) }
        setTrackerData({ mood: failed, meditation: failed, sleep: failed, weight: failed, exercise: failed })
      })
    const today = startOfDay(now)
    storage.water
      .list(today, addDays(today, 1))
      .then((logs) => alive && setWaterMl(logs.reduce((s, l) => s + l.effective_ml, 0)))
      .catch(() => alive && setWaterMl(-1))
    return () => {
      alive = false
    }
  }, [storage])

  const summaries: Partial<Record<TrackerId, HubSummary>> = useMemo(() => {
    if (!trackerData || waterMl === null || !profile) return {}
    const water = waterMl < 0 ? null : { todayMl: waterMl, goalMl: effectiveGoal(profile) }
    return hubSummaries(trackerData, water)
  }, [trackerData, waterMl, profile])

  // Alerts from the latest mood, sleep and weight; each can be dismissed (or, if critical, acknowledged) once.
  const { isDismissed, dismiss, ready } = useDismissed()
  const interventions = useMemo(() => {
    if (!trackerData || !profile) return []
    const data = <T,>(r: { ok: true; data: T[] } | { ok: false }) => (r.ok ? r.data : undefined)
    return latestInterventions({ mood: data(trackerData.mood), sleep: data(trackerData.sleep), weight: data(trackerData.weight) }, profile)
  }, [trackerData, profile])
  const visible = ready ? interventions.filter((i) => !isDismissed(i.key)) : []
  const crisis = visible.find((i) => i.severity === 'CRITICAL') ?? null
  const banners = visible.filter((i) => i.severity !== 'CRITICAL')

  const now = new Date()
  const loaded = Object.keys(summaries).length > 0
  const doneCount = TRACKERS.filter((t) => summaries[t.id]?.done).length

  return (
    <>
      <header className="mb-6 sm:mb-8">
        <p className="text-sm font-semibold text-muted">{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {greeting(now)}
          {firstName ? `, ${firstName}` : ''}
        </h1>
      </header>

      {profileError && <p role="alert" className="omni-notice-error mb-6">{profileError}</p>}

      <InterventionBanner intervention={crisis} onDismiss={() => crisis && dismiss(crisis.key)} />
      <div className={banners.length ? 'mb-6 space-y-3' : undefined}>
        <AnimatePresence initial={false}>
          {banners.map((i) => (
            <InterventionBanner key={i.key} intervention={i} onDismiss={() => dismiss(i.key)} />
          ))}
        </AnimatePresence>
      </div>

      <section aria-labelledby="today-title" className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <h2 id="today-title" className="text-lg font-bold">
          Today
        </h2>
        <p className="flex items-center gap-2 text-sm font-semibold text-muted" aria-live="polite">
          {loaded ? (
            <>
              <span className="flex gap-1" aria-hidden>
                {TRACKERS.map((t) => (
                  <span key={t.id} className="h-2 w-5 rounded-full" style={{ background: summaries[t.id]?.done ? t.accent : '#D3E2E0' }} />
                ))}
              </span>
              {doneCount} of {TRACKERS.length} done
            </>
          ) : (
            'Loading…'
          )}
        </p>
      </section>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {TRACKERS.map((t) => (
          <li key={t.id}>
            <HubCard tracker={t} summary={summaries[t.id] ?? null} />
          </li>
        ))}
      </ul>

      <section id="wellness-team" aria-labelledby="wellness-team-title" className="mt-10 scroll-mt-20">
        <div className="mb-4">
          <h2 id="wellness-team-title" className="text-lg font-bold">
            Your wellness team
          </h2>
          <p className="text-sm text-muted">Your company’s therapist, dietitian and employee assistance programme, here when you need them.</p>
        </div>
        <WellnessTeam />
      </section>
    </>
  )
}
