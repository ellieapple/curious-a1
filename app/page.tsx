import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import FluidBackground from "@/components/FluidBackground";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <FluidBackground />
      <Header />

      <main id="main" className="page">
        <span id="top" />

        {/* ===== HERO ===== */}
        <section className="hero wrap" aria-labelledby="hero-title">
          <p className="eyebrow">Growth Marketing Agency · Colorado-Born</p>
          <h1 className="display" id="hero-title">
            Marketing that moves with&nbsp;the terrain.
          </h1>
          <p className="lede">
            A1 is a Colorado-born growth marketing agency built to scale across every market and
            channel — brand, SEO &amp; AI search, performance media, and the systems that compound them.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Map your terrain <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a href="#services" className="btn btn-ghost">See our services</a>
          </div>
          <div className="scroll-cue">
            <span className="dot" />
            Scroll
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section className="band wrap cv-auto" id="services" aria-labelledby="services-title">
          <div className="band-head reveal">
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title" id="services-title">One team for the whole map.</h2>
            <p className="lede">
              Six disciplines, operated as a single system. No silos between the people who build
              your brand and the people who make it perform.
            </p>
          </div>
          <div className="services-grid reveal">
            <article className="service">
              <span className="idx">01</span>
              <h3>SEO &amp; AI Search</h3>
              <p>
                Topic-cluster strategy, technical health, structured data, and content engineered
                to rank in classic results and AI Overviews alike.
              </p>
              <div className="tags">
                <span>Technical SEO</span>
                <span>AI Overviews</span>
                <span>Local</span>
                <span>Content</span>
              </div>
            </article>
            <article className="service">
              <span className="idx">02</span>
              <h3>Brand &amp; Creative</h3>
              <p>
                Positioning, identity, and a verbal &amp; visual system distinctive enough to grow
                branded search and own a category.
              </p>
              <div className="tags">
                <span>Strategy</span>
                <span>Identity</span>
                <span>Messaging</span>
              </div>
            </article>
            <article className="service">
              <span className="idx">03</span>
              <h3>Performance Media</h3>
              <p>
                Paid search, social, and programmatic run against pipeline and revenue — not
                impressions. Creative testing on a weekly cadence.
              </p>
              <div className="tags">
                <span>Paid Search</span>
                <span>Paid Social</span>
                <span>Programmatic</span>
              </div>
            </article>
            <article className="service">
              <span className="idx">04</span>
              <h3>Web &amp; Product</h3>
              <p>
                Fast, accessible, conversion-first websites and product surfaces — engineered for
                Core Web Vitals and the people who use them.
              </p>
              <div className="tags">
                <span>Design</span>
                <span>Build</span>
                <span>Core Web Vitals</span>
              </div>
            </article>
            <article className="service">
              <span className="idx">05</span>
              <h3>Content &amp; Social</h3>
              <p>
                Editorial, video, and social built to grow mentions and word-of-mouth — the signals
                that lift every keyword you rank for.
              </p>
              <div className="tags">
                <span>Editorial</span>
                <span>Video</span>
                <span>Organic Social</span>
              </div>
            </article>
            <article className="service">
              <span className="idx">06</span>
              <h3>Analytics &amp; CRO</h3>
              <p>
                Clean measurement, attribution you can trust, and experimentation that turns the
                same traffic into more revenue.
              </p>
              <div className="tags">
                <span>Measurement</span>
                <span>Attribution</span>
                <span>Experimentation</span>
              </div>
            </article>
          </div>
        </section>

        {/* ===== TERRAINS ===== */}
        <section className="band wrap cv-auto" id="terrains" aria-labelledby="terrains-title">
          <div className="terrains">
            <div className="reveal">
              <p className="eyebrow">Across Terrains</p>
              <h2 className="section-title" id="terrains-title">
                Born on the Front Range. Built to travel.
              </h2>
              <p className="lede" style={{ marginTop: "1.4rem" }}>
                We started with Colorado businesses and never stopped moving. Today A1 runs growth
                programs across five regions — each with operators who actually know the ground.
              </p>
              <a href="#contact" className="btn btn-ghost" style={{ marginTop: "2rem" }}>
                Bring A1 to your market <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
            <div className="terrain-list reveal">
              {[
                { place: "Denver", meta: "Colorado · Front Range" },
                { place: "Salt Lake City", meta: "Utah · Mountain West" },
                { place: "Phoenix", meta: "Arizona · Desert Southwest" },
                { place: "Austin", meta: "Texas · Hill Country" },
                { place: "Seattle", meta: "Washington · Pacific Northwest" },
              ].map(({ place, meta }) => (
                <div className="terrain" key={place}>
                  <span className="place">{place}</span>
                  <span className="meta">{meta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== APPROACH ===== */}
        <section className="band wrap cv-auto" id="approach" aria-labelledby="approach-title">
          <div className="band-head reveal">
            <p className="eyebrow">How We Work</p>
            <h2 className="section-title" id="approach-title">
              A quarterly operating system, not a campaign.
            </h2>
            <p className="lede">
              We find your biggest constraint, ship against it, measure what moves, and adapt when
              the bottleneck shifts.
            </p>
          </div>
          <div className="steps reveal">
            {[
              { num: "01", title: "Diagnose", body: "We start where the funnel actually breaks — not with a keyword list. Audit, data, and a single clear constraint." },
              { num: "02", title: "Map", body: "A focused plan tied to revenue: the terrain, the route, and the few projects that will move the most." },
              { num: "03", title: "Build", body: "One team ships brand, search, media, and site in sync — fast, measurable, and built to last." },
              { num: "04", title: "Compound", body: "We review what moved, double down, and let authority and learnings stack quarter over quarter." },
            ].map(({ num, title, body }) => (
              <div className="step" key={num}>
                <span className="s-num">{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="band wrap cv-auto" id="faq" aria-labelledby="faq-title">
          <div className="faq-grid">
            <div className="reveal">
              <p className="eyebrow">FAQ</p>
              <h2 className="section-title" id="faq-title">Questions, answered.</h2>
            </div>
            <div className="faq-list reveal">
              {[
                {
                  q: "What does A1 Marketing do?",
                  a: "A1 is a full-service growth marketing agency. We build brand, SEO and AI search visibility, performance media, websites and products, content, and the analytics that tie them together — then operate them as one compounding system rather than disconnected campaigns.",
                  open: true,
                },
                {
                  q: "Where is A1 located, and what markets do you serve?",
                  a: "A1 is a Colorado-born growth agency. We still call the Front Range home, and today we run programs across the Mountain West, the Desert Southwest, Texas, and the Pacific Northwest — any terrain where our clients need to grow.",
                },
                {
                  q: "How do you approach SEO and AI search in 2026?",
                  a: "We start with diagnosis, not keywords: where the funnel leaks and which terms carry real intent. From there we build topic clusters, structured data, and genuinely useful content that earns E-E-A-T signals — so you show up in both classic search results and AI Overviews. Technical health and site speed are the foundation under all of it.",
                },
                {
                  q: "How long until we see results?",
                  a: "Technical fixes and paid media can move within weeks. Durable SEO and brand authority compound over months — most clients see meaningful organic traction in 6 to 12 months, with continued growth as authority builds. We report against business outcomes, not vanity metrics.",
                },
                {
                  q: "What does an engagement look like?",
                  a: "Most partnerships run as a quarterly operating system: we identify your biggest constraint, ship focused projects against it, measure what moves, and adapt when the bottleneck shifts. Engagements typically begin with a paid diagnostic sprint before an ongoing retainer.",
                },
                {
                  q: "What industries do you work with?",
                  a: "We focus on outdoor and consumer brands, B2B SaaS, healthcare, hospitality, and regional service businesses — categories where a strong brand plus disciplined search and media create durable advantage.",
                },
              ].map(({ q, a, open }) => (
                <details className="faq-item" key={q} open={open}>
                  <summary>
                    {q}
                    <span className="plus" aria-hidden="true" />
                  </summary>
                  <div className="answer">{a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="band wrap cta-band cv-auto" id="contact" aria-labelledby="cta-title">
          <div className="reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Start a project</p>
            <h2 id="cta-title">Let&apos;s map your terrain.</h2>
            <p className="lede">
              Tell us where you&apos;re trying to go. We&apos;ll come back with the constraint worth
              solving first — and what the first 90 days look like.
            </p>
            <div className="cta-actions">
              <a href="mailto:sales@evergreena1marketing.com" className="btn btn-primary">
                sales@evergreena1marketing.com <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer page" role="contentinfo">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="mark">
                A<sup style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "0.4em", top: "-1em", position: "relative" }}>1</sup>
              </span>
              <p>A Colorado-born growth marketing agency, built to scale across every terrain.</p>
            </div>
            <div className="foot-col">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">SEO &amp; AI Search</a></li>
                <li><a href="#services">Brand &amp; Creative</a></li>
                <li><a href="#services">Performance Media</a></li>
                <li><a href="#services">Web &amp; Product</a></li>
                <li><a href="#services">Analytics &amp; CRO</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Agency</h4>
              <ul>
                <li><a href="#terrains">Terrains</a></li>
                <li><a href="#approach">Approach</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Contact</h4>
              <address>
                Colorado, USA<br />
                <a href="mailto:sales@evergreena1marketing.com">sales@evergreena1marketing.com</a>
              </address>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} A1 Marketing — Across Terrains</p>
            <p>Denver · Salt Lake City · Phoenix · Austin · Seattle</p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <a
        href="mailto:sales@evergreena1marketing.com"
        className="mobile-cta-bar"
        aria-label="Email A1 Marketing"
      >
        ✉ Email us to start a project
      </a>

      <ScrollReveal />
    </>
  );
}
