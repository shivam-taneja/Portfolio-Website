import JsonLd from "@/components/json-ld";

type BlogPostStructuredDataProps = {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
};

export default function BlogPostStructuredData({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  image,
  keywords,
}: BlogPostStructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
    }),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    author: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
    publisher: {
      "@id": "https://www.shivamtaneja.com/#organization",
    },
    isPartOf: {
      "@type": "Blog",
      name: "Writing by Shivam Taneja",
      url: "https://www.shivamtaneja.com/blog",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.shivamtaneja.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Writing",
          item: "https://www.shivamtaneja.com/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: headline,
          item: url,
        },
      ],
    },
  };

  return <JsonLd id="blog-post-structured-data" data={data} />;
}
