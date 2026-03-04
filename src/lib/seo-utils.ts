// ── SEO Utility Functions ─────────────────────────────────────────────────────
// All functions are pure client-side; no external API calls required.

// ── Keyword Generator ────────────────────────────────────────────────────────

const QUESTION_PREFIXES = [
  "how to", "what is", "why is", "when to", "where to",
  "how does", "what are", "how can", "is it possible to", "what does",
];

const MODIFIER_PREFIXES = [
  "best", "top", "free", "cheap", "easy", "fast", "simple",
  "professional", "advanced", "beginner", "complete", "ultimate",
];

const MODIFIER_SUFFIXES = [
  "online", "free", "for beginners", "tutorial", "guide", "tips",
  "examples", "tools", "software", "2024", "2025", "step by step",
  "without coding", "for business", "for small business",
];

const INTENT_MODIFIERS: Record<string, string[]> = {
  informational: ["what is", "how to", "why", "types of", "examples of", "guide to"],
  commercial: ["best", "top", "review", "vs", "compare", "alternatives to", "price of"],
  transactional: ["buy", "download", "get", "try", "use", "install", "sign up for"],
  navigational: ["login", "official site", "website", "app", "tool"],
};

export interface GeneratedKeyword {
  keyword: string;
  type: "long-tail" | "question" | "lsi" | "commercial";
}

export function generateKeywords(seed: string): GeneratedKeyword[] {
  const s = seed.trim().toLowerCase();
  if (!s) return [];

  const results: GeneratedKeyword[] = [];
  const seen = new Set<string>();

  const add = (kw: string, type: GeneratedKeyword["type"]) => {
    const k = kw.trim();
    if (k && !seen.has(k)) {
      seen.add(k);
      results.push({ keyword: k, type });
    }
  };

  // Long-tail with prefixes
  for (const prefix of MODIFIER_PREFIXES) {
    add(`${prefix} ${s}`, "long-tail");
  }

  // Long-tail with suffixes
  for (const suffix of MODIFIER_SUFFIXES) {
    add(`${s} ${suffix}`, "long-tail");
  }

  // Question keywords
  for (const q of QUESTION_PREFIXES) {
    add(`${q} ${s}`, "question");
  }

  // Commercial intent
  for (const mod of INTENT_MODIFIERS.commercial) {
    add(`${mod} ${s}`, "commercial");
  }

  // Transactional intent
  for (const mod of INTENT_MODIFIERS.transactional) {
    add(`${mod} ${s}`, "long-tail");
  }

  return results;
}

// ── LSI Keyword Explorer ─────────────────────────────────────────────────────

const LSI_PATTERNS: string[] = [
  "definition", "meaning", "types", "examples", "benefits",
  "advantages", "disadvantages", "vs", "alternative", "comparison",
  "how it works", "use cases", "features", "overview", "introduction",
  "strategy", "techniques", "methods", "best practices", "checklist",
  "template", "framework", "model", "system", "process",
  "optimization", "improvement", "analysis", "research", "study",
  "statistics", "data", "trends", "future of", "history of",
  "basics", "fundamentals", "principles", "concepts",
];

const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  seo: ["search engine optimization", "serp ranking", "organic traffic", "on-page seo", "off-page seo", "technical seo", "link building", "keyword ranking", "search visibility"],
  marketing: ["digital marketing", "content marketing", "inbound marketing", "growth hacking", "brand awareness", "lead generation", "conversion rate"],
  website: ["web page", "landing page", "homepage", "blog", "web app", "online platform"],
  keyword: ["search term", "search query", "target keyword", "focus keyword", "key phrase"],
  content: ["article", "blog post", "copywriting", "web content", "content strategy", "editorial"],
  tool: ["software", "app", "platform", "utility", "solution", "service"],
  free: ["open source", "no cost", "gratis", "zero cost", "no subscription"],
  online: ["web-based", "browser-based", "cloud-based", "in the browser", "on the internet"],
};

export interface LsiKeyword {
  keyword: string;
  category: string;
}

export function exploreLsiKeywords(seed: string): LsiKeyword[] {
  const s = seed.trim().toLowerCase();
  if (!s) return [];

  const results: LsiKeyword[] = [];
  const seen = new Set<string>();

  const add = (kw: string, cat: string) => {
    const k = kw.trim();
    if (k && k !== s && !seen.has(k)) {
      seen.add(k);
      results.push({ keyword: k, category: cat });
    }
  };

  // Pattern-based LSI
  for (const pattern of LSI_PATTERNS) {
    add(`${s} ${pattern}`, "Semantic Pattern");
    add(`${pattern} ${s}`, "Semantic Pattern");
  }

  // Synonym-based
  for (const [word, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
    if (s.includes(word)) {
      for (const syn of synonyms) {
        add(s.replace(word, syn), "Synonym Variation");
      }
    }
  }

  // Co-occurrence patterns
  const words = s.split(" ");
  if (words.length > 1) {
    for (let i = 0; i < words.length; i++) {
      const partial = words.filter((_, idx) => idx !== i).join(" ");
      add(partial, "Partial Match");
    }
  }

  return results.slice(0, 60);
}

// ── Content Idea Generator ───────────────────────────────────────────────────

const TITLE_TEMPLATES = [
  "The Ultimate Guide to {topic}",
  "How to {topic}: A Step-by-Step Tutorial",
  "{n} Best {topic} Tips for Beginners",
  "{n} Proven Strategies for {topic}",
  "Everything You Need to Know About {topic}",
  "Why {topic} Matters More Than You Think",
  "The Beginner's Guide to {topic}",
  "{n} {topic} Mistakes to Avoid",
  "How to Get Started with {topic} in {n} Easy Steps",
  "{topic} vs {topic2}: Which Is Right for You?",
  "The Future of {topic}: Trends and Predictions",
  "How {topic} Can Transform Your Business",
  "{n} Tools Every {topic} Expert Uses",
  "A Complete {topic} Checklist for {year}",
  "What Nobody Tells You About {topic}",
  "The {topic} Strategy That Actually Works",
  "{n} Questions to Ask Before Starting {topic}",
  "How to Master {topic} Without Spending a Dime",
  "{topic} Best Practices: Do's and Don'ts",
  "From Zero to {topic} Hero: A Practical Guide",
];

const CONTENT_TYPES = [
  "How-To Guide", "Listicle", "Case Study", "Comparison", "Review",
  "Tutorial", "Opinion Piece", "Research Roundup", "Interview",
  "Infographic Idea", "Video Script", "Email Newsletter", "Social Thread",
];

export interface ContentIdea {
  title: string;
  type: string;
  angle: string;
}

export function generateContentIdeas(topic: string): ContentIdea[] {
  const t = topic.trim();
  if (!t) return [];

  const tc = t.charAt(0).toUpperCase() + t.slice(1);
  const year = new Date().getFullYear();
  const ideas: ContentIdea[] = [];

  const angles = [
    "Beginner audience", "Advanced practitioners", "B2B focus", "B2C focus",
    "Budget-conscious users", "Enterprise scale", "Quick wins", "Long-term strategy",
  ];

  TITLE_TEMPLATES.forEach((tpl, i) => {
    const title = tpl
      .replace("{topic}", tc)
      .replace("{topic2}", `${tc} Alternatives`)
      .replace("{n}", String([3, 5, 7, 10, 15][i % 5]))
      .replace("{year}", String(year));

    ideas.push({
      title,
      type: CONTENT_TYPES[i % CONTENT_TYPES.length],
      angle: angles[i % angles.length],
    });
  });

  return ideas;
}

// ── Meta Tag Builder helpers ─────────────────────────────────────────────────

export function buildMetaTags({
  title,
  description,
  url,
  image,
  siteName,
  twitterHandle,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
  twitterHandle?: string;
}): string {
  const ogImage = image || "https://fasttoolify.com/og-image.png";
  const site = siteName || "";
  const tw = twitterHandle ? `\n  <meta name="twitter:site" content="${twitterHandle}">` : "";

  return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
${site ? `<meta property="og:site_name" content="${site}">` : ""}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">${tw}
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">`.trim();
}
