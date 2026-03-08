import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Broadcast production, live events, and studio shows — professional simracing coverage from Cologne.',
}

const SERVICES = [
  {
    number: '01',
    title: 'Broadcast Production',
    tagline: 'Online & TV — at scale.',
    description:
      'We produce over 200 broadcast events per year across all major sim racing titles. From single-race streams to full-season championship coverage, our team delivers broadcast-grade quality for online platforms and TV networks.',
    details: [
      'Multi-language live commentary (DE, EN, FI, DA, NO, PT, ES, KO)',
      'Custom graphics packages and overlays',
      'TV network distribution (Eurosport, Sport 1, MotorsTV)',
      'Post-production and highlight packages',
      'YouTube channel management',
      '2.5M+ YouTube views track record',
    ],
  },
  {
    number: '02',
    title: 'Live Events',
    tagline: 'We handle the complexity.',
    description:
      'Organizing live sim racing events requires precise logistics. We manage the full setup — from hardware procurement and transport to on-site AV infrastructure and broadcast operations.',
    details: [
      'Full event logistics and management',
      'Racing hardware setup (rigs, screens, peripherals)',
      'Audio/video broadcast infrastructure',
      'On-site technical crew',
      'Live audience productions up to 1,500 attendees',
      'Reference: RACE WEEK 2026 (July, Cologne)',
    ],
  },
  {
    number: '03',
    title: 'Studio Shows',
    tagline: 'Our studio, your production.',
    description:
      'Our modular studio in Cologne is the perfect backdrop for any production. Panel shows, product reveals, corporate content, or training videos — we configure the space to your needs.',
    details: [
      'Modular studio setup in Cologne',
      'Green screen and virtual sets available',
      'Full AV crew and director on request',
      'Lighting and sound design',
      'Livestream output or recorded production',
      'Flexible day/week rental',
    ],
  },
  {
    number: '04',
    title: 'Hardware & Event Support',
    tagline: 'Technical backbone for any event.',
    description:
      'Need gear on-site without the production complexity? We supply, transport, and configure professional sim racing hardware for your event — and stay on-site to make sure it runs flawlessly.',
    details: [
      'Sim racing rig fleet (various configurations)',
      'Screens, stands, and cable management',
      'On-site technical support',
      'Event-day troubleshooting',
      'Available for exhibitions, brand activations, trade shows',
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-24">
      <div className="container-rs py-16">
        <p className="section-label mb-3">What we offer</p>
        <h1 className="text-headline font-bold text-rs-white mb-4">Services</h1>
        <p className="text-rs-muted max-w-xl mb-16">
          10+ years of sim racing production experience. Whether you need a full broadcast team
          or just hardware support, we have a solution.
        </p>

        <div className="space-y-px">
          {SERVICES.map((s) => (
            <details
              key={s.number}
              className="group border border-rs-border bg-rs-black open:bg-rs-dark transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 p-8 cursor-pointer list-none">
                <div className="flex items-center gap-6">
                  <span className="text-rs-border font-mono text-sm group-open:text-rs-yellow/50 transition-colors">
                    {s.number}
                  </span>
                  <div>
                    <h2 className="text-rs-white font-semibold text-xl group-open:text-rs-yellow transition-colors">
                      {s.title}
                    </h2>
                    <p className="text-rs-muted text-sm mt-0.5">{s.tagline}</p>
                  </div>
                </div>
                <span className="text-rs-muted text-2xl font-light group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <div className="px-8 pb-8">
                <div className="border-t border-rs-border pt-8 grid md:grid-cols-2 gap-8">
                  <p className="text-rs-muted leading-relaxed">{s.description}</p>
                  <ul className="space-y-2.5">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-rs-muted">
                        <span className="w-1 h-1 rounded-full bg-rs-yellow mt-2 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-rs-muted mb-6">Ready to talk about your project?</p>
          <Link href="/contact" className="btn-primary">
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  )
}
