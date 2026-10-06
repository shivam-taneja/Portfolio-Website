import Script from "next/script";

import { socialProfileUrls } from "@/lib/constants/socials";

const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.shivamtaneja.com/#person",
        name: "Shivam Taneja",
        alternateName: [
          "shivamtaneja",
          "codesbyshivam",
          "Shivam Taneja Developer",
        ],
        url: "https://www.shivamtaneja.com",
        image: {
          "@type": "ImageObject",
          url: "https://www.shivamtaneja.com/og/home",
          width: 1200,
          height: 630,
        },
        description:
          "Shivam Taneja is an Associate Consultant and Full Stack Developer specializing in modern web technologies including React, Next.js, and Node.js.",
        jobTitle: "Associate Consultant",
        worksFor: {
          "@type": "Organization",
          name: "KPMG",
          url: "https://kpmg.com",
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "MRIIRS",
        },
        knowsAbout: [
          "Full Stack Development",
          "MERN Stack",
          "React",
          "Next.js",
          "Node.js",
          "MongoDB",
          "Microsoft Azure",
        ],
        sameAs: [
          "https://www.shivamtaneja.com",
          ...socialProfileUrls,
          "https://g.co/kgs/3dIQL5SNXiQt2B8HQ",
        ],
      },

      {
        "@type": "WebSite",
        "@id": "https://www.shivamtaneja.com/#website",
        url: "https://www.shivamtaneja.com",
        name: "Shivam Taneja | Full Stack Developer Portfolio",
        description:
          "Portfolio of Shivam Taneja showcasing projects, skills, and experience in full stack web development.",
        publisher: {
          "@id": "https://www.shivamtaneja.com/#person",
        },
      },

      {
        "@type": "WebPage",
        "@id": "https://www.shivamtaneja.com/#webpage",
        url: "https://www.shivamtaneja.com",
        name: "Shivam Taneja - Full Stack Developer Portfolio",
        isPartOf: { "@id": "https://www.shivamtaneja.com/#website" },
        about: { "@id": "https://www.shivamtaneja.com/#person" },
        description:
          "Shivam Taneja's personal portfolio — full stack developer, projects, experience, and contact.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Shivam Taneja",
              item: "https://www.shivamtaneja.com",
            },
          ],
        },
      },

      {
        "@type": "Organization",
        "@id": "https://www.shivamtaneja.com/#organization",
        name: "Shivam Taneja",
        url: "https://www.shivamtaneja.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.shivamtaneja.com/logo.svg",
        },
        sameAs: socialProfileUrls.slice(0, 2),
      },
    ],
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
