import { evaluateMetric, moodInterventionKey, type Intervention } from '@rajs8952/interventions'
import { MoodTracker } from '@rajs8952/tracker-mood'
import { useState } from 'react'
import { InterventionBanner } from '@/components/InterventionBanner'
import { useDismissed } from '@/lib/use-dismissed'

/** The Mood tracker plus the crisis prompt, which opens as soon as a check-in calls for it. */
export function MoodWithSupport() {
  const [crisis, setCrisis] = useState<Intervention | null>(null)
  const { dismiss } = useDismissed()
  return (
    <MoodTracker
      onCheckIn={(input) => {
        const check = evaluateMetric({ type: 'mood', value: input.mood_state })
        if (check.severity === 'CRITICAL') setCrisis(check)
      }}
      banner={
        <InterventionBanner
          intervention={crisis}
          onDismiss={() => {
            // Also counts for the Hub, so the same prompt doesn't greet them there today.
            if (crisis) dismiss(moodInterventionKey(crisis))
            setCrisis(null)
          }}
        />
      }
    />
  )
}
