// Walks the DOM and wraps any email addresses and SVRM phone numbers in a
// <span class="notranslate" translate="no"> so Google Translate leaves them
// untouched. Safe to call multiple times — already-wrapped matches are skipped.

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
// Matches +27 73 064 1481 / +27730641481 / 073 064 1481 / 0730641481
const PHONE_RE = /(\+?27[\s-]?7\d{1,2}[\s-]?\d{3}[\s-]?\d{4}|0\s?7\d{1,2}[\s-]?\d{3}[\s-]?\d{4})/;
const COMBINED = new RegExp(`${EMAIL_RE.source}|${PHONE_RE.source}`, "gi");

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "CODE", "PRE",
]);

const isInsideNoTranslate = (node: Node): boolean => {
  let el: HTMLElement | null = node.parentElement;
  while (el) {
    if (el.classList?.contains("notranslate")) return true;
    if (el.getAttribute && el.getAttribute("translate") === "no") return true;
    el = el.parentElement;
  }
  return false;
};

export const protectContactNodes = (root: ParentNode = document.body): void => {
  if (typeof window === "undefined" || !root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.nodeValue;
      if (!text || text.length < 5) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (isInsideNoTranslate(node)) return NodeFilter.FILTER_REJECT;
      COMBINED.lastIndex = 0;
      return COMBINED.test(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const targets: Text[] = [];
  let n: Node | null = walker.nextNode();
  while (n) {
    targets.push(n as Text);
    n = walker.nextNode();
  }

  for (const textNode of targets) {
    const text = textNode.nodeValue || "";
    const frag = document.createDocumentFragment();
    let last = 0;
    COMBINED.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = COMBINED.exec(text))) {
      if (m.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      const span = document.createElement("span");
      span.className = "notranslate";
      span.setAttribute("translate", "no");
      span.textContent = m[0];
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }
    textNode.parentNode?.replaceChild(frag, textNode);
  }
};
