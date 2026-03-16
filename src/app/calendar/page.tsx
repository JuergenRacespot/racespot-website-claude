import type { Metadata } from 'next'
import { getCalendarEvents } from '@/lib/sheets'
import { CalendarClient } from '@/components/sections/CalendarClient'
import { T } from '@/components/ui/T'

/* Refresh calendar data every 5 minutes */
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Calendar — Racespot.tv',
  description: 'Upcoming sim racing broadcasts and live events — schedule and stream links.',
}

export default async function CalendarPage() {
  const events = await getCalendarEvents()

  return (
    <div className="pt-8">
      <div className="container-rs-wide py-8">
        <p className="section-label mb-3"><T k="calendar.label" /></p>
        <h1 className="display-title mb-4"><T k="calendar.title" /></h1>
        <p className="text-rs-muted max-w-xl mb-8">
          <T k="calendar.intro" />
        </p>

        {/* Interactive calendar (client component) */}
        <CalendarClient events={events} />
      </div>
    </div>
  )
}
