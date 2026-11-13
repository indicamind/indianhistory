const fs = require('fs');
const os = require('os');
const path = require('path');
const {buildProfiles} = require('./build-personality-profiles');

describe('Personality header portraits', () => {
  let root;
  const portrait = {file: 'ruler-portrait.jpg', alt: 'A ruler on horseback.', kind: 'Later artwork'};
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'personality-portrait-'));
    fs.mkdirSync(path.join(root, 'content/data'), {recursive:true});
    fs.mkdirSync(path.join(root, 'content/media/images'), {recursive:true});
    fs.writeFileSync(path.join(root, 'content/data/personality-profiles.json'), JSON.stringify({ruler:{events:[], sources:[], portrait}}));
    fs.writeFileSync(path.join(root, 'content/media/images/ruler-portrait.jpg'), 'image fixture');
    fs.writeFileSync(path.join(root, 'content/media/images/ruler-portrait.license.json'), JSON.stringify({author:'An artist', license:'Public domain', sourcePageUrl:'https://commons.wikimedia.org/wiki/File:Ruler.jpg'}));
  });
  afterEach(() => fs.rmSync(root, {recursive:true, force:true}));
  it('localizes a standalone portrait and preserves visible attribution and its source', () => {
    const profile = buildProfiles(root, [], [], {'A ruler on horseback.':'Un souverain à cheval.', 'Later artwork':'Œuvre postérieure', 'Public domain':'Domaine public'}, 'fr').ruler;
    expect(profile.image.alt).toBe('Un souverain à cheval.');
    expect(profile.image.credit).toBe('An artist · Domaine public');
    expect(profile.image.sourceUrl).toBe('https://commons.wikimedia.org/wiki/File:Ruler.jpg');
    expect(profile.image.framedPortrait).toBeTruthy();
  });
  it('rejects missing translations before a portrait can appear in a localized page', () => {
    expect(() => buildProfiles(root, [], [], {}, 'fr')).toThrow('translated alt text');
  });
});
