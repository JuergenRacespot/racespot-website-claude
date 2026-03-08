const TEAM = [
  {
    name: 'Philip Stamm',
    role: 'CEO & Founder',
    bio: "Simracing pioneer since 1997. Built Racespot from a passion project into the world's leading sim racing broadcast company.",
    tag: 'Est. Racespot',
  },
  {
    name: 'Hugo L. C. Marins',
    role: 'Producer & Co-Founder',
    bio: 'iRacing World Champion 2011. Oversees production for 400+ broadcasts per year. Brings competitive insight to every broadcast.',
    tag: 'iRW Champion 2011',
  },
  {
    name: 'Aaron von Lüpke',
    role: 'Head of Sales',
    bio: 'Sponsorship and partnerships expert. Connects brands to sim racing\'s fast-growing, tech-savvy audience.',
    tag: 'Partnerships',
  },
]

export function Team() {
  return (
    <section className="py-24">
      <div className="container-rs">
        <p className="section-label mb-3">The people behind the mic</p>
        <h2 className="text-headline font-bold text-rs-white mb-16">Our team</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {TEAM.map((person) => (
            <div key={person.name} className="relative">
              {/* Placeholder avatar */}
              <div className="w-16 h-16 bg-rs-gray border border-rs-border rounded-full mb-6 flex items-center justify-center">
                <span className="text-rs-muted text-xl font-bold">{person.name[0]}</span>
              </div>

              <span className="section-label text-rs-muted/60 text-[10px] mb-2 block">
                {person.tag}
              </span>

              <h3 className="text-rs-white font-semibold text-lg">{person.name}</h3>
              <p className="text-rs-yellow text-sm mb-3">{person.role}</p>
              <p className="text-rs-muted text-sm leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
