import { appCheckSiteKey, firebaseConfig } from '../config/firebase.config';

export async function createViewCounter(): Promise<(slug: string) => Promise<unknown>> {
  const [{ initializeApp }, { initializeAppCheck, ReCaptchaEnterpriseProvider }, { getFunctions, httpsCallable }] = await Promise.all([
    import('firebase/app'),
    import('firebase/app-check'),
    import('firebase/functions'),
  ]);
  const app = initializeApp(firebaseConfig, 'indian-history-views');
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  const increment = httpsCallable<{ slug: string }, { slug: string; success: boolean }>(
    getFunctions(app, 'us-central1'), 'incrementViewCount',
  );
  return slug => increment({ slug });
}
