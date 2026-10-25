const { HtmlParser } = require('@angular/compiler');

const headings = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const attachedBlocks = new Set(['figure', 'table', 'ol', 'ul']);
const nonProse = new Set([...headings, ...attachedBlocks, 'pre', 'script', 'style']);

function textLength(node, proseOnly) {
  if (node.constructor.name === 'Comment') return 0;
  if (node.name && proseOnly && nonProse.has(node.name)) return 0;
  if (typeof node.value === 'string') return node.value.trim().length;
  return (node.children || []).reduce((sum, child) => sum + textLength(child, proseOnly), 0);
}

// Return character offsets in the original HTML, so no content is reserialized
// and the client can insert an Angular component without splitting an element.
function articleBookInsertionOffsets(html) {
  const parsed = new HtmlParser().parse(html, 'article', { tokenizeBlocks: false, tokenizeLet: false });
  if (parsed.errors.length) return [html.length, html.length];
  const blocks = parsed.rootNodes.filter(node => node.name || textLength(node, false));
  let weights = blocks.map(node => textLength(node, true));
  if (!weights.some(Boolean)) weights = blocks.map(node => textLength(node, false));
  const total = weights.reduce((sum, length) => sum + length, 0);
  let before = 0;
  const candidates = [];
  for (let i = 1; i < blocks.length; i++) {
    before += weights[i - 1];
    // Keep headings with their content, and lists/media with their lead-in.
    if (headings.has(blocks[i - 1].name) || attachedBlocks.has(blocks[i].name)) continue;
    if (!before) continue;
    candidates.push({ offset: blocks[i].sourceSpan.start.offset, before });
  }
  // Very short articles may not have two safe internal boundaries.
  if (!candidates.length) return [html.length, html.length];
  if (candidates.length === 1) return [candidates[0].offset, html.length];

  let best;
  let distance = Infinity;
  for (let i = 0; i < candidates.length - 1; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const first = candidates[i];
      const second = candidates[j];
      // Prefer opposite halves, then boundaries nearest one-third and two-thirds.
      const penalty = (Number(first.before > total / 2) + Number(second.before < total / 2)) * total;
      const difference = penalty + Math.abs(first.before - total / 3) + Math.abs(second.before - total * 2 / 3);
      if (difference < distance) {
        best = [first.offset, second.offset];
        distance = difference;
      }
    }
  }
  return best;
}

module.exports = { articleBookInsertionOffsets };
