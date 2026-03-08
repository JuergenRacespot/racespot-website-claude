import Link from 'next/link'

const SERVICES = [
  {
    id: 'broadcast',
    label: '01',
    title: 'Broadcast Production',
    description:
      'Full-service live production for online and TV. 200+ events per year across iRacing, Assetto Corsa, rFactor, and more. TV-ready output for Eurosport, Sport 1, and MotorsTV.',
    features: ['Multi-language commentary', 'TV network partnerships', 'Custom graphics packages', 'VOD production'],
    href: '/broadcasts',
  },
  {
    id: 'events',
    label: '02',
    title: 'Live Events',
    description:
      'End-to-end event management for sim racing live events. We handle the full logistics — from hardware setup to audio/visual broadcast infrastructure.',
    features: ['On-site AV setup', 'Hardware provisioning', 'Broadcast logistics', 'Event management'],
    href: '/events',
  },
  {
    id: 'studio',
    label: '03',
    title: 'Studio Shows',
    description:
      'Our modular studio in Cologne is fully equipped for your next production. Adaptable to any format — panel shows, product launches, corporate content.',
    features: ['Cologne studio', 'Modular setup', 'Green screen available', 'Full AV crew'],
    href: '/services',
  },
]

export function Services() {
  return (
    <section className="py-24">
      <div className="container-rs">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="section-label mb-3">What we do</p>
            <h2 className="text-headline font-bold text-rs-white">
              Three pillars,<br />one team
            </h2>
          </div>
          <Link href="/services" className="hidden sm:flex btn-outline text-xs">
            All services
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-rs-border">
          {SERVICES.map((s) => (
            <div key={s.id} className="bg-rs-black p-8 group hover:bg-rs-dark transition-colors duration-300">
              <span className="text-rs-border text-xs font-mono group-hover:text-rs-yellow/50 transition-colors">
                {s.label}
              </span>

              <h3 className="text-rs-white text-xl font-semibold mt-4 mb-3 group-hover:text-rs-yellow transition-colors duration-300">
                {s.title}
              </h3>

              <p className="text-rs-muted text-sm leading-relaxed mb-6">
                {s.description}
              </p>

              <ul className="space-y-2 mb-8">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-rs-muted">
                    <span className="w-1 h-1 rounded-full bg-rs-yellow shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={s.href}
                className="text-xs text-rs-yellow font-medium tracking-wide uppercase hover:underline"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
