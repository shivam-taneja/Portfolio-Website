import { Metadata } from 'next';

import Wrapper from '@/components/wrapper';
import { defaultMetadata } from '@/lib/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "404 - Page Not Found | Shivam Taneja",
  description:
    "Oops! The page you're looking for doesn't exist. You can view Shivam Taneja's resume.",
  openGraph: {
    title: "404 - Page Not Found | Shivam Taneja",
    description:
      "Oops! The page you're looking for doesn't exist. You can view Shivam Taneja's resume.",
    ...defaultMetadata.openGraph,
  },
  twitter: {
    title: "404 - Page Not Found | Shivam Taneja",
    description:
      "Oops! The page you're looking for doesn't exist. You can view Shivam Taneja's resume.",
    ...defaultMetadata.twitter,
  },
  keywords: [
    "404 Page",
    "Page Not Found",
    "Shivam Taneja",
    "Full Stack Developer",
    "Portfolio 404",
    "Resume",
  ],
  robots: "noindex, follow",
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return (
    <Wrapper>
      <section>
        <div className="text-center flex flex-col gap-5 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-xl">Page not found</h2>
          </div>

          <p className="text-muted-foreground">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-80"
            >
              View resume
            </a>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
