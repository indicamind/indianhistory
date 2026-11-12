const { sections } = require('../../../scripts/build-personality-profiles');

describe('Personality biography extraction', () => {
  it('keeps complete prose paragraphs and excludes figure captions and detached citations', () => {
    const result = sections('<h2>A ruler&#39;s life</h2><p>Founded <strong>Udaipur</strong> in 1559 <sup>[1]</sup>.</p><figure><img src="x.jpg"><figcaption><p>Photographer credit</p></figcaption></figure><p>Before the siege.[2]</p><h2>Sources</h2><p>Reference</p>');
    expect(result[0]).toEqual({ heading: "A ruler's life", paragraphs: ['Founded Udaipur in 1559.', 'Before the siege.'] });
    expect(result.length).toBe(2);
  });

  it('preserves translated script and factual dates', () => {
    const result = sections('<h2>जीवनी</h2><p>उदय सिंह द्वितीय ने 1559 में उदयपुर की स्थापना की।</p>');
    expect(result[0].paragraphs).toEqual(['उदय सिंह द्वितीय ने 1559 में उदयपुर की स्थापना की।']);
  });
});
