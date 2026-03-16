const PARTNERS = ['Eurosport', 'Sport 1', 'MotorsTV', 'iRacing', 'Porsche', 'BMW', 'Assetto Corsa']

export function TvPartners() {
  return (
    <section className="section">
      <div className="container-rs">
        <p className="section-label mb-2">Trusted By</p>
        <h2 className="section-title mb-10">Partners & Networks</h2>

        <div className="flex flex-wrap justify-center items-center gap-5">
          {PARTNERS.map((name) => (
            <span
              key={name}
              className="bg-rs-dark border border-rs-border rounded-rs px-8 py-5
                         font-display font-bold text-[16px] text-rs-muted
                         hover:border-rs-yellow hover:text-white
                         transition-all duration-200 cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
