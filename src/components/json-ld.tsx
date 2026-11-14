type JsonLdProps = {
  id: string;
  data: unknown;
};

/** Real JSON-LD element so the prerendered HTML includes the structured data. */
export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
