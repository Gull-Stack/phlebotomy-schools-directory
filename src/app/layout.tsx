import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://phlebguide.com'),
  title: "PhlebGuide - Find Accredited Phlebotomy Schools Near You",
  description: "Find and compare accredited phlebotomy training programs. Get matched with schools in your area. Start your healthcare career in as little as 8 weeks.",
  keywords: ["phlebotomy schools", "phlebotomy training", "phlebotomist certification", "medical training programs", "healthcare careers", "blood draw training"],
  openGraph: {
    title: "PhlebGuide - Find Accredited Phlebotomy Schools Near You",
    description: "Find and compare accredited phlebotomy training programs. Get matched with schools in your area. Start your healthcare career in as little as 8 weeks.",
    url: "https://phlebguide.com",
    siteName: "PhlebGuide",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhlebGuide - Find Accredited Phlebotomy Schools Near You",
    description: "Find and compare accredited phlebotomy training programs. Get matched with schools in your area. Start your healthcare career in as little as 8 weeks.",
  },
  alternates: {
    canonical: "https://phlebguide.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PhlebGuide",
    "url": "https://phlebguide.com",
    "description": "Your trusted guide to finding accredited phlebotomy training programs",
    "sameAs": [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PhlebGuide",
    "url": "https://phlebguide.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://phlebguide.com/state/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}
