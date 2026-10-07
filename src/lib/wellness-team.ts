import type { ContactRole } from '@rajs8952/interventions'

/*
 * The Wellness Corner support team, used by the Hub and by the alerts the
 * intervention engine raises. A contact left as null shows as "coming soon",
 * so nothing made up ever reaches members.
 */

export interface WellnessContact {
  id: ContactRole
  name: string
  description: string
  /** Shown as written; dialled as digits only. */
  phone: string | null
  email: string | null
  /** Booking page or intranet link. */
  url: string | null
}

export const WELLNESS_TEAM: WellnessContact[] = [
  {
    id: 'eap',
    name: 'Employee Assistance Programme',
    description: 'Support with work, family, money or legal worries.',
    phone: '+91 98751 08108',
    email: 'eap@thewellnesscorner.com',
    url: null,
  },
  {
    id: 'therapist',
    name: 'Therapist',
    description: 'One-to-one sessions for stress, anxiety, low mood or burnout.',
    phone: '+91 98751 08108',
    email: 'eap@thewellnesscorner.com',
    url: null,
  },
  {
    id: 'dietitian',
    name: 'Dietitian',
    description: 'Personal advice on eating, energy and healthy weight.',
    phone: null,
    email: 'dietitian@thewellnesscorner.com',
    url: null,
  },
]

/** Local emergency number, shown in the crisis alert (112 in India and the EU). */
export const EMERGENCY_NUMBER: string | null = '112'

export const WELLNESS_BY_ID = Object.fromEntries(WELLNESS_TEAM.map((c) => [c.id, c])) as Record<ContactRole, WellnessContact>

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** call → phone; chat/book → booking link, then email, then phone. Null when there are no details yet. */
export function contactHref(id: ContactRole, kind: 'call' | 'chat' | 'book'): string | null {
  const c = WELLNESS_BY_ID[id]
  const phone = c.phone ? telHref(c.phone) : null
  const email = c.email ? `mailto:${c.email}` : null
  return kind === 'call' ? phone : (c.url ?? email ?? phone)
}
