import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTICLES, CATEGORY_COLORS } from '@/lib/articles'
import { ArticleJsonLd } from '@/components/seo/JsonLd'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Racespot.tv`,
      description: article.excerpt,
      type: 'article',
      images: [{ url: article.image, width: 1200, height: 630, alt: article.imageAlt }],
    },
    twitter: { card: 'summary_large_image', images: [article.image] },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) notFound()

  const idx = ARTICLES.indexOf(article)
  const prev = idx > 0 ? ARTICLES[idx - 1] : null
  const next = idx < ARTICLES.length - 1 ? ARTICLES[idx + 1] : null

  return (
    <div>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={article.date}
        slug={article.slug}
      />
      {/* Hero image */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rs-black via-rs-black/50 to-rs-black/10" />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rs-yellow via-rs-yellow/50 to-transparent" />
      </div>

      <div className="container-rs py-12">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-mono ${CATEGORY_COLORS[article.category] ?? 'text-rs-muted'}`}>
              {article.category}
            </span>
            <span className="text-rs-border">·</span>
            <span className="text-rs-muted text-xs">{article.date}</span>
            <span className="text-rs-border">·</span>
            <span className="text-rs-muted text-xs">{article.readTime} read</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight mb-8">
            {article.title}
          </h1>

          {/* Content */}
          <div className="space-y-6">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-rs-muted leading-relaxed text-[16px]">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-rs-border flex items-center justify-between gap-4">
            {prev ? (
              <Link href={`/news/${prev.slug}`} className="group text-left">
                <p className="text-xs text-rs-muted mb-1">← Previous</p>
                <p className="text-sm text-rs-white group-hover:text-rs-yellow transition-colors line-clamp-1">
                  {prev.title}
                </p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/news/${next.slug}`} className="group text-right">
                <p className="text-xs text-rs-muted mb-1">Next →</p>
                <p className="text-sm text-rs-white group-hover:text-rs-yellow transition-colors line-clamp-1">
                  {next.title}
                </p>
              </Link>
            ) : <div />}
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link href="/news" className="btn-ghost">
              ← All News
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
