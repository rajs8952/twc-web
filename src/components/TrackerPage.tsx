import { TRACKERS, BMI_TOOL, type TrackerId } from '@rajs8952/trackers/registry'
import { TrackerBoundary } from '@rajs8952/ui'
import Head from 'next/head'
import { MemberShell } from '@/components/MemberShell'
import { PageHeader } from '@/components/PageHeader'

/** A tracker's page: members only, with its header and an error boundary around the tracker. */
export function TrackerPage({ id, children }: { id: TrackerId | 'bmi'; children: React.ReactNode }) {
  const t = id === 'bmi' ? { ...BMI_TOOL, id } : TRACKERS.find((x) => x.id === id)!
  return (
    <MemberShell>
      <Head>
        <title>{`${t.name} · TWC Wellness`}</title>
      </Head>
      <PageHeader title={t.name} description={t.description} icon={t.icon} accent={t.accent} />
      <TrackerBoundary name={t.name}>{children}</TrackerBoundary>
    </MemberShell>
  )
}
