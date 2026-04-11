// The 12 topics players can be offered per turn (CLAUDE.md).
//
// The display label is the Farsi string players see. `slug` is a
// stable English identifier used in seed question ids and anywhere
// we need a URL-safe or code-safe key. slugs must never change once
// shipped — they're baked into Firestore document ids.

export const TOPICS = [
  { slug: 'geography', label: 'جغرافیا' },
  { slug: 'history-iran', label: 'تاریخ ایران' },
  { slug: 'history-world', label: 'تاریخ جهان' },
  { slug: 'cinema-iran', label: 'سینمای ایران' },
  { slug: 'cinema-world', label: 'سینمای جهان' },
  { slug: 'music', label: 'موسیقی' },
  { slug: 'sports', label: 'ورزش' },
  { slug: 'science', label: 'علم و فناوری' },
  { slug: 'literature', label: 'ادبیات' },
  { slug: 'art', label: 'هنر و معماری' },
  { slug: 'nature', label: 'طبیعت و حیوانات' },
  { slug: 'people', label: 'شخصیت‌های مشهور' },
]

// Lookup by slug or label.
export const TOPIC_BY_SLUG = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t])
)
export const TOPIC_BY_LABEL = Object.fromEntries(
  TOPICS.map((t) => [t.label, t])
)

export const TOPIC_LABELS = TOPICS.map((t) => t.label)
export const TOPIC_SLUGS = TOPICS.map((t) => t.slug)
