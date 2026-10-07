import { ExerciseTracker } from '@rajs8952/tracker-exercise'
import { useStoredProfile } from '@rajs8952/ui'
import { TrackerPage } from '@/components/TrackerPage'

export default function ExercisePage() {
  return (
    <TrackerPage id="exercise">
      <Exercise />
    </TrackerPage>
  )
}

/** Calorie estimates use the profile weight. */
function Exercise() {
  const { profile } = useStoredProfile()
  return <ExerciseTracker profileWeightKg={profile?.weight_kg} />
}
