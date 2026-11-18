/** Section identifiers shared by articles and blogs; labels come from the section data. */
export interface SectionMembership {
  period?: string;
  polity?: string;
  themes?: string[];
  personalities?: string[];
  relatedTo?: string;
}

export interface SectionEntry extends SectionMembership {
  slug: string;
  tags: string[];
}
