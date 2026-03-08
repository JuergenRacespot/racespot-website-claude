import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past live sim racing events — including RACE WEEK 2026 in Cologne.',
}

const UPCOMING_EVENTS = [
  {
    slug: 'race-week-2026',
    name: 'RACE WEEK 2026',
    date: '08 – 12 July 2026',
    location: 'Cologne, Germany',
    description:
      "Europe's new festival of virtual motorsport. Esports competition, automotive innovation, and live entertainment for up to 1,500 visitors.",
    tags: ['Festival', 'Live Event', 'Esports'],
    highlight: true,
  },
]

const PAST_EVENTS = [
  { name: 'iRacing World Championship Finals 2025', date: 'Dec 2025', location: 'Cologne Studio' },
  { name: 'Porsche Sim Racing Summit 2025',         date: 'Oct 2025', location: 'Cologne' },
  { name: 'BMW SIM Live Event 2025',                date: 'Sep 2025', location: 'Munich' },
  { name: 'EuroRC Virtual Series Finals',           date: 'Aug 2025', location: 'Online' },
]

export default function EventsPage() {
  return (
    <div className="pt-24">
      <div className="container-rs py-16">
        <p className="section-label mb-3">What's happening</p>
        <h1 className="text-headline font-bold text-rs-white mb-12">Events</h1>

        {/* Upcoming */}
        <h2 className="text-rs-yellow text-xs tracking-[0.2em] uppercase mb-6">Upcoming</h2>
        <div className="space-y-4 mb-20">
          {UPCOMING_EVENTS.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group block bg-rs-yellow text-rs-black p-8 hover:bg-white transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.tags.map((t) => (
                      <span key={t} className="text-xs font-mono bg-rs-black text-rs-yellow px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  <p className="text-rs-black/70 text-sm max-w-lg">{event.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold">{event.date}</p>
                  <p className="text-rs-black/70 text-sm">{event.location}</p>
                  <p className="mt-3 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    Event details →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Past events */}
        <h2 className="text-rs-yellow text-xs tracking-[0.2em] uppercase mb-6">Past Events</h2>
        <div className="space-y-px">
          {PAST_EVENTS.map((event) => (
            <div
              key={event.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between
                         gap-2 py-4 border-b border-rs-border hover:bg-rs-dark px-4 -mx-4 transition-colors"
            >
              <p className="text-rs-white font-medium">{event.name}</p>
              <div className="flex gap-6 text-rs-muted text-sm shrink-0">
                <span>{event.location}</span>
                <span>{event.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
