import type { ReactionRequest } from '../src/app/services/article-reaction.service';

// These replace the website's network clients in the extension build only.
export async function createViewCounter(): Promise<(slug: string) => Promise<unknown>> {
  return async (_slug: string) => undefined;
}

export async function createReactionWriter(): Promise<(request: ReactionRequest) => Promise<void>> {
  return async (_request: ReactionRequest) => undefined;
}
