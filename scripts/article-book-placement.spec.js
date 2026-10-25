const { HtmlParser } = require('@angular/compiler');
const { articleBookInsertionOffsets } = require('./article-book-placement');

function split(html) {
  const offsets = articleBookInsertionOffsets(html);
  const boundaries = [0, ...offsets, html.length];
  const parts = boundaries.slice(1).map((end, index) => html.slice(boundaries[index], end));
  expect(parts.join('')).toBe(html);
  for (const part of parts) {
    expect(new HtmlParser().parse(part, 'article', { tokenizeBlocks: false }).errors.length).toBe(0);
  }
  return { offsets, parts };
}

describe('Books distributed through an article', () => {
  it('places books near one-third and two-thirds while keeping headings with their sections', () => {
    const first = '<h2>First section</h2><p>AAAA</p>\n<p>BBBB</p>\n';
    const middle = '<h2>Second section</h2><p>CCCC</p>\n<p>DDDD</p>\n';
    const last = '<h2>Third section</h2><p>EEEE</p>\n<p>FFFF</p>';
    const result = split(first + middle + last);
    expect(result.parts).toEqual([first, middle, last]);
    expect(result.offsets).toEqual([first.length, first.length + middle.length]);
  });

  it('keeps figures, tables, lists and their lead-ins whole, without counting a long bibliography as prose', () => {
    const first = '<p>AAAA</p>\n<figure>\n<img src="image.jpg">\n\n<figcaption>' + 'caption '.repeat(100) + '</figcaption>\n</figure>\n'
      + '<p>BBBB</p><table><tr><td>cell</td></tr></table><ul><li>item</li></ul>\n';
    const middle = '<h2>Middle</h2><p>CCCC</p><p>DDDD</p>\n';
    const last = '<h2>End</h2><p>EEEE</p><p>FFFF</p><h2>Sources</h2><ol><li>' + 'reference '.repeat(200) + '</li></ol>';
    expect(split(first + middle + last).parts).toEqual([first, middle, last]);
  });

  it('preserves Unicode, comments and link attributes without reserializing the HTML', () => {
    const first = '<!-- an editorial note --><p>मेवाड़</p>\n';
    const middle = '<p><a href="/article/test?lang=hi&amp;dev=true">मेवाड़</a></p>\n';
    const last = '<p>मेवाड़</p>';
    expect(split(first + middle + last).parts).toEqual([first, middle, last]);
  });

  it('uses the available boundary then the end for two-paragraph content', () => {
    const first = '<p>AAAA</p>\n';
    const last = '<p>BBBB</p>';
    expect(split(first + last).parts).toEqual([first, last, '']);
  });

  it('uses the second half after a long indivisible quotation rather than grouping both books before it', () => {
    const first = '<p>AAAA</p><p>BBBB</p>';
    const middle = '<blockquote><p>' + 'C'.repeat(24) + '</p></blockquote>';
    const last = '<h2>Sources</h2><ol><li>Reference</li></ol>';
    expect(split(first + middle + last).parts).toEqual([first, middle, last]);
  });

  it('leaves single blocks and empty content intact when no internal boundary exists', () => {
    for (const html of ['', '<p>One paragraph.</p>', '<ul><li>First</li><li>Second</li></ul>']) {
      expect(articleBookInsertionOffsets(html)).toEqual([html.length, html.length]);
    }
    const malformed = '<p>Do not split malformed markup.</div>';
    expect(articleBookInsertionOffsets(malformed)).toEqual([malformed.length, malformed.length]);
  });
});
