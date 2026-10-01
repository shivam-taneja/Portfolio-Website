import Script from "next/script";

type Props = {
  name: string;
  description: string;
  url: string;
  repo?: string;
  tech: string[];
};

export default function ProjectStructuredData({
  name,
  description,
  url,
  repo,
  tech,
}: Props) {
  const slug = url.split("/").filter(Boolean).pop();
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": name,
    "description": description,
    "url": url,
    "image": `https://www.shivamtaneja.com/og/projects/${slug}`,
    "author": {
      "@id": "https://www.shivamtaneja.com/#person"
    },
    "programmingLanguage": tech,
    ...(repo && { codeRepository: repo })
  };

  return (
    <Script
      id="project-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
