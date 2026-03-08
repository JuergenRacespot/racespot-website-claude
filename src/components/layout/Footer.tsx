import Link from 'next/link'

const LINKS = {
  Services: [
    { href: '/broadcasts', label: 'Broadcasts' },
    { href: '/events',     label: 'Live Events' },
    { href: '/services',   label: 'Studio Shows' },
    { href: '/services',   label: 'Hardware Support' },
  ],
  Company: [
    { href: '/about',   label: 'About Us' },
    { href: '/news',    label: 'News' },
    { href: '/calendar',label: 'Calendar' },
    { href: '/contact', label: 'Contact' },
  ],
  Watch: [
    { href: '/live',  label: 'Live Now' },
    { href: 'https://youtube.com/@Racespot', label: 'YouTube' },
    { href: '/broadcasts', label: 'Archive' },
  ],
}

const SOCIAL = [
  { href: 'https://youtube.com/@Racespot',  label: 'YouTube' },
  { href: 'https://twitter.com/Racespot',   label: 'X / Twitter' },
  { href: 'https://twitch.tv/racespot',     label: 'Twitch' },
  { href: 'https://instagram.com/racespot', label: 'Instagram' },
]

export function Footer() {
  return (
    <footer className="bg-rs-dark border-t border-rs-border mt-24">
      <div className="container-rs py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-baseline gap-1.5 mb-4">
              <span className="text-rs-yellow font-bold text-2xl tracking-tight">RACESPOT</span>
              <span className="text-rs-muted text-sm font-mono">.tv</span>
            </Link>
            <p className="text-rs-muted text-sm leading-relaxed max-w-xs mt-3">
              The world&apos;s leading simracing broadcaster. 400+ live events per year from our
              studio in Cologne.
            </p>
            <div className="flex gap-4 mt-6">
              {SOCIAL.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rs-muted text-xs hover:text-rs-yellow transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="section-label mb-4">{category}</p>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-rs-muted text-sm hover:text-rs-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-rs-muted text-xs">
          <p>© {new Date().getFullYear()} Racespot GmbH. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-rs-white transition-colors">Privacy</Link>
            <Link href="/imprint" className="hover:text-rs-white transition-colors">Imprint</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
