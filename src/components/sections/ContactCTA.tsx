import Link from 'next/link'

export function ContactCTA() {
  return (
    <section className="py-24">
      <div className="container-rs">
        <div className="bg-rs-dark border border-rs-border p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <p className="section-label mb-4">Ready to broadcast?</p>
            <h2 className="text-headline font-bold text-rs-white mb-4">
              Let&apos;s put your event<br />
              <span className="text-rs-yellow">on screen.</span>
            </h2>
            <p className="text-rs-muted text-sm leading-relaxed">
              Whether you need a full broadcast package, live event support, or studio time —
              our team is ready. Get in touch and we&apos;ll find the right format for you.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link href="/contact" className="btn-primary">
              Contact us
            </Link>
            <Link href="/services" className="btn-outline text-center">
              View services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
