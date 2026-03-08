import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Upcoming sim racing broadcasts and live events — schedule and stream links.',
}

// In production: fetched from Google Sheets API
// Columns: Name, Sim, Organizer, Format, Stream Link, Date
const MOCK_EVENTS = [
  { date: '2026-03-15', name: 'iRacing Porsche Cup — Round 4',         sim: 'iRacing',         format: 'Live Stream', link: '#' },
  { date: '2026-03-22', name: 'AC EVO World Series — Round 2',          sim: 'AC EVO',          format: 'Live Stream', link: '#' },
  { date: '2026-04-05', name: 'VCO Pro Series — Spring Final',          sim: 'rFactor 2',       format: 'TV + Stream', link: '#' },
  { date: '2026-04-12', name: 'BMW Sim Cup — Round 3',                  sim: 'iRacing',         format: 'Live Stream', link: '#' },
  { date: '2026-04-19', name: 'EuroRC Virtual Championship — R5',       sim: 'Assetto Corsa',   format: 'Live Stream', link: '#' },
  { date: '2026-05-03', name: 'iRacing World Championship — Rd 7',      sim: 'iRacing',         format: 'TV + Stream', link: '#' },
  { date: '2026-05-17', name: 'Sim Racing Summit Cologne',              sim: 'Multi-Sim',       format: 'Live Event',  link: '#' },
  { date: '2026-07-08', name: 'RACE WEEK 2026 — Opening Day',           sim: 'Multi-Sim',       format: 'Live Event',  link: '#' },
]

const FORMAT_COLORS: Record<string, string> = {
  'Live Stream': 'text-green-400',
  'TV + Stream': 'text-rs-yellow',
  'Live Event':  'text-red-400',
}

export default function CalendarPage() {
  const grouped = MOCK_EVENTS.reduce<Record<string, typeof MOCK_EVENTS>>((acc, event) => {
    const month = new Date(event.date).toLocaleString('en', { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(event)
    return acc
  }, {})

  return (
    <div className="pt-24">
      <div className="container-rs py-16">
        <p className="section-label mb-3">Schedule</p>
        <h1 className="text-headline font-bold text-rs-white mb-4">Calendar</h1>
        <p className="text-rs-muted max-w-xl mb-12">
          All upcoming Racespot broadcasts and live events. Stream links go live on event day.
        </p>

        {Object.entries(grouped).map(([month, events]) => (
          <div key={month} className="mb-12">
            <h2 className="text-rs-yellow text-xs tracking-[0.2em] uppercase mb-4 pb-3 border-b border-rs-border">
              {month}
            </h2>
            <div className="space-y-px">
              {events.map((event) => (
                <div
                  key={event.name}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-4 -mx-4
                             hover:bg-rs-dark transition-colors border-b border-rs-border/50"
                >
                  <div>
                    <p className="text-rs-white font-medium text-sm">{event.name}</p>
                    <p className="text-rs-muted text-xs mt-0.5">
                      {new Date(event.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <p className="text-rs-muted text-sm self-center hidden md:block">{event.sim}</p>
                  <p className={`text-sm self-center font-medium ${FORMAT_COLORS[event.format] ?? 'text-rs-muted'}`}>
                    {event.format}
                  </p>
                  <div className="self-center text-right">
                    {event.link !== '#' ? (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-rs-yellow hover:underline"
                      >
                        Watch →
                      </a>
                    ) : (
                      <span className="text-xs text-rs-muted/50">TBA</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
