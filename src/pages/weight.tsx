import { WeightTracker } from '@rajs8952/tracker-weight'
import { useStoredProfile } from '@rajs8952/ui'
import { TrackerPage } from '@/components/TrackerPage'

export default function WeightPage() {
  return (
    <TrackerPage id="weight">
      <Weight />
    </TrackerPage>
  )
}

/** Weigh-ins can also update the profile weight the water goal uses. */
function Weight() {
  const { profile, setProfile } = useStoredProfile()
  return (
    <WeightTracker
      profileWeightKg={profile?.weight_kg}
      onProfileWeightChange={(kg) => setProfile((p) => (p ? { ...p, weight_kg: kg } : p))}
    />
  )
}
