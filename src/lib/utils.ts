import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { differenceInMonths, differenceInYears, parseISO } from "date-fns";

import { pathNames } from "./constants/path-names";

import { serverEnv } from "./env/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function matchPath(pathname: string, isFirstLoad: boolean) {
  if (pathname === "/") {
    return isFirstLoad ? "Shivam Taneja" : "<Home />";
  }

  if (pathname in pathNames.common) {
    return isFirstLoad
      ? pathNames.common[pathname as keyof typeof pathNames.common]
      : `<${pathNames.common[pathname as keyof typeof pathNames.common]} />`;
  }

  if (pathname.startsWith("/projects")) {
    const slug = pathname.split("/projects/")[1];

    if (slug && pathNames.projects[slug as keyof typeof pathNames.projects]) {
      return isFirstLoad
        ? pathNames.projects[slug as keyof typeof pathNames.projects]
        : `<${pathNames.projects[slug as keyof typeof pathNames.projects]} />`;
    }
  }

  if (pathname.startsWith("/blog")) {
    const slug = pathname.split("/blog/")[1];

    if (slug && pathNames.blog[slug as keyof typeof pathNames.blog]) {
      return isFirstLoad
        ? pathNames.blog[slug as keyof typeof pathNames.blog]
        : `<${pathNames.blog[slug as keyof typeof pathNames.blog]} />`;
    }
  }

  return "Not Found";
}

export async function verifyRecaptchaToken(token: string) {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: serverEnv().RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    },
  );

  const data = await response.json();

  return {
    success: data.success as boolean,
    score: data.score as number | undefined,
    action: data.action as string | undefined,
    challengeTs: data.challenge_ts as string | undefined,
    hostname: data.hostname as string | undefined,
    errorCodes: data["error-codes"] as string[] | undefined,
  };
}

export function calculateAge(dob: string) {
  const birthday = parseISO(dob);
  const today = new Date();

  return differenceInYears(today, birthday);
}

export function calculateTotalExperience(
  experiences: { startISO: string; endISO: string | null }[],
) {
  let totalMonths = 0;

  experiences.forEach((exp) => {
    const start = parseISO(exp.startISO);
    const end = exp.endISO ? parseISO(exp.endISO) : new Date();
    // Adding 1 because if you work from Jan to Jan, it should be 1 month in resume terms
    totalMonths += differenceInMonths(end, start) + 1;
  });

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  let result = "";
  if (years > 0) result += `${years} year${years > 1 ? "s" : ""}`;
  if (remainingMonths > 0) {
    if (result) result += " ";
    result += `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  }

  return result || "0 months";
}

export function appendUTM(link: string) {
  const utmString = "utm_source=portfolio_website&utm_medium=referral";

  if (link.includes("?")) {
    return `${link}&${utmString}`;
  }

  return `${link}?${utmString}`;
}
