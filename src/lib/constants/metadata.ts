import { Metadata } from "next";

export const defaultMetadata: Partial<Metadata> = {
  metadataBase: new URL("https://www.shivamtaneja.com"),
  openGraph: {
    type: "website",
    url: "https://www.shivamtaneja.com",
    siteName: "Shivam Taneja",
    locale: "en_US",
    images: [
      {
        url: "/og/home",
        alt: "Shivam Taneja",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@codesbyshivam",
    images: ["/og/home"],
  },
  keywords: [
    "Shivam Taneja",
    "shivamtaneja",
    "shivamtaneja.com",
    "Full Stack Developer Portfolio",
    "Web Developer Portfolio",
    "Full Stack Developer",
    "Shivam Taneja Developer",
    "Shivam Taneja Projects",
    "Shivam Taneja Bangalore",
    "Hire Shivam Taneja",
    "Full Stack Development",
    "React Developer Portfolio",
    "codesbyshivam",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/logo-new.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "https://www.shivamtaneja.com",
  },
  robots: "index, follow",
  authors: [{ name: "Shivam Taneja" }],
};
