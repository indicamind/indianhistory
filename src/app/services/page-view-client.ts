import { firebaseClient } from './firebase-client';

export async function createViewCounter(): Promise<(slug: string) => Promise<unknown>> {
  const { functions, httpsCallable } = await firebaseClient();
  const increment = httpsCallable<{ slug: string }, { slug: string; success: boolean }>(
    functions, 'incrementViewCount',
  );
  return slug => increment({ slug });
}
