import { WaterGarden, WaterStats, WaterTracker } from '@rajs8952/tracker-water'
import { useStoredProfile } from '@rajs8952/ui'
import { useState } from 'react'
import { GoalSettings } from './GoalSettings'

const TABS = ['Today', 'Stats', 'Garden', 'Goal'] as const
type Tab = (typeof TABS)[number]

/** Water's four views; the tracker storage comes from the member's provider. */
export function WaterApp() {
  const [tab, setTab] = useState<Tab>('Today')
  const { profile, setProfile } = useStoredProfile()

  return (
    <>
      <nav aria-label="Water sections" className="mb-6 inline-flex rounded-full bg-white p-1 ring-1 ring-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === t ? 'bg-tide-500 text-white' : 'text-muted hover:text-ink'}`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === 'Today' && <WaterTracker profile={profile} />}
      {tab === 'Stats' && <WaterStats />}
      {tab === 'Garden' && <WaterGarden />}
      {tab === 'Goal' && profile && <GoalSettings profile={profile} onSaved={setProfile} />}
    </>
  )
}
