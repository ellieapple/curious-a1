import Header from "@/components/Header";
import FluidBackground from "@/components/FluidBackground";
import PageAnimations from "@/components/PageAnimations";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <Header />

      <main id="main" className="page">
        <span id="top"></span>

        {/* ── Hero ── */}
        <section className="hero wrap" aria-labelledby="hero-title">
          <p className="eyebrow">Growth Marketing Agency · Colorado-Born</p>
          <h1 className="display" id="hero-title">Marketing that moves with&nbsp;the terrain.</h1>
          <p className="lede">A1 is a Colorado-born growth marketing agency built to scale across every market and channel — brand, SEO &amp; AI search, performance media, and the systems that compound them.</p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">Map your terrain <span className="arrow" aria-hidden="true">→</span></a>
            <a href="#work" className="btn btn-ghost">See the work</a>
          </div>
          <div className="scroll-cue"><span className="dot"></span> Scroll</div>
          <div className="hero-geo" aria-hidden="true">
            <svg id="topo-svg" viewBox="0 0 560 460" xmlns="http://www.w3.org/2000/svg"></svg>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="band wrap cv-auto" id="services" aria-labelledby="services-title">
          <div className="band-head reveal">
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title" id="services-title">One team for the whole map.</h2>
            <p className="lede">Six disciplines, operated as a single system. No silos between the people who build your brand and the people who make it perform.</p>
          </div>
          <div className="services-grid reveal stagger">
            <article className="service">
              <span className="idx">01</span>
              <h3>SEO &amp; AI Search</h3>
              <p>Topic-cluster strategy, technical health, structured data, and content engineered to rank in classic results and AI Overviews alike.</p>
              <div className="tags"><span>Technical SEO</span><span>AI Overviews</span><span>Local</span><span>Content</span></div>
            </article>
            <article className="service">
              <span className="idx">02</span>
              <h3>Brand &amp; Creative</h3>
              <p>Positioning, identity, and a verbal &amp; visual system distinctive enough to grow branded search and own a category.</p>
              <div className="tags"><span>Strategy</span><span>Identity</span><span>Messaging</span></div>
            </article>
            <article className="service">
              <span className="idx">03</span>
              <h3>Performance Media</h3>
              <p>Google Ads, Meta, and programmatic run against pipeline and revenue — not impressions. Creative testing on a weekly cadence.</p>
              <div className="tags"><span>Google Ads</span><span>Meta</span><span>Paid Social</span><span>Programmatic</span></div>
            </article>
            <article className="service">
              <span className="idx">04</span>
              <h3>Web &amp; Product</h3>
              <p>Fast, accessible, conversion-first websites and product surfaces — engineered for Core Web Vitals and the people who use them.</p>
              <div className="tags"><span>Design</span><span>Build</span><span>Core Web Vitals</span></div>
            </article>
            <article className="service">
              <span className="idx">05</span>
              <h3>Content &amp; Social</h3>
              <p>Editorial, video, and organic social across Meta, Instagram, LinkedIn, and beyond — content that grows mentions and lifts every keyword you rank for.</p>
              <div className="tags"><span>Meta</span><span>Instagram</span><span>LinkedIn</span><span>Organic Social</span></div>
            </article>
            <article className="service">
              <span className="idx">06</span>
              <h3>Analytics &amp; CRO</h3>
              <p>Clean measurement, attribution you can trust, and experimentation that turns the same traffic into more revenue.</p>
              <div className="tags"><span>Measurement</span><span>Attribution</span><span>Experimentation</span></div>
            </article>
          </div>
        </section>

        {/* ── Terrains ── */}
        <section className="band wrap cv-auto" id="terrains" aria-labelledby="terrains-title">
          <div className="terrains">
            <div className="reveal">
              <p className="eyebrow">Across Terrains</p>
              <h2 className="section-title" id="terrains-title">Born on the Front Range. Built to travel.</h2>
              <p className="lede" style={{ marginTop: "1.4rem" }}>We started with Colorado businesses and never stopped moving. Today A1 runs growth programs across five regions — each with operators who actually know the ground.</p>
              <a href="#contact" className="btn btn-ghost" style={{ marginTop: "2rem" }}>Bring A1 to your market <span className="arrow" aria-hidden="true">→</span></a>
            </div>
            <div className="terrain-list reveal stagger from-left">
              <div className="terrain">
                <span className="place">Denver</span>
                <span className="meta">Colorado · Front Range</span>
                <span className="coord">39.7°N</span>
              </div>
              <div className="terrain">
                <span className="place">Evergreen</span>
                <span className="meta">Colorado · Foothills</span>
                <span className="coord">39.6°N</span>
              </div>
              <div className="terrain">
                <span className="place">Pensacola</span>
                <span className="meta">Florida · Gulf Coast</span>
                <span className="coord">30.4°N</span>
              </div>
              <div className="terrain">
                <span className="place">Bentonville</span>
                <span className="meta">Arkansas · Ozarks</span>
                <span className="coord">36.4°N</span>
              </div>
              <div className="terrain">
                <span className="place">Philadelphia</span>
                <span className="meta">Pennsylvania · Mid-Atlantic</span>
                <span className="coord">40.0°N</span>
              </div>
              <div className="terrain">
                <span className="place">New Orleans</span>
                <span className="meta">Louisiana · Gulf South</span>
                <span className="coord">30.0°N</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Drawing rule ── */}
        <div className="s-rule js-draw wrap" aria-hidden="true"></div>

        {/* ── Approach ── */}
        <section className="band wrap cv-auto" id="approach" aria-labelledby="approach-title">
          <div className="band-head reveal">
            <p className="eyebrow">How We Work</p>
            <h2 className="section-title" id="approach-title">A quarterly operating system, not a campaign.</h2>
            <p className="lede">We find your biggest constraint, ship against it, measure what moves, and adapt when the bottleneck shifts.</p>
          </div>
          <div className="steps reveal stagger">
            <div className="step">
              <span className="s-num">01</span>
              <h3>Diagnose</h3>
              <p>We start where the funnel actually breaks — not with a keyword list. Audit, data, and a single clear constraint.</p>
            </div>
            <div className="step">
              <span className="s-num">02</span>
              <h3>Map</h3>
              <p>A focused plan tied to revenue: the terrain, the route, and the few projects that will move the most.</p>
            </div>
            <div className="step">
              <span className="s-num">03</span>
              <h3>Build</h3>
              <p>One team ships brand, search, media, and site in sync — fast, measurable, and built to last.</p>
            </div>
            <div className="step">
              <span className="s-num">04</span>
              <h3>Compound</h3>
              <p>We review what moved, double down, and let authority and learnings stack quarter over quarter.</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="band wrap cv-auto" id="faq" aria-labelledby="faq-title">
          <div className="faq-grid">
            <div className="reveal">
              <p className="eyebrow">FAQ</p>
              <h2 className="section-title" id="faq-title">Questions, answered.</h2>
            </div>
            <div className="faq-list reveal stagger clip-up">
              <details className="faq-item" open>
                <summary>What does A1 do?<span className="plus" aria-hidden="true"></span></summary>
                <div className="answer">A1 is a full-service growth marketing agency. We build brand, SEO and AI search visibility, performance media, websites and products, content, and the analytics that tie them together — then operate them as one compounding system rather than disconnected campaigns.</div>
              </details>
              <details className="faq-item">
                <summary>Where is A1 located, and what markets do you serve?<span className="plus" aria-hidden="true"></span></summary>
                <div className="answer">A1 is a Colorado-born growth agency. We&apos;re rooted in Denver and Evergreen, and today we run programs across Florida, Arkansas, Pennsylvania, and Louisiana — any terrain where our clients need to grow.</div>
              </details>
              <details className="faq-item">
                <summary>How do you approach SEO and AI search in 2026?<span className="plus" aria-hidden="true"></span></summary>
                <div className="answer">We start with diagnosis, not keywords: where the funnel leaks and which terms carry real intent. From there we build topic clusters, structured data, and genuinely useful content that earns E-E-A-T signals — so you show up in both classic search results and AI Overviews. Technical health and site speed are the foundation under all of it.</div>
              </details>
              <details className="faq-item">
                <summary>How long until we see results?<span className="plus" aria-hidden="true"></span></summary>
                <div className="answer">Technical fixes and paid media can move within weeks. Durable SEO and brand authority compound over months — most clients see meaningful organic traction in 6 to 12 months, with continued growth as authority builds. We report against business outcomes, not vanity metrics.</div>
              </details>
              <details className="faq-item">
                <summary>What does an engagement look like?<span className="plus" aria-hidden="true"></span></summary>
                <div className="answer">Most partnerships run as a quarterly operating system: we identify your biggest constraint, ship focused projects against it, measure what moves, and adapt when the bottleneck shifts. Engagements typically begin with a paid diagnostic sprint before an ongoing retainer.</div>
              </details>
              <details className="faq-item">
                <summary>What industries do you work with?<span className="plus" aria-hidden="true"></span></summary>
                <div className="answer">We focus on outdoor and consumer brands, B2B SaaS, healthcare, hospitality, and regional service businesses — categories where a strong brand plus disciplined search and media create durable advantage.</div>
              </details>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="band cta-band" id="contact" aria-labelledby="cta-title">
          <div className="city-map" aria-hidden="true">
            <svg id="city-svg" viewBox="0 0 1600 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"></svg>
          </div>
          <div className="wrap reveal" style={{ position: "relative", zIndex: 1 }}>
            <p className="eyebrow" style={{ justifyContent: "center" }}>Start a project</p>
            <h2 id="cta-title">Let&apos;s map your terrain.</h2>
            <p className="lede">Tell us where you&apos;re trying to go. We&apos;ll come back with the constraint worth solving first — and what the first 90 days look like.</p>
            <div className="cta-actions">
              <a href="mailto:sales@evergreena1marketing.com" className="btn btn-primary">
                sales@evergreena1marketing.com <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer page" role="contentinfo">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <span style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontSize: "2.4rem", lineHeight: 1, display: "block" }}>
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
                <a href="tel:+15044591202">(504) 459-1202</a><br />
                <a href="mailto:sales@evergreena1marketing.com">sales@evergreena1marketing.com</a>
              </address>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© <span id="year">2026</span> A1 Marketing — Across Terrains</p>
            <p>Denver · Evergreen · Pensacola · Bentonville · Philadelphia · New Orleans</p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky email bar */}
      <a href="mailto:sales@evergreena1marketing.com" className="mobile-cta-bar" aria-label="Email A1 Marketing">
        Email Us — sales@evergreena1marketing.com
      </a>

      <FluidBackground />
      <PageAnimations />
    </>
  );
}
