import { Metadata } from "next";

import { RESUME_LINK } from "@/lib/constants/about-me";
import { defaultMetadata } from "@/lib/constants/metadata";

import ContactForm from "@/components/contact-form";
import TrackedLink from "@/components/tracked-link";
import Wrapper from "@/components/wrapper";
import GithubSponsor from "@/components/github-sponsor";
import { analyticsEvents } from "@/lib/analytics";
import { Calendar, Coffee, FileText, MailIcon, MapPin } from "lucide-react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact Me | Shivam Taneja - Full Stack Developer",
  description:
    "Get in touch with Shivam Taneja. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
  alternates: {
    canonical: "https://www.shivamtaneja.com/contact",
  },
  openGraph: {
    title: "Contact Me | Shivam Taneja - Full Stack Developer",
    description:
      "Get in touch with Shivam Taneja. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
    ...defaultMetadata.openGraph,
  },
  twitter: {
    title: "Contact Me | Shivam Taneja",
    description:
      "Get in touch with Shivam Taneja. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
    ...defaultMetadata.twitter,
  },
};

const ContactPage = () => {
  return (
    <Wrapper>
      <section className="grid md:grid-cols-2 md:gap-0 gap-10 w-full">
        <div className="space-y-6 md:text-start text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold dark:text-white text-zinc-900">
              Stay Connected.
            </h1>
            <p className="dark:text-muted-foreground text-neutral-600">
              Bring your ideas to life, together. ✨
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex md:justify-start justify-center w-full items-center gap-3 dark:text-muted-foreground text-neutral-600">
              <MailIcon
                className="h-5 w-5 dark:text-white text-zinc-900 shrink-0"
                aria-hidden="true"
              />
              <TrackedLink
                href="mailto:business.shivamtaneja@gmail.com"
                className="dark:text-white text-zinc-900 relative overflow-hidden"
                analyticsEvent={analyticsEvents.emailClicked}
                analyticsProperties={{ source: "contact_page" }}
              >
                <span className="hover-animation">
                  business.shivamtaneja@gmail.com
                </span>
              </TrackedLink>
            </div>

            <div className="flex md:justify-start justify-center w-full items-center gap-3 dark:text-muted-foreground text-neutral-600">
              <MapPin
                className="h-5 w-5 dark:text-white text-zinc-900 shrink-0"
                aria-hidden="true"
              />
              <span className="dark:text-white text-zinc-900">
                Bangalore, India
              </span>
            </div>

            <TrackedLink
              href={RESUME_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex md:justify-start justify-center w-full items-center gap-3 dark:text-muted-foreground text-neutral-600"
              analyticsEvent={analyticsEvents.resumeOpened}
              analyticsProperties={{ source: "contact_page" }}
            >
              <FileText
                className="h-5 w-5 dark:text-white text-zinc-900 shrink-0"
                aria-hidden="true"
              />
              <p className="dark:text-white text-zinc-900 relative overflow-hidden">
                <span className="hover-animation">Download Resume</span>
              </p>
            </TrackedLink>

            <TrackedLink
              href="https://calendly.com/shivamtaneja/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex md:justify-start justify-center w-full items-center gap-3 dark:text-muted-foreground text-neutral-600"
              analyticsEvent={analyticsEvents.calendlyOpened}
              analyticsProperties={{ source: "contact_page" }}
            >
              <Calendar
                className="h-5 w-5 dark:text-white text-zinc-900 shrink-0"
                aria-hidden="true"
              />
              <p className="dark:text-white text-zinc-900 relative overflow-hidden">
                <span className="hover-animation">Schedule a Call</span>
              </p>
            </TrackedLink>

            <div className="flex md:justify-start justify-center w-full mt-4 gap-4 items-center">
              <GithubSponsor variant="button" />

              <TrackedLink
                href="https://buymeacoffee.com/codesbyshivam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#f6f8fa] dark:bg-[#21262d] border border-[rgba(27,31,36,0.15)] dark:border-[rgba(240,246,252,0.1)] text-[#24292f] dark:text-[#c9d1d9] px-3 h-[32px] rounded-[6px] font-medium text-sm transition-colors hover:bg-[#f3f4f6] dark:hover:bg-[#30363d]"
                analyticsEvent={analyticsEvents.outboundLinkClicked}
                analyticsProperties={{
                  source: "contact_page",
                  destination: "buy_me_a_coffee",
                }}
              >
                <Coffee className="h-4 w-4 text-[#f59e0b]" />
                <span>Buy me a coffee</span>
              </TrackedLink>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>
    </Wrapper>
  );
};

export default ContactPage;
