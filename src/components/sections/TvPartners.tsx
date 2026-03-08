const PARTNERS = ['Eurosport', 'Sport 1', 'MotorsTV', 'iRacing', 'Porsche', 'BMW']

export function TvPartners() {
  return (
    <section className="py-16 border-y border-rs-border">
      <div className="container-rs">
        <p className="text-center text-rs-muted text-xs tracking-[0.2em] uppercase mb-10">
          Trusted by leading brands & broadcasters
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {PARTNERS.map((name) => (
            <span
              key={name}
              className="text-rs-muted/50 text-sm font-semibold tracking-widest uppercase hover:text-rs-yellow/70 transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
