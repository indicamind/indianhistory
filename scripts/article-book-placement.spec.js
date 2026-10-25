const { HtmlParser } = require('@angular/compiler');
const { articleBookInsertionOffset } = require('./article-book-placement');

function split(html) {
  const offset = articleBookInsertionOffset(html);
  const before = html.slice(0, offset);
  const after = html.slice(offset);
  expect(before + after).toBe(html);
  for (const part of [before, after]) {
    expect(new HtmlParser().parse(part, 'article', { tokenizeBlocks: false }).errors.length).toBe(0);
  }
  return { offset, before, after };
}

describe('Mid-article book placement', () => {
  it('uses the middle of the prose while keeping the next heading with its section', () => {
    const first = '<h2>First section</h2><p>AAAA</p>\n<p>BBBB</p>\n';
    const second = '<h2>Second section</h2><p>CCCC</p>\n<p>DDDD</p>';
    const result = split(first + second);
    expect(result.before).toBe(first);
    expect(result.after).toBe(second);
  });

  it('keeps figures, tables, lists and their lead-ins whole, without counting a long bibliography as prose', () => {
    const first = '<p>AAAA</p>\n<figure>\n<img src="image.jpg">\n\n<figcaption>' + 'caption '.repeat(100) + '</figcaption>\n</figure>\n'
      + '<p>BBBB</p><table><tr><td>cell</td></tr></table><ul><li>item</li></ul>\n';
    const second = '<h2>Next</h2><p>CCCC</p><p>DDDD</p><h2>Sources</h2><ol><li>' + 'reference '.repeat(200) + '</li></ol>';
    const result = split(first + second);
    expect(result.before).toBe(first);
    expect(result.after).toBe(second);
  });

  it('preserves Unicode, comments and link attributes without reserializing the HTML', () => {
    const first = '<!-- an editorial note --><p>मेवाड़</p>\n';
    const second = '<p><a href="/article/test?lang=hi&amp;dev=true">राजस्थान</a></p>';
    const result = split(first + second);
    expect(result.before).toBe(first);
    expect(result.after).toBe(second);
  });

  it('leaves single blocks and empty content intact when no internal boundary exists', () => {
    for (const html of ['', '<p>One paragraph.</p>', '<ul><li>First</li><li>Second</li></ul>']) {
      expect(articleBookInsertionOffset(html)).toBe(html.length);
    }
    const malformed = '<p>Do not split malformed markup.</div>';
    expect(articleBookInsertionOffset(malformed)).toBe(malformed.length);
  });
});
