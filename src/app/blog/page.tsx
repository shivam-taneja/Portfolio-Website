import { Metadata } from "next";
import Link from "next/link";

import { defaultMetadata } from "@/lib/constants/metadata";
import { blogPosts } from "@/lib/constants/blog";

import JsonLd from "@/components/json-ld";
import Wrapper from "@/components/wrapper";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Writing | Shivam Taneja",
  description:
    "Write-ups by Shivam Taneja on side projects, including how Chat Mingle, Bhondu Life, and Tiltbot were built.",
  keywords: [
    ...(defaultMetadata.keywords ?? []),
    "Shivam Taneja blog",
    "Chat Mingle",
    "chat mingle",
    "Bhondu Life",
    "Bhondu Game",
    "bhondu game",
    "Tiltbot",
    "Tilt-Bot",
  ],
  alternates: {
    canonical: "https://www.shivamtaneja.com/blog",
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    type: "website",
    title: "Writing | Shivam Taneja",
    description:
      "Write-ups by Shivam Taneja on side projects, including how Chat Mingle, Bhondu Life, and Tiltbot were built.",
    url: "https://www.shivamtaneja.com/blog",
    images: [
      {
        url: "/og/blog",
        alt: "Writing | Shivam Taneja",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Writing | Shivam Taneja",
    description:
      "Write-ups by Shivam Taneja on side projects, including how Chat Mingle, Bhondu Life, and Tiltbot were built.",
    images: ["/og/blog"],
  },
  robots: "index, follow",
};

const BlogPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Writing by Shivam Taneja",
    url: "https://www.shivamtaneja.com/blog",
    description:
      "Write-ups by Shivam Taneja on side projects, including Chat Mingle, Bhondu Life, and Tiltbot.",
    author: {
      "@id": "https://www.shivamtaneja.com/#person",
    },
    publisher: {
      "@id": "https://www.shivamtaneja.com/#organization",
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://www.shivamtaneja.com${post.href}`,
      datePublished: post.datePublished,
      description: post.description,
    })),
  };

  return (
    <>
      <JsonLd id="blog-collection-schema" data={structuredData} />

      <Wrapper>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Writing</h1>
            <p className="dark:text-neutral-400 text-neutral-600">
              Longer notes on projects I have shipped.
            </p>
          </div>

          <ul className="flex flex-col gap-6">
            {blogPosts.map((post) => (
              <li key={post.slug} className="flex flex-col gap-2">
                <div className="flex gap-3 items-baseline justify-between flex-wrap">
                  <Link
                    href={post.href}
                    className="text-xl dark:text-white text-zinc-900 underline dark:hover:text-neutral-300 hover:text-zinc-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm dark:text-neutral-500 text-neutral-500">
                    {post.dateLabel}
                  </p>
                </div>
                <p className="dark:text-neutral-400 text-neutral-600">
                  {post.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Wrapper>
    </>
  );
};

export default BlogPage;
