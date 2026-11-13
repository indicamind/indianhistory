const fs = require('fs');
const os = require('os');
const path = require('path');
const { withStoryImages } = require('./personality-story-images');

describe('Personality story images', () => {
  let root;
  const image = {file: 'hill-fort.jpg', alt: 'A stone gateway', caption: 'The hill fort today'};
  const metadata = {chapters: [{image}, {image}]};
  const story = {chapters: [{id: 'birth'}, {id: 'return'}], sourcesHtml: 'Sources', draft: true};
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'story-images-'));
    const directory = path.join(root, 'content/media/images');
    fs.mkdirSync(directory, {recursive:true});
    fs.writeFileSync(path.join(directory, image.file), 'image fixture');
    fs.writeFileSync(path.join(directory, 'hill-fort.license.json'), JSON.stringify({author: 'Photographer', license: 'CC BY-SA 4.0', sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Fort.jpg'}));
  });
  afterEach(() => fs.rmSync(root, {recursive:true, force:true}));
  it('uses bundled images, preserves draft status and collects one source per image', () => {
    const result = withStoryImages(root, story, metadata);
    expect(result.chapters[0].image.src).toBe('assets/media/images/hill-fort.jpg');
    expect(result.chapters[1].image.alt).toBe(image.alt);
    expect(result.imageCredits.length).toBe(1);
    expect(result.imageCredits[0].license).toBe('CC BY-SA 4.0');
    expect(result.draft).toBeTruthy();
    expect(result.sourcesHtml).toBe('Sources');
  });
  it('rejects remote assets and missing localized descriptions', () => {
    expect(() => withStoryImages(root, story, {chapters: [{image: {...image, file: 'https://example.com/fort.jpg'}}]})).toThrow('local image');
    expect(() => withStoryImages(root, story, {chapters: [{image: {...image, alt: ''}}]})).toThrow('localized alt text');
  });
  it('rejects uncredited images', () => {
    fs.writeFileSync(path.join(root, 'content/media/images/hill-fort.license.json'), '{}');
    expect(() => withStoryImages(root, story, metadata)).toThrow('requires attribution');
  });
});
