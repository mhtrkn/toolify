// ─── YouTube Utilities ────────────────────────────────────────────────────────

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  // Plain video ID (11 alphanumeric + - _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  return null;
}

export function generateYtTags(topic: string, niche: string): string[] {
  const base = topic.toLowerCase().trim();
  const words = base.split(/\s+/);
  const n = niche.toLowerCase().trim();
  const year = new Date().getFullYear();

  const modifiers = [
    "tutorial", "guide", "how to", "tips", "tricks", "for beginners",
    "step by step", "free", "best", "top", "review", "explained",
    `${year}`, "ultimate", "complete", "in minutes",
  ];

  const tags: Set<string> = new Set();

  // Direct topic tags
  tags.add(base);
  tags.add(`${base} tutorial`);
  tags.add(`${base} guide`);
  tags.add(`how to ${base}`);
  tags.add(`${base} tips`);
  tags.add(`${base} for beginners`);
  tags.add(`best ${base}`);
  tags.add(`${base} ${year}`);
  tags.add(`${base} step by step`);
  tags.add(`${base} explained`);
  tags.add(`learn ${base}`);
  tags.add(`${base} complete guide`);

  // Niche-specific
  if (n) {
    tags.add(n);
    tags.add(`${n} ${base}`);
    tags.add(`${base} ${n}`);
    tags.add(`${n} tips`);
    tags.add(`${n} tutorial`);
    tags.add(`${n} for beginners`);
  }

  // Individual word tags
  words.forEach((w) => {
    if (w.length > 3) {
      tags.add(w);
      tags.add(`${w} tutorial`);
    }
  });

  // Random modifiers
  modifiers.slice(0, 5).forEach((m) => tags.add(`${base} ${m}`));

  return Array.from(tags).slice(0, 30);
}

export function generateYtTitles(
  draft: string,
  niche: string,
  audience: string,
): string[] {
  const topic = draft.trim() || "Your Topic";
  const aud = audience.trim() || "Beginners";
  const year = new Date().getFullYear();

  return [
    `How to ${topic} (Step-by-Step Guide for ${aud})`,
    `The Ultimate ${topic} Guide – Everything You Need to Know in ${year}`,
    `${topic}: 7 Proven Strategies That Actually Work`,
    `I Tried ${topic} for 30 Days – Here's What Happened`,
    `Stop Making These ${topic} Mistakes (Do This Instead)`,
    `${topic} Tutorial for ${aud} – Master It in Under 10 Minutes`,
    `The Shocking Truth About ${topic} Nobody Tells You`,
    `${topic} Masterclass: Complete ${niche || "Overview"} [${year}]`,
    `Why 90% of People Fail at ${topic} (And How to Succeed)`,
    `${topic} – My Exact ${niche || "Strategy"} Revealed`,
  ];
}

export function generateYtDescription(data: {
  title: string;
  channelName: string;
  summary: string;
  timestamps: string;
  links: string;
  hashtags: string;
  cta: string;
}): string {
  const { title, channelName, summary, timestamps, links, hashtags, cta } = data;
  const year = new Date().getFullYear();

  const parts: string[] = [];

  parts.push(`📌 ${title || "Video Title"}`);
  parts.push("");
  parts.push(
    summary ||
      `In this video, we cover everything you need to know about ${title || "this topic"}. Watch until the end to get the full picture!`,
  );
  parts.push("");

  if (timestamps.trim()) {
    parts.push("⏱ TIMESTAMPS");
    parts.push(timestamps.trim());
    parts.push("");
  }

  if (links.trim()) {
    parts.push("🔗 LINKS & RESOURCES");
    parts.push(links.trim());
    parts.push("");
  }

  parts.push("─────────────────────────────");
  parts.push("");

  if (cta.trim()) {
    parts.push(cta.trim());
  } else {
    parts.push(
      `👍 If you found this helpful, LIKE and SUBSCRIBE to ${channelName || "our channel"} for more content every week!`,
    );
    parts.push("🔔 Hit the notification bell so you never miss an upload.");
  }

  parts.push("");
  parts.push("─────────────────────────────");
  parts.push(`© ${year} ${channelName || "Channel Name"}. All Rights Reserved.`);
  parts.push("");

  if (hashtags.trim()) {
    const tags = hashtags
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`))
      .join(" ");
    parts.push(tags);
  }

  return parts.join("\n");
}

// ─── Fancy Text / Unicode Fonts ───────────────────────────────────────────────

const SMALL_CAPS_MAP: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ",
  i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
  q: "q", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
  y: "ʏ", z: "ᴢ",
};

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
  i: "ı", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
  q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
  y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "◖", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H",
  I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ",
  Q: "Q", R: "ɹ", S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X",
  Y: "⅄", Z: "Z",
};

// Exceptions for Script style (Unicode math script)
const SCRIPT_UPPER_EXCEPTIONS: Record<number, number> = {
  1: 0x212c, // B
  4: 0x2130, // E
  5: 0x2131, // F
  7: 0x210b, // H
  8: 0x2110, // I
  11: 0x2112, // L
  12: 0x2133, // M
  17: 0x211b, // R
};
const SCRIPT_LOWER_EXCEPTIONS: Record<number, number> = {
  4: 0x212f, // e
  6: 0x210a, // g
  14: 0x2134, // o
};

// Exceptions for Fraktur
const FRAKTUR_UPPER_EXCEPTIONS: Record<number, number> = {
  2: 0x212d, // C
  7: 0x210c, // H
  8: 0x2111, // I
  17: 0x211c, // R
  25: 0x2128, // Z
};

// Exceptions for Double-Struck
const DOUBLE_UPPER_EXCEPTIONS: Record<number, number> = {
  2: 0x2102, // C
  7: 0x210d, // H
  13: 0x2115, // N
  15: 0x2119, // P
  16: 0x211a, // Q
  17: 0x211d, // R
  25: 0x2124, // Z
};

function offsetConvert(
  char: string,
  upperBase: number,
  lowerBase: number,
  upperExceptions: Record<number, number> = {},
  lowerExceptions: Record<number, number> = {},
): string {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    const idx = code - 65;
    const cp = upperExceptions[idx] ?? upperBase + idx;
    return String.fromCodePoint(cp);
  }
  if (code >= 97 && code <= 122) {
    const idx = code - 97;
    const cp = lowerExceptions[idx] ?? lowerBase + idx;
    return String.fromCodePoint(cp);
  }
  return char;
}

function convertStyle(text: string, convert: (c: string) => string): string {
  return text
    .split("")
    .map((c) => convert(c))
    .join("");
}

export const FANCY_TEXT_STYLES: {
  id: string;
  name: string;
  convert: (text: string) => string;
}[] = [
  {
    id: "bold",
    name: "𝗕𝗼𝗹𝗱",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d400, 0x1d41a)),
  },
  {
    id: "italic",
    name: "𝘐𝘵𝘢𝘭𝘪𝘤",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d434, 0x1d44e)),
  },
  {
    id: "boldItalic",
    name: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d468, 0x1d482)),
  },
  {
    id: "script",
    name: "𝒮𝒸𝓇𝒾𝓅𝓉",
    convert: (t) =>
      convertStyle(t, (c) =>
        offsetConvert(c, 0x1d49c, 0x1d4b6, SCRIPT_UPPER_EXCEPTIONS, SCRIPT_LOWER_EXCEPTIONS),
      ),
  },
  {
    id: "boldScript",
    name: "𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d4d0, 0x1d4ea)),
  },
  {
    id: "fraktur",
    name: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
    convert: (t) =>
      convertStyle(t, (c) =>
        offsetConvert(c, 0x1d504, 0x1d51e, FRAKTUR_UPPER_EXCEPTIONS),
      ),
  },
  {
    id: "doubleStruck",
    name: "𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜",
    convert: (t) =>
      convertStyle(t, (c) =>
        offsetConvert(c, 0x1d538, 0x1d552, DOUBLE_UPPER_EXCEPTIONS),
      ),
  },
  {
    id: "monospace",
    name: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d670, 0x1d68a)),
  },
  {
    id: "sansSerif",
    name: "Sans Serif",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d5a0, 0x1d5ba)),
  },
  {
    id: "sansSerifBold",
    name: "𝗦𝗮𝗻𝘀 𝗦𝗲𝗿𝗶𝗳 𝗕𝗼𝗹𝗱",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d5d4, 0x1d5ee)),
  },
  {
    id: "sansSerifItalic",
    name: "𝘚𝘢𝘯𝘴 𝘚𝘦𝘳𝘪𝘧 𝘐𝘵𝘢𝘭𝘪𝘤",
    convert: (t) =>
      convertStyle(t, (c) => offsetConvert(c, 0x1d608, 0x1d622)),
  },
  {
    id: "smallCaps",
    name: "Sᴍᴀʟʟ Cᴀᴘs",
    convert: (t) =>
      convertStyle(t, (c) => SMALL_CAPS_MAP[c.toLowerCase()] ?? c),
  },
  {
    id: "bubble",
    name: "Ⓑⓤⓑⓑⓛⓔ",
    convert: (t) =>
      convertStyle(t, (c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + code - 97);
        if (code >= 48 && code <= 57) return ["⓪","①","②","③","④","⑤","⑥","⑦","⑧","⑨"][code - 48];
        return c;
      }),
  },
  {
    id: "strikethrough",
    name: "S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶",
    convert: (t) => t.split("").map((c) => (c === " " ? c : c + "\u0336")).join(""),
  },
  {
    id: "upsideDown",
    name: "ǝpısdn umop",
    convert: (t) =>
      t
        .split("")
        .map((c) => UPSIDE_DOWN_MAP[c] ?? c)
        .reverse()
        .join(""),
  },
];

// ─── Instagram Utilities ──────────────────────────────────────────────────────

const HASHTAG_DB: Record<string, { trending: string[]; medium: string[]; niche: string[] }> = {
  travel: {
    trending: ["#travel", "#travelgram", "#wanderlust", "#travelphotography", "#instatravel", "#explore"],
    medium: ["#traveldiaries", "#travellife", "#travelblogger", "#beautifuldestinations", "#worldtraveler", "#solotravel"],
    niche: ["#travelcouple", "#budgettravel", "#sustainabletravel", "#slowtravel", "#digitalnomad", "#travelwithkids", "#luxurytravel", "#backpacking"],
  },
  food: {
    trending: ["#food", "#foodie", "#foodphotography", "#instafood", "#foodlover", "#yummy"],
    medium: ["#foodblogger", "#homemade", "#cooking", "#delicious", "#foodstagram", "#healthyfood"],
    niche: ["#veganfood", "#glutenfree", "#mealprep", "#recipeshare", "#foodstyling", "#plantbased", "#comfortfood", "#streetfood"],
  },
  fitness: {
    trending: ["#fitness", "#gym", "#workout", "#fitnessmotivation", "#health", "#bodybuilding"],
    medium: ["#fitlife", "#training", "#exercise", "#personaltrainer", "#fitnessjourney", "#healthylifestyle"],
    niche: ["#homeworkout", "#crossfit", "#yogalife", "#runningcommunity", "#strengthtraining", "#calisthenics", "#pilates", "#weightloss"],
  },
  fashion: {
    trending: ["#fashion", "#style", "#ootd", "#fashionista", "#outfit", "#streetstyle"],
    medium: ["#fashionblogger", "#lookoftheday", "#fashionphotography", "#styleinspo", "#wiwt", "#fashionweek"],
    niche: ["#sustainablefashion", "#vintagestyle", "#minimalistfashion", "#luxuryfashion", "#streetwear", "#aestheticfashion", "#thriftflip", "#capsulewardrobe"],
  },
  beauty: {
    trending: ["#beauty", "#makeup", "#skincare", "#makeuptutorial", "#beautytips", "#glam"],
    medium: ["#beautyblogger", "#makeuplook", "#skincareroutine", "#cleanbeauty", "#makeupinspo", "#beautyhacks"],
    niche: ["#crueltyfreebeauty", "#naturalmakeup", "#kbeauty", "#glowup", "#selfcare", "#acneskincare", "#antiaging", "#skincarelovers"],
  },
  business: {
    trending: ["#business", "#entrepreneur", "#motivation", "#success", "#hustle", "#startup"],
    medium: ["#entrepreneurship", "#smallbusiness", "#businesstips", "#mindset", "#growthmindset", "#workfromhome"],
    niche: ["#sidehustle", "#passiveincome", "#ecommerce", "#dropshipping", "#contentcreator", "#freelancer", "#solopreneur", "#onlinebusiness"],
  },
  photography: {
    trending: ["#photography", "#photo", "#photographer", "#photooftheday", "#picoftheday", "#nature"],
    medium: ["#landscapephotography", "#portraitphotography", "#streetphotography", "#naturephotography", "#photographylovers", "#canonphotography"],
    niche: ["#goldenhour", "#minimalphotography", "#astrophotography", "#filmphotography", "#sonya7", "#lightroom", "#fujifilm", "#mirrorless"],
  },
  technology: {
    trending: ["#technology", "#tech", "#programming", "#coding", "#developer", "#ai"],
    medium: ["#softwareengineering", "#webdevelopment", "#javascript", "#python", "#machinelearning", "#cybersecurity"],
    niche: ["#opensource", "#devlife", "#100daysofcode", "#reactjs", "#nodejs", "#cloudcomputing", "#blockchain", "#iot"],
  },
  lifestyle: {
    trending: ["#lifestyle", "#life", "#inspiration", "#motivation", "#happy", "#love"],
    medium: ["#positivity", "#mindfulness", "#wellbeing", "#selfimprovement", "#dailylife", "#gratitude"],
    niche: ["#minimalism", "#slowliving", "#intentionalliving", "#wellness", "#morningroutine", "#journaling", "#hygge", "#selfcare"],
  },
  art: {
    trending: ["#art", "#artist", "#artwork", "#drawing", "#painting", "#illustration"],
    medium: ["#digitalart", "#artofinstagram", "#contemporaryart", "#artgallery", "#sketchbook", "#procreate"],
    niche: ["#conceptart", "#fanart", "#watercolor", "#oilpainting", "#abstractart", "#streetart", "#charcoaldrawing", "#artcommissions"],
  },
};

function getHashtagsForTopic(topic: string): { trending: string[]; medium: string[]; niche: string[] } {
  const t = topic.toLowerCase();
  for (const [key, data] of Object.entries(HASHTAG_DB)) {
    if (t.includes(key) || key.includes(t)) return data;
  }
  // Generic fallback
  const slug = topic.toLowerCase().replace(/\s+/g, "");
  const words = topic.toLowerCase().split(/\s+/);
  return {
    trending: ["#viral", "#trending", "#fyp", "#explore", "#instagood", `#${slug}`],
    medium: words.map((w) => `#${w}tips`).concat([`#${slug}community`, `#${slug}life`, `#${slug}daily`]).slice(0, 6),
    niche: words.flatMap((w) => [`#${w}lovers`, `#${w}gram`, `#${w}world`]).concat([`#${slug}inspo`, `#${slug}goals`]).slice(0, 8),
  };
}

export function generateInstagramHashtags(topic: string): {
  trending: string[];
  medium: string[];
  niche: string[];
} {
  return getHashtagsForTopic(topic);
}

export function generateHashtags(
  topic: string,
  platform: "instagram" | "twitter" | "tiktok" | "youtube" | "linkedin" | "general",
): { trending: string[]; medium: string[]; niche: string[] } {
  const base = getHashtagsForTopic(topic);
  const slug = topic.toLowerCase().replace(/\s+/g, "");

  if (platform === "tiktok") {
    return {
      trending: ["#fyp", "#foryou", "#foryoupage", "#viral", "#trending", `#${slug}`],
      medium: base.trending.slice(0, 4).concat([`#${slug}tiktok`, `#${slug}check`]),
      niche: base.medium.slice(0, 6).concat(base.niche.slice(0, 4)),
    };
  }
  if (platform === "twitter") {
    return {
      trending: base.trending.slice(0, 3),
      medium: base.medium.slice(0, 3),
      niche: base.niche.slice(0, 3),
    };
  }
  if (platform === "linkedin") {
    const words = topic.split(/\s+/);
    return {
      trending: [`#${slug}`, "#professional", "#career", "#growth", "#leadership", "#innovation"],
      medium: words.map((w) => `#${w.toLowerCase()}`).concat(["#networking", "#business"]).slice(0, 6),
      niche: ["#thoughtleadership", "#b2b", "#contentmarketing", "#personaldevelopment", `#${slug}tips`, "#industry"].slice(0, 6),
    };
  }
  if (platform === "youtube") {
    return {
      trending: [`#${slug}`, `#${slug}tutorial`, `#${slug}${new Date().getFullYear()}`],
      medium: [`#${slug}tips`, `#${slug}guide`, "#youtube"],
      niche: [`#${slug}forbeginners`, `#${slug}howto`, "#youtubecreator"],
    };
  }
  return base;
}

const CAPTION_TEMPLATES = {
  excited: [
    (t: string) =>
      `✨ Can't contain my excitement about ${t}! This has completely changed my perspective. Drop a 💙 if you can relate!\n\n#${t.replace(/\s/g, "")} #excited #lifestyle`,
    (t: string) =>
      `🔥 ${t} just hit different today! The energy, the vibe — everything was PERFECT. Who else is obsessed? 👇\n\n#${t.replace(/\s/g, "")} #goodvibes`,
    (t: string) =>
      `I've been waiting SO LONG for this moment 🙌 ${t} delivered and then some! Save this for inspo 📌\n\n#${t.replace(/\s/g, "")} #inspo #motivation`,
  ],
  motivational: [
    (t: string) =>
      `💪 ${t} is the reminder we all needed today.\n\nProgress > perfection. Keep going. The best version of you is worth the work.\n\n#${t.replace(/\s/g, "")} #motivation #mindset`,
    (t: string) =>
      `🌟 Hard days are part of the journey, not the destination.\n\n${t} taught me that every setback is a setup for a comeback. Believe it. 🙏\n\n#${t.replace(/\s/g, "")} #growth #inspire`,
    (t: string) =>
      `The secret? Start before you're ready.\n\n${t} didn't happen overnight — but it happened because I showed up every single day 🔑\n\n#${t.replace(/\s/g, "")} #consistency #success`,
  ],
  funny: [
    (t: string) =>
      `Me before ${t}: 😴\nMe after ${t}: 🤩\n\nThe glow-up is REAL 😂 Tag someone who needs this in their life!\n\n#${t.replace(/\s/g, "")} #relatable #funny`,
    (t: string) =>
      `Plot twist: ${t} was the therapy I didn't know I needed 😅\n\nAnyone else? Just me? Okay then 👋\n\n#${t.replace(/\s/g, "")} #humor #mood`,
    (t: string) =>
      `Warning: ${t} may cause extreme happiness, random dancing, and the urge to tell everyone 😂✨\n\n#${t.replace(/\s/g, "")} #warning #vibes`,
  ],
  professional: [
    (t: string) =>
      `Reflecting on ${t} and the lessons it brought.\n\nThe biggest takeaway? Show up consistently, stay curious, and never stop learning.\n\nWhat's your take? Share in the comments 👇\n\n#${t.replace(/\s/g, "")} #professional #growth`,
    (t: string) =>
      `${t} is reshaping the way we think about [industry].\n\nKey insights:\n→ Adapt early or adapt late\n→ Community > competition\n→ Value creation first, revenue follows\n\n#${t.replace(/\s/g, "")} #business #insights`,
    (t: string) =>
      `3 things ${t} taught me about building something meaningful:\n\n1. Focus on the 20% that drives 80% of results\n2. Build in public — feedback is gold\n3. Patience is underrated\n\n#${t.replace(/\s/g, "")} #entrepreneur #tips`,
  ],
  aesthetic: [
    (t: string) =>
      `✦ ${t} ✦\n\nsome moments are meant to be felt, not explained 🌿\n\n#${t.replace(/\s/g, "")} #aesthetic #vibes #slowliving`,
    (t: string) =>
      `soft mornings & ${t} 🌸\nthis is the dream.\n\n#${t.replace(/\s/g, "")} #cottagecore #aesthetic #peace`,
    (t: string) =>
      `⟡ ${t} ⟡\n\ngolden hour energy, grateful heart 🍂\n\n#${t.replace(/\s/g, "")} #golden #aesthetic #moments`,
  ],
};

export function generateInstagramCaptions(
  topic: string,
  mood: keyof typeof CAPTION_TEMPLATES,
): string[] {
  const templates = CAPTION_TEMPLATES[mood] ?? CAPTION_TEMPLATES.excited;
  return templates.map((fn) => fn(topic));
}

const USERNAME_PATTERNS = [
  (name: string, niche: string) => `${name}_${niche}`,
  (name: string, niche: string) => `the${name}${niche}`,
  (name: string, niche: string) => `${name}.${niche}`,
  (name: string, niche: string) => `${niche}with${name}`,
  (name: string, niche: string) => `its${name}`,
  (name: string, niche: string) => `${name}official`,
  (name: string, niche: string) => `${name}hq`,
  (name: string, niche: string) => `${niche}_by_${name}`,
  (name: string, niche: string) => `real${name}`,
  (name: string, niche: string) => `${name}creates`,
  (name: string, niche: string) => `im${name}`,
  (name: string, niche: string) => `${name}world`,
  (name: string, niche: string) => `${niche}${name}`,
  (name: string, niche: string) => `${name}.io`,
  (name: string, niche: string) => `${name}_studio`,
];

export function generateInstagramUsernames(
  name: string,
  niche: string,
): string[] {
  const n = name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  const ni = niche.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  return USERNAME_PATTERNS.map((fn) => fn(n || "user", ni || "creator"))
    .filter((u) => u.length <= 30 && u.length >= 3)
    .map((u) => u.replace(/[^a-z0-9._]/g, ""));
}

// ─── Emoji Text Converter ─────────────────────────────────────────────────────

const EMOJI_WORD_MAP: Record<string, string> = {
  love: "❤️", heart: "💙", fire: "🔥", star: "⭐", sun: "☀️", moon: "🌙",
  music: "🎵", food: "🍕", pizza: "🍕", coffee: "☕", house: "🏠",
  car: "🚗", plane: "✈️", book: "📚", school: "🏫", work: "💼", phone: "📱",
  computer: "💻", game: "🎮", sport: "⚽", football: "🏈", basketball: "🏀",
  happy: "😊", smile: "😊", sad: "😢", laugh: "😂", cool: "😎", wow: "😮",
  party: "🎉", celebrate: "🎉", birthday: "🎂", gift: "🎁", flower: "🌸",
  tree: "🌳", cat: "🐱", dog: "🐶", bird: "🐦", fish: "🐟", lion: "🦁",
  run: "🏃", walk: "🚶", swim: "🏊", sleep: "😴", eat: "🍽️", drink: "🥤",
  win: "🏆", trophy: "🏆", medal: "🏅", flag: "🚩", world: "🌍", earth: "🌍",
  time: "⏰", clock: "🕐", fast: "⚡", slow: "🐌", big: "🔝", small: "🔹",
  yes: "✅", no: "❌", check: "✅", warning: "⚠️", new: "🆕", hot: "🔥",
  good: "👍", bad: "👎", up: "⬆️", down: "⬇️", right: "➡️", left: "⬅️",
  thinking: "🤔", idea: "💡", light: "💡", dark: "🌑", night: "🌃",
  morning: "🌅", nature: "🌿", green: "💚", blue: "💙", red: "❤️",
  white: "🤍", black: "🖤", gold: "✨", silver: "🌟", beauty: "💄",
  fashion: "👗", gym: "💪", fitness: "💪", health: "🩺", money: "💸",
  rich: "🤑", poor: "😅", funny: "😂", serious: "😤",
  boss: "👔", queen: "👑", king: "👑", crown: "👑", diamond: "💎",
  magic: "✨", dream: "💭", hope: "🌈", peace: "☮️", pray: "🙏",
};

export function convertToEmojiText(text: string, mode: "decorate" | "replace"): string {
  if (mode === "replace") {
    return text
      .split(/\b/)
      .map((word) => EMOJI_WORD_MAP[word.toLowerCase()] ?? word)
      .join("");
  }
  // Decorate mode: add emojis after matched words
  return text
    .split(/\b/)
    .map((word) => {
      const emoji = EMOJI_WORD_MAP[word.toLowerCase()];
      return emoji ? `${word}${emoji}` : word;
    })
    .join("");
}

// ─── Social Media Post Formatter ──────────────────────────────────────────────

interface PlatformFormat {
  formatted: string;
  charCount: number;
  limit: number | null;
  warnings: string[];
}

export function formatForPlatform(text: string, platform: string): PlatformFormat {
  const warnings: string[] = [];

  if (platform === "twitter") {
    const limit = 280;
    const charCount = text.length;
    let formatted = text;
    if (charCount > limit) {
      warnings.push(`Text exceeds 280 characters by ${charCount - limit}. Consider splitting into a thread.`);
      // Suggest thread split points
      const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
      const threads: string[] = [];
      let current = "";
      sentences.forEach((s, i) => {
        const withNum = i === 0 ? s : s;
        if ((current + withNum).length > 270) {
          if (current) threads.push(current.trim());
          current = withNum;
        } else {
          current += withNum;
        }
      });
      if (current) threads.push(current.trim());
      formatted = threads.map((t, i) => `${i + 1}/${threads.length} ${t}`).join("\n\n🧵\n\n");
    }
    return { formatted, charCount, limit, warnings };
  }

  if (platform === "instagram") {
    const limit = 2200;
    const charCount = text.length;
    if (charCount > limit) warnings.push(`Caption exceeds 2,200 character limit by ${charCount - limit}.`);
    // Instagram shows "more" after 125 chars in feed
    if (charCount > 125) warnings.push("Only the first 125 characters show in the feed — make your opening line count.");
    // Add line breaks for readability
    const formatted = text
      .replace(/\. ([A-Z])/g, ".\n\n$1")
      .replace(/([.!?])\s+((?:#|\n))/g, "$1\n\n$2");
    return { formatted, charCount, limit, warnings };
  }

  if (platform === "linkedin") {
    const limit = 3000;
    const charCount = text.length;
    if (charCount > limit) warnings.push(`Post exceeds LinkedIn's 3,000 character limit by ${charCount - limit}.`);
    if (charCount > 210) warnings.push("LinkedIn shows a 'see more' after ~210 characters — make the opening hook compelling.");
    // Format with line breaks and bullets
    const formatted = text
      .replace(/\n/g, "\n\n")
      .replace(/- /g, "• ");
    return { formatted, charCount, limit, warnings };
  }

  if (platform === "facebook") {
    const limit = 63206;
    return {
      formatted: text,
      charCount: text.length,
      limit,
      warnings: text.length > 400 ? ["Long posts may get truncated in the feed."] : [],
    };
  }

  if (platform === "tiktok") {
    const limit = 2200;
    const charCount = text.length;
    if (charCount > limit) warnings.push(`Caption exceeds TikTok's 2,200 character limit.`);
    return { formatted: text, charCount, limit, warnings };
  }

  return { formatted: text, charCount: text.length, limit: null, warnings };
}
