// ── Developer Utility Functions ───────────────────────────────────────────────
// All processing is pure client-side — no server calls.

// ── JSON Formatter ───────────────────────────────────────────────────────────

export function formatJson(input: string, indent = 2): string {
  const parsed = JSON.parse(input); // throws on invalid JSON
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

// ── HTML Formatter ───────────────────────────────────────────────────────────

export function formatHtml(html: string): string {
  const VOID_TAGS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
  ]);

  let result = "";
  let depth = 0;
  let i = 0;
  const indent = "  ";

  const pad = () => indent.repeat(depth);

  // Split into tokens: tags and text
  const tokens = html
    .replace(/>\s+</g, "><")
    .split(/(<[^>]+>)/g)
    .filter(Boolean);

  for (const token of tokens) {
    if (token.startsWith("</")) {
      depth = Math.max(0, depth - 1);
      result += `${pad()}${token}\n`;
    } else if (token.startsWith("<")) {
      const tagName = (token.match(/<([a-zA-Z0-9-]+)/) || [])[1]?.toLowerCase() || "";
      result += `${pad()}${token}\n`;
      if (!VOID_TAGS.has(tagName) && !token.endsWith("/>") && !token.startsWith("<!")) {
        depth++;
      }
    } else {
      const text = token.trim();
      if (text) result += `${pad()}${text}\n`;
    }
    i++;
  }

  return result.trimEnd();
}

export function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

// ── CSS Formatter ────────────────────────────────────────────────────────────

export function formatCss(css: string): string {
  return css
    .replace(/\s*\{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/,\s*(?=[^}]*\{)/g, ",\n")
    .replace(/  \n\}/g, "\n}")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([{};:,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

// ── JS Formatter (basic) ─────────────────────────────────────────────────────

export function formatJs(js: string): string {
  // Attempt JSON first
  try {
    return formatJson(js);
  } catch {
    // fallback: basic indent via brace tracking
  }
  let result = "";
  let depth = 0;
  const indent = "  ";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < js.length; i++) {
    const ch = js[i];
    const prev = i > 0 ? js[i - 1] : "";

    if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
      inString = true;
      stringChar = ch;
      result += ch;
      continue;
    }
    if (inString) {
      result += ch;
      if (ch === stringChar && prev !== "\\") inString = false;
      continue;
    }

    if (ch === "{" || ch === "[") {
      result += ch + "\n" + indent.repeat(depth + 1);
      depth++;
    } else if (ch === "}" || ch === "]") {
      depth = Math.max(0, depth - 1);
      result = result.trimEnd() + "\n" + indent.repeat(depth) + ch;
    } else if (ch === ";") {
      result += ch + "\n" + indent.repeat(depth);
    } else if (ch === ",") {
      result += ch + "\n" + indent.repeat(depth);
    } else {
      result += ch;
    }
  }

  return result.replace(/\n\s*\n/g, "\n").trim();
}

export function minifyJs(js: string): string {
  return js
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([=+\-*/<>!&|,:;{}()\[\]])\s*/g, "$1")
    .trim();
}

// ── SQL Formatter ────────────────────────────────────────────────────────────

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
  "OUTER JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
  "ALTER TABLE", "DROP TABLE", "INDEX", "UNION", "UNION ALL", "AS",
  "DISTINCT", "AND", "OR", "NOT", "IN", "IS NULL", "IS NOT NULL",
  "BETWEEN", "LIKE", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END",
];

export function formatSql(sql: string): string {
  let result = sql.trim();
  const newlineBefore = [
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "GROUP BY", "ORDER BY", "HAVING",
    "LIMIT", "UNION", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  ];

  for (const kw of newlineBefore) {
    const re = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(re, `\n${kw}`);
  }

  // Indent after FROM / JOIN lines
  result = result
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      const isKeywordLine = newlineBefore.some((kw) =>
        trimmed.toUpperCase().startsWith(kw)
      );
      return isKeywordLine ? trimmed : `  ${trimmed}`;
    })
    .join("\n");

  // Uppercase keywords
  for (const kw of SQL_KEYWORDS) {
    const re = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(re, kw);
  }

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

export function minifySql(sql: string): string {
  return sql
    .replace(/--[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── URL Encode / Decode ──────────────────────────────────────────────────────

export type EncodeMode = "component" | "full" | "query";

export function encodeUrl(input: string, mode: EncodeMode = "component"): string {
  if (mode === "full") return encodeURI(input);
  if (mode === "query") {
    return input
      .split("&")
      .map((pair) => {
        const [k, ...v] = pair.split("=");
        return v.length
          ? `${encodeURIComponent(k)}=${encodeURIComponent(v.join("="))}`
          : encodeURIComponent(k);
      })
      .join("&");
  }
  return encodeURIComponent(input);
}

export function decodeUrl(input: string, mode: EncodeMode = "component"): string {
  if (mode === "full") return decodeURI(input);
  return decodeURIComponent(input);
}

// ── JWT Decoder ──────────────────────────────────────────────────────────────

export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
  expiresAt: Date | null;
  issuedAt: Date | null;
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const padded2 = pad ? padded + "=".repeat(4 - pad) : padded;
  return atob(padded2);
}

export function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts");

  const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
  const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
  const signature = parts[2];

  const exp = typeof payload.exp === "number" ? payload.exp : null;
  const iat = typeof payload.iat === "number" ? payload.iat : null;
  const expiresAt = exp ? new Date(exp * 1000) : null;
  const issuedAt = iat ? new Date(iat * 1000) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : null;

  return { header, payload, signature, isExpired, expiresAt, issuedAt };
}
