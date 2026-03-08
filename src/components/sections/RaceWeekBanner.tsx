import Link from 'next/link'

export function RaceWeekBanner() {
  return (
    <section className="py-6">
      <div className="container-rs">
        <Link
          href="/events/race-week-2026"
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between
                     gap-4 bg-rs-yellow text-rs-black px-8 py-6 hover:bg-white transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono bg-rs-black text-rs-yellow px-2 py-1 shrink-0">
              UPCOMING
            </span>
            <div>
              <p className="font-bold text-lg leading-tight">RACE WEEK 2026</p>
              <p className="text-sm text-rs-black/70">
                08 – 12 July 2026 · Cologne, Germany · Up to 1,500 attendees
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
            Event details
            <span>→</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
