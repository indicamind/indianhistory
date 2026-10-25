import {
  findPeriod,
  findParent,
  getSubtreeSlugs,
  getTopLevelPeriods,
  periods,
  polities,
  themes,
  personalities,
} from './periods';

describe('Periods Data and Helpers', () => {
  it('should return all top-level periods', () => {
    const top = getTopLevelPeriods();
    expect(top.length).toBeGreaterThanOrEqual(7);
    const slugs = top.map(p => p.slug);
    expect(slugs).toContain('prehistory');
    expect(slugs).toContain('indus-valley');
    expect(slugs).toContain('early-historic');
    expect(slugs).toContain('classical');
    expect(slugs).toContain('medieval');
    expect(slugs).toContain('colonial');
    expect(slugs).toContain('modern');
  });

  it('should find periods at root and nested levels by slug', () => {
    const root = findPeriod('prehistory');
    expect(root).toBeDefined();
    expect(root?.name).toContain('Prehistory');

    const nested = findPeriod('lower-paleolithic');
    expect(nested).toBeDefined();
    expect(nested?.name).toBe('Lower Paleolithic');

    const nonExistent = findPeriod('non-existent-era');
    expect(nonExistent).toBeUndefined();
  });

  it('should find direct parent period for nested periods', () => {
    const parentOfPaleolithic = findParent('paleolithic');
    expect(parentOfPaleolithic?.slug).toBe('prehistory');

    const parentOfLowerPaleo = findParent('lower-paleolithic');
    expect(parentOfLowerPaleo?.slug).toBe('paleolithic');

    const parentOfRoot = findParent('prehistory');
    expect(parentOfRoot).toBeUndefined();
  });

  it('should return all subtree slugs for a hierarchical period', () => {
    const prehistory = findPeriod('prehistory')!;
    const slugs = getSubtreeSlugs(prehistory);
    expect(slugs).toContain('prehistory');
    expect(slugs).toContain('paleolithic');
    expect(slugs).toContain('lower-paleolithic');
    expect(slugs).toContain('middle-paleolithic');
    expect(slugs).toContain('upper-paleolithic');
    expect(slugs).toContain('mesolithic');
    expect(slugs).toContain('neolithic');
  });

  it('should validate all polities have required fields and valid kinds', () => {
    expect(polities.length).toBeGreaterThan(0);
    for (const polity of polities) {
      expect(polity.slug).toBeDefined();
      expect(polity.name).toBeDefined();
      expect(polity.range).toBeDefined();
      expect(polity.shortDescription).toBeDefined();
      expect(polity.description).toBeDefined();
      expect(['empire', 'regional-kingdom']).toContain(polity.kind);
    }
  });

  it('should validate all themes have required fields', () => {
    expect(themes.length).toBeGreaterThan(0);
    for (const theme of themes) {
      expect(theme.slug).toBeDefined();
      expect(theme.name).toBeDefined();
      expect(theme.range).toBeDefined();
      expect(theme.shortDescription).toBeDefined();
      expect(theme.description).toBeDefined();
    }
  });

  it('keeps polity parent links valid and acyclic', () => {
    expect(new Set(polities.map(polity => polity.slug)).size).toBe(polities.length);
    for (const polity of polities) {
      const seen = new Set([polity.slug]);
      let parent = polity.parent;
      while (parent) {
        expect(seen.has(parent)).toBeFalsy();
        seen.add(parent);
        const ancestor = polities.find(item => item.slug === parent);
        expect(ancestor).toBeDefined();
        parent = ancestor?.parent;
      }
    }
  });

  it('should validate all personalities have required fields', () => {
    expect(personalities.length).toBeGreaterThan(0);
    for (const person of personalities) {
      expect(person.slug).toBeDefined();
      expect(person.name).toBeDefined();
      expect(person.range).toBeDefined();
      expect(person.shortDescription).toBeDefined();
      expect(person.description).toBeDefined();
    }
  });
});
