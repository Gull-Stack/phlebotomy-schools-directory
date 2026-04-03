import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "PhlebGuide — Find Accredited Phlebotomy Schools & Certification Programs",
    template: "%s | PhlebGuide",
  },
  description: "Compare accredited phlebotomy training programs by state. Tuition, program length, certification prep, externship hours, and financial aid info for 1,000+ schools nationwide.",
  keywords: ["phlebotomy schools", "phlebotomy training", "phlebotomy certification", "phlebotomy programs", "phlebotomy classes near me", "how to become a phlebotomist", "phlebotomy school cost"],
  metadataBase: new URL("https://phlebguide.com"),
  openGraph: {
    title: "PhlebGuide — Find Accredited Phlebotomy Schools Near You",
    description: "Compare 1,000+ accredited phlebotomy programs. Tuition, certifications, externships, and financial aid — all in one place.",
    url: "https://phlebguide.com",
    siteName: "PhlebGuide",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhlebGuide — Find Accredited Phlebotomy Schools",
    description: "Compare 1,000+ phlebotomy programs by state. Tuition, certifications, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://phlebguide.com",
  },
};

// Organization + EducationalOrganization schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PhlebGuide",
  url: "https://phlebguide.com",
  description: "The nation's most comprehensive phlebotomy school directory. Compare accredited programs, tuition, certifications, and career resources.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@phlebguide.com",
    contactType: "customer service",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PhlebGuide",
  url: "https://phlebguide.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://phlebguide.com/state/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${newsreader.variable} antialiased bg-surface font-body text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed`}
      >
        {children}
      </body>
    </html>
  );
}
