export type RandomFn = () => number;

/**
 * Simple string-based seeded RNG using a murmur-inspired hash.
 */
export function createSeededRandom(seed: string): RandomFn {
  let h = 1779033703 ^ seed.length;

  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return t / 4294967296;
  };
}

export function pickOne<T>(random: RandomFn, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

export function shuffle<T>(random: RandomFn, items: readonly T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
