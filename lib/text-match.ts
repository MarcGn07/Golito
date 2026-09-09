/**
 * Normalizes a name for comparison: lowercase, strip accents/diacritics,
 * drop anything that isn't a letter/number, collapse whitespace.
 * "Müller" and "muller" / "Kylian Mbappé" and "kylian mbappe" become equal.
 */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Classic Levenshtein edit distance between two strings. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

/**
 * Allows a small number of typos, scaled to how long the target word is,
 * so a one-letter slip on "Müller" passes but "Ronaldo" doesn't match
 * "Messi".
 */
function maxAllowedDistance(targetLength: number): number {
  if (targetLength <= 4) return 0;
  if (targetLength <= 7) return 1;
  return 2;
}

/** Does `guess` match `target` (a canonical answer or one of its aliases)? */
export function isFuzzyMatch(guess: string, target: string): boolean {
  const g = normalize(guess);
  const t = normalize(target);
  if (!g) return false;
  if (g === t) return true;
  return levenshtein(g, t) <= maxAllowedDistance(t.length);
}
