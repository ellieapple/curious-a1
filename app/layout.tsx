import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.evergreena1marketing.com"),
  title: {
    default: "A1 — Growth Marketing Agency Across Every Terrain | Colorado-Born",
    template: "%s | A1 Marketing",
  },
  description:
    "A1 is a Colorado-born growth marketing agency built to scale across every terrain — brand, SEO & AI search, performance media, web, and the systems that compound them. Serving Denver, the Mountain West, and beyond.",
  keywords: [
    "growth marketing agency Colorado",
    "SEO agency Denver",
    "AI search optimization Colorado",
    "performance marketing agency",
    "digital marketing agency Denver CO",
    "brand strategy Colorado",
    "web design Denver",
    "marketing agency Mountain West",
  ],
  authors: [{ name: "A1 Marketing" }],
  creator: "A1 Marketing",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "A1 Marketing",
    title: "A1 — Growth Marketing Across Every Terrain",
    description:
      "Colorado-born growth marketing agency. Brand, SEO & AI search, performance media, and the systems that compound them — built to scale across every terrain.",
    url: "https://www.evergreena1marketing.com/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "A1 — Marketing Across Terrains" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "A1 — Growth Marketing Across Every Terrain",
    description:
      "Colorado-born growth marketing agency built to scale across every terrain — brand, SEO & AI search, performance media, and compounding systems.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.evergreena1marketing.com/",
  },
  other: {
    "geo.region": "US-CO",
    "geo.placename": "Colorado",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://www.evergreena1marketing.com/#org",
      name: "A1 Marketing",
      alternateName: "A1",
      url: "https://www.evergreena1marketing.com/",
      logo: "https://www.evergreena1marketing.com/og-image.jpg",
      image: "https://www.evergreena1marketing.com/og-image.jpg",
      description:
        "A1 is a Colorado-born growth marketing agency offering brand, SEO and AI search, performance media, web and product, content, and analytics services across the Mountain West and beyond.",
      slogan: "Marketing across terrains.",
      foundingLocation: "Colorado, United States",
      email: "sales@evergreena1marketing.com",
      address: { "@type": "PostalAddress", addressRegion: "CO", addressCountry: "US" },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Colorado" },
        { "@type": "AdministrativeArea", name: "Utah" },
        { "@type": "AdministrativeArea", name: "Arizona" },
        { "@type": "AdministrativeArea", name: "Texas" },
        { "@type": "AdministrativeArea", name: "Pacific Northwest" },
      ],
      knowsAbout: ["Search Engine Optimization", "AI Search Optimization", "Brand Strategy", "Performance Marketing", "Conversion Rate Optimization", "Content Marketing"],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.evergreena1marketing.com/#website",
      url: "https://www.evergreena1marketing.com/",
      name: "A1 Marketing",
      publisher: { "@id": "https://www.evergreena1marketing.com/#org" },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      serviceType: "Growth Marketing",
      provider: { "@id": "https://www.evergreena1marketing.com/#org" },
      areaServed: "United States",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "A1 Capabilities",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO & AI Search Optimization" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand & Creative" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Performance Media" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web & Product" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Content & Social" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Analytics & CRO" } },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.evergreena1marketing.com/#faq",
      mainEntity: [
        { "@type": "Question", name: "What does A1 Marketing do?", acceptedAnswer: { "@type": "Answer", text: "A1 is a full-service growth marketing agency. We build brand, SEO and AI search visibility, performance media, websites and products, content, and the analytics that tie them together — then operate them as one compounding system rather than disconnected campaigns." } },
        { "@type": "Question", name: "Where is A1 Marketing located and what markets do you serve?", acceptedAnswer: { "@type": "Answer", text: "A1 is a Colorado-born growth agency based in Denver. We run programs across the Mountain West, the Desert Southwest, Texas, and the Pacific Northwest — any terrain where our clients need to grow." } },
        { "@type": "Question", name: "How does A1 approach SEO and AI search optimization in 2026?", acceptedAnswer: { "@type": "Answer", text: "We start with diagnosis, not keywords: where the funnel leaks and which terms carry real intent. From there we build topic clusters, structured data, and genuinely useful content that earns E-E-A-T signals — so you show up in both classic search results and AI Overviews." } },
        { "@type": "Question", name: "How long does it take to see SEO results?", acceptedAnswer: { "@type": "Answer", text: "Technical fixes and paid media can move within weeks. Durable SEO and brand authority compound over months — most clients see meaningful organic traction in 6 to 12 months, with continued growth as authority builds." } },
        { "@type": "Question", name: "What does a marketing engagement with A1 look like?", acceptedAnswer: { "@type": "Answer", text: "Most partnerships run as a quarterly operating system: we identify your biggest constraint, ship focused projects against it, measure what moves, and adapt when the bottleneck shifts. Engagements typically begin with a paid diagnostic sprint before an ongoing retainer." } },
        { "@type": "Question", name: "What industries does A1 Marketing work with?", acceptedAnswer: { "@type": "Answer", text: "We focus on outdoor and consumer brands, B2B SaaS, healthcare, hospitality, and regional service businesses — categories where a strong brand plus disciplined search and media create durable advantage." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.evergreena1marketing.com/" }],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#07070a" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ imports: { three: "https://unpkg.com/three@0.170.0/build/three.webgpu.js" } }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
