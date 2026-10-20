export type ContactPreset = {
  label: string;
  subject: string;
  message: string;
};

/**
 * Short `?source=` keys used by product CTAs.
 *
 * Examples:
 * - https://www.shivamtaneja.com/contact?source=yeet
 * - https://www.shivamtaneja.com/contact?source=badminton
 * - https://www.shivamtaneja.com/contact?source=friction-fixer
 *
 * Keep subject ≤ 50 and message ≤ 250 (schema limits).
 */
export const contactPresets = {
  yeet: {
    label: "Yeet",
    subject: "Question about Yeet",
    message: "Hi Shivam — I came from Yeet and wanted to get in touch.",
  },
  badminton: {
    label: "Do You Play Badminton",
    subject: "Do You Play Badminton",
    message:
      "Hi Shivam — I came from doyouplaybadminton.com and wanted to reach out.",
  },
  "friction-fixer": {
    label: "Friction Fixer",
    subject: "Friction Fixer question",
    message:
      "Hi Shivam — I came from Friction Fixer and wanted to get in touch.",
  },
} as const satisfies Record<string, ContactPreset>;

export type ContactSource = keyof typeof contactPresets;

export function getContactPreset(
  source: string | undefined,
): ContactPreset | undefined {
  if (!source) return undefined;
  if (source in contactPresets) {
    return contactPresets[source as ContactSource];
  }
  return undefined;
}

export function isContactSource(
  source: string | undefined,
): source is ContactSource {
  return !!source && source in contactPresets;
}
