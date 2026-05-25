// Pure server-safe markdown → HTML converter (no browser APIs).
// Admin-created content only — minimal sanitisation applied.

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function processInline(text: string): string {
  return (
    text
      // Images before links to avoid conflict
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        const safeAlt = escapeHtml(alt);
        const safeSrc = src.startsWith("http") ? src : "";
        return `<img src="${safeSrc}" alt="${safeAlt}" class="md-img" loading="lazy" />`;
      })
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        const safeHref = href.startsWith("http") || href.startsWith("/") ? href : "#";
        return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="md-link">${label}</a>`;
      })
      // Bold + Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
      // Line break
      .replace(/  \n/g, "<br />")
  );
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  const lines = markdown.split("\n");
  const output: string[] = [];
  let i = 0;
  let inParagraph = false;
  let paragraphLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ").trim();
      if (text) output.push(`<p class="md-p">${processInline(text)}</p>`);
      paragraphLines = [];
    }
    inParagraph = false;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      flushParagraph();
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      const langClass = lang ? ` class="language-${lang}"` : "";
      output.push(`<pre class="md-pre"><code${langClass}>${codeLines.join("\n")}</code></pre>`);
      i++;
      continue;
    }

    // Heading
    const hMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (hMatch) {
      flushParagraph();
      const level = hMatch[1].length;
      const text = hMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      output.push(`<h${level} id="${id}" class="md-h${level}">${processInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ") || line === ">") {
      flushParagraph();
      const quoteLines: string[] = [line.replace(/^> ?/, "")];
      i++;
      while (i < lines.length && (lines[i].startsWith("> ") || lines[i] === ">")) {
        quoteLines.push(lines[i].replace(/^> ?/, ""));
        i++;
      }
      output.push(`<blockquote class="md-blockquote"><p>${processInline(quoteLines.join(" "))}</p></blockquote>`);
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      flushParagraph();
      output.push('<hr class="md-hr" />');
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+] /, "").trim());
        i++;
      }
      output.push(
        `<ul class="md-ul">${items.map((t) => `<li>${processInline(t)}</li>`).join("")}</ul>`,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, "").trim());
        i++;
      }
      output.push(
        `<ol class="md-ol">${items.map((t) => `<li>${processInline(t)}</li>`).join("")}</ol>`,
      );
      continue;
    }

    // Empty line → flush paragraph
    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    // Regular text — accumulate into paragraph
    paragraphLines.push(line);
    inParagraph = true;
    i++;
  }

  flushParagraph();
  // suppress unused variable warning
  void inParagraph;

  return output.join("\n");
}

export function extractTOC(markdown: string): { id: string; text: string; level: number }[] {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{1,4})\s+(.+)/))
    .filter(Boolean)
    .map((m) => {
      const level = m![1].length;
      const text = m![2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      return { id, text, level };
    });
}
