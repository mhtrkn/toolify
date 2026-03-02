/**
 * Pure client-side data format conversion utilities.
 * No external dependencies — runs entirely in the browser.
 */

// ─── CSV ↔ JSON ───────────────────────────────────────────────────────────────

export function csvToJson(csv: string): Record<string, string>[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");
  const headers = parseCsvRow(lines[0]).map((h) => h.trim());
  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values = parseCsvRow(line);
      return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim() ?? ""]));
    });
}

export function jsonToCsv(data: unknown): string {
  if (!Array.isArray(data) || data.length === 0)
    throw new Error("Input must be a non-empty JSON array of objects.");
  const first = data[0];
  if (typeof first !== "object" || first === null)
    throw new Error("Each JSON array item must be an object.");
  const headers = Object.keys(first as Record<string, unknown>);
  const rows = data.map((row) =>
    headers
      .map((h) => escapeCsvValue(String((row as Record<string, unknown>)[h] ?? "")))
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// ─── JSON ↔ XML ───────────────────────────────────────────────────────────────

export function jsonToXml(data: unknown, rootTag = "root"): string {
  function serialize(obj: unknown, tag: string, indent = ""): string {
    if (Array.isArray(obj)) {
      return obj.map((item) => serialize(item, "item", indent)).join("\n");
    }
    if (obj !== null && typeof obj === "object") {
      const children = Object.entries(obj as Record<string, unknown>)
        .map(([k, v]) => serialize(v, k, indent + "  "))
        .join("\n");
      return `${indent}<${tag}>\n${children}\n${indent}</${tag}>`;
    }
    return `${indent}<${tag}>${escapeXml(String(obj ?? ""))}</${tag}>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n${serialize(data, rootTag)}`;
}

export function xmlToJson(xmlText: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML: " + (err.textContent?.slice(0, 120) ?? "parse error"));
  return nodeToObj(doc.documentElement);
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function nodeToObj(node: Element): unknown {
  if (node.children.length === 0) return node.textContent ?? "";
  const result: Record<string, unknown> = {};
  for (const child of Array.from(node.children)) {
    const key = child.tagName;
    const val = nodeToObj(child);
    if (key in result) {
      if (!Array.isArray(result[key])) result[key] = [result[key]];
      (result[key] as unknown[]).push(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export function parseCsvRow(row: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = "";
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export function escapeCsvValue(v: string): string {
  if (/[,"\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
