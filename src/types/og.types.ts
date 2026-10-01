/** Shared social-card copy. `accent` pins a color; otherwise the palette hash decides. */
export type OgCopy = {
  description: string;
  tags: string[];
  accent?: string;
};

/** Everything the card renders except the resolved accent and the portrait. */
export type OgCardContent = OgCopy & {
  path: string;
  title: string;
  titleSize: number;
};

export type OgCardProps = Omit<OgCardContent, "accent"> & {
  accent: string;
  headshot: string;
};

/** A project card before the path and title size are derived from the name. */
export type ProjectOg = OgCopy & {
  name: string;
};

/** Optional copy on a side-project listing when the card should differ. */
export type ProjectOgOverride = {
  name?: string;
  description?: string;
  accent?: string;
};
