import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/provider/theme-provider";
import { PostHogProvider } from "@/provider/posthog-provider";

import { defaultMetadata } from "@/lib/constants/metadata";

import GrainyFilter from "@/components/grainy-filter";
import SmoothScroll from "@/components/smooth-scroll";
import StructuredData from "@/components/structured-data";
import { CommandPalette } from "@/components/command-palette";
import { CookieConsent } from "@/components/cookie-consent";

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const homeTitle = "Shivam Taneja | Full Stack Developer in Bangalore";
const homeDescription =
  "Shivam Taneja is a full stack developer and Associate Consultant at KPMG in Bangalore. Projects, experience, and build-in-public work as @codesbyshivam.";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: homeTitle,
  description: homeDescription,
  keywords: [
    ...(defaultMetadata.keywords as string[]),
    "Shivam Taneja portfolio",
    "Shivam Taneja full stack developer",
    "Shivam Taneja KPMG",
  ],
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    ...defaultMetadata.openGraph,
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
    ...defaultMetadata.twitter,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <Script id="gtm-init" strategy="afterInteractive">
          {\`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WVPS3JFL');
      \`}
        </Script>
      </head> */}
      <body
        className={`${spaceGrotesk.className} antialiased dark:bg-zinc-900 bg-zinc-100`}
      >
        {/* Google Tag Manager (noscript */}
        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WVPS3JFL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript> */}

        <StructuredData />

        <PostHogProvider>
          <GrainyFilter />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CommandPalette />

            <div
              className="fixed bottom-0 right-0 -z-10 overflow-hidden pointer-events-none select-none flex flex-col items-end leading-[0.8]"
              aria-hidden="true"
            >
              <span className="text-[22vw] md:text-[15vw] font-black text-black/[0.03] dark:text-white/[0.03] tracking-tighter pr-4 md:pr-8">
                SHIVAM
              </span>
              <span className="text-[22vw] md:text-[15vw] font-black text-black/[0.03] dark:text-white/[0.03] tracking-tighter pr-4 md:pr-8">
                TANEJA
              </span>
            </div>

            <SmoothScroll>{children}</SmoothScroll>

            <CookieConsent />
          </ThemeProvider>
        </PostHogProvider>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
