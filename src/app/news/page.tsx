import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news, insights, and updates from Racespot — the simracing broadcast team.',
}

// In production: fetched from Strapi CMS
const ARTICLES = [
  {
    slug: 'race-week-2026-announced',
    category: 'Events',
    title: 'RACE WEEK 2026: Europe\'s Biggest Simracing Festival Comes to Cologne',
    excerpt: 'From July 8–12, Cologne becomes the center of virtual motorsport. Racespot announces RACE WEEK 2026 — combining esports competition, automotive innovation, and live entertainment.',
    date: '2026-03-01',
    readTime: '3 min',
  },
  {
    slug: 'how-we-broadcast-iracing-wc',
    category: 'Behind the Scenes',
    title: 'How We Broadcast the iRacing World Championship',
    excerpt: 'A look behind the scenes of producing 200+ hours of live coverage for the world\'s most prestigious virtual racing championship.',
    date: '2026-02-18',
    readTime: '5 min',
  },
  {
    slug: 'simracing-tv-partnerships',
    category: 'Industry',
    title: 'Why Simracing is Winning on Traditional TV',
    excerpt: 'Eurosport, Sport 1, MotorsTV — traditional broadcasters are embracing simracing. We break down why, and what it means for the industry.',
    date: '2026-02-05',
    readTime: '4 min',
  },
  {
    slug: 'racespot-10-years',
    category: 'Company',
    title: '10 Years of Racespot: From Passion Project to World Leader',
    excerpt: 'A decade of sim racing broadcasts. Philip Stamm reflects on how Racespot grew from a community stream to 400+ events per year.',
    date: '2026-01-15',
    readTime: '7 min',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Events:             'text-rs-yellow',
  'Behind the Scenes':'text-green-400',
  Industry:           'text-blue-400',
  Company:            'text-purple-400',
}

export default function NewsPage() {
  const [featured, ...rest] = ARTICLES

  return (
    <div className="pt-24">
      <div className="container-rs py-16">
        <p className="section-label mb-3">Latest</p>
        <h1 className="text-headline font-bold text-rs-white mb-12">News</h1>

        {/* Featured */}
        <Link href={`/news/${featured.slug}`} className="group block mb-16">
          <div className="bg-rs-dark border border-rs-border p-8 md:p-12 hover:border-rs-yellow/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-mono ${CATEGORY_COLORS[featured.category] ?? 'text-rs-muted'}`}>
                {featured.category}
              </span>
              <span className="text-rs-border">·</span>
              <span className="text-rs-muted text-xs">{featured.date}</span>
              <span className="text-rs-border">·</span>
              <span className="text-rs-muted text-xs">{featured.readTime} read</span>
            </div>
            <h2 className="text-rs-white text-2xl md:text-3xl font-bold mb-4 group-hover:text-rs-yellow transition-colors leading-snug">
              {featured.title}
            </h2>
            <p className="text-rs-muted max-w-2xl leading-relaxed">{featured.excerpt}</p>
            <p className="mt-6 text-rs-yellow text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
              Read article →
            </p>
          </div>
        </Link>

        {/* Article list */}
        <div className="space-y-px">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group flex flex-col md:flex-row md:items-start gap-4 py-6 border-b border-rs-border hover:bg-rs-dark px-4 -mx-4 transition-colors"
            >
              <div className="flex items-center gap-3 shrink-0 w-40">
                <span className={`text-xs font-mono ${CATEGORY_COLORS[article.category] ?? 'text-rs-muted'}`}>
                  {article.category}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-rs-white font-semibold group-hover:text-rs-yellow transition-colors mb-1">
                  {article.title}
                </h3>
                <p className="text-rs-muted text-sm line-clamp-2">{article.excerpt}</p>
              </div>
              <div className="text-rs-muted text-xs shrink-0 text-right">
                <p>{article.date}</p>
                <p className="mt-0.5">{article.readTime} read</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
