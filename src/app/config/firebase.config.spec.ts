import { supportsViewCounting } from './firebase.config';

describe('View counting locations', () => {
  it('supports both production sites and nested localized routes', () => {
    for (const address of [
      'https://www.indiahistory.info/article/ashoka-edicts',
      'https://indicamind.github.io/indianhistory/',
      'https://indicamind.github.io/indianhistory/hi/article/ashoka-edicts',
    ]) expect(supportsViewCounting(new URL(address))).toBeTruthy();
  });

  it('excludes local previews, other repositories, and lookalike domains', () => {
    for (const address of [
      'http://localhost:4200/article/ashoka-edicts',
      'http://www.indiahistory.info/article/ashoka-edicts',
      'https://indicamind.github.io/other-repo/',
      'https://indicamind.github.io/indianhistory-other/',
      'https://indicamind.github.io/',
      'https://www.indiahistory.info.example.com/',
    ]) expect(supportsViewCounting(new URL(address))).toBeFalsy();
  });
});
