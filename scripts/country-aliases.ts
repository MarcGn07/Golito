/**
 * The dataset's `country_of_citizenship` strings don't always match our
 * FIFA_FLAGS display names exactly (different spelling, punctuation, or
 * older naming). Keys are lowercase; values must match a `name` in
 * lib/flags.ts exactly.
 */
export const COUNTRY_ALIASES: Record<string, string> = {
  "united states": "United States",
  usa: "United States",
  "ivory coast": "Ivory Coast",
  "côte d'ivoire": "Ivory Coast",
  "cote d'ivoire": "Ivory Coast",
  "bosnia-herzegovina": "Bosnia and Herzegovina",
  "bosnia & herzegovina": "Bosnia and Herzegovina",
  "czech republic": "Czechia",
  turkey: "Türkiye",
  "republic of ireland": "Ireland",
  "dr congo": "DR Congo",
  "congo dr": "DR Congo",
  "congo, dr": "DR Congo",
  "cape verde islands": "Cape Verde",
  curacao: "Curaçao",
  "st. kitts & nevis": "St Kitts and Nevis",
  "trinidad & tobago": "Trinidad and Tobago",
  "antigua & barbuda": "Antigua and Barbuda",
  "st. vincent & grenadines": "St Vincent and the Grenadines",
  macedonia: "North Macedonia",
  fyr macedonia: "North Macedonia",
  swaziland: "Eswatini",
  burma: "Myanmar",
  "korea, south": "South Korea",
  "korea, north": "North Korea",
  "chinese taipei (taiwan)": "Chinese Taipei",
  taiwan: "Chinese Taipei",
};
