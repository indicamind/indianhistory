import { firebaseClient } from './firebase-client';
import type { ReactionRequest } from './article-reaction.service';

export async function createReactionWriter() {
  const { functions, httpsCallable } = await firebaseClient();
  const setReaction = httpsCallable<ReactionRequest, { success: boolean }>(functions, 'setArticleReaction');
  return async (request: ReactionRequest): Promise<void> => { await setReaction(request); };
}
