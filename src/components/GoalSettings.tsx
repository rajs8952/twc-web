import { useState } from 'react'
import type { Profile } from '@rajs8952/core'
import { ActivityPicker, GenderPicker, GoalPreview, useTrackerStorage, WeightInput } from '@rajs8952/ui'

/** The details the daily water goal is calculated from. */
export function GoalSettings({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const storage = useTrackerStorage()
  const [weightKg, setWeightKg] = useState(profile.weight_kg)
  const [gender, setGender] = useState(profile.gender)
  const [activity, setActivity] = useState(profile.activity_level)
  const [saved, setSaved] = useState(false)
  const edited = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setSaved(false)
  }

  async function save() {
    onSaved(await storage.profile.update(profile.id, { weight_kg: weightKg, gender, activity_level: activity }))
    setSaved(true)
  }

  return (
    <section className="space-y-5 rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
      <WeightInput kg={weightKg} onChange={edited(setWeightKg)} />
      <GenderPicker value={gender} onChange={edited(setGender)} />
      <ActivityPicker value={activity} onChange={edited(setActivity)} />
      <GoalPreview weightKg={weightKg} gender={gender} activity={activity} />
      <button type="button" onClick={save} className="omni-btn-primary w-full">
        Save goal
      </button>
      {saved && <p role="status" className="omni-notice-ok">Saved. Your daily goal now uses these details.</p>}
    </section>
  )
}
