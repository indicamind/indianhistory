import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { contentPath } from './content-urls';
import { languageFromUrl } from './languages';

// Keep the existing logical routes and lang query parameter inside Angular;
// serialize article/blog links as language-specific public URLs.
@Injectable()
export class LocalizedUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const tree = super.parse(url);
    const normalized = super.serialize(tree);
    const path = normalized.split(/[?#]/)[0];
    const route = contentPath(path);
    if (!route?.language) return tree;
    const logical = super.parse(route.path + normalized.slice(path.length));
    logical.queryParams = { ...logical.queryParams, lang: route.language };
    return logical;
  }

  override serialize(tree: UrlTree): string {
    const normalized = super.serialize(tree);
    const path = normalized.split(/[?#]/)[0];
    const route = contentPath(path);
    if (!route) return normalized;
    const language = route.language ?? languageFromUrl(typeof tree.queryParams['lang'] === 'string' ? tree.queryParams['lang'] : null);
    const copy = super.parse(normalized);
    delete copy.queryParams['lang'];
    const suffix = super.serialize(copy).slice(path.length);
    return (language === 'en' ? '' : '/' + language) + route.path + suffix;
  }
}
