import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],

  async redirects() {
    return [
      {
        source: "/project/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      { source: "/resume", destination: "/resume.pdf", permanent: true },
      { source: "/cv", destination: "/resume.pdf", permanent: true },
      { source: "/shivam-resume", destination: "/resume.pdf", permanent: true },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
