import { BmiCalculator } from '@rajs8952/tracker-bmi'
import { TrackerPage } from '@/components/TrackerPage'

export default function BmiPage() {
  return (
    <TrackerPage id="bmi">
      <BmiCalculator />
    </TrackerPage>
  )
}
