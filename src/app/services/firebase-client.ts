import { appCheckSiteKey, firebaseConfig } from '../config/firebase.config';

let client: ReturnType<typeof initializeClient> | undefined;

async function initializeClient() {
  const [{ initializeApp, getApps }, { initializeAppCheck, ReCaptchaEnterpriseProvider }, { getFunctions, httpsCallable }] = await Promise.all([
    import('firebase/app'), import('firebase/app-check'), import('firebase/functions'),
  ]);
  const app = getApps().find(candidate => candidate.name === 'indian-history-views')
    ?? initializeApp(firebaseConfig, 'indian-history-views');
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
  return { functions: getFunctions(app, 'us-central1'), httpsCallable };
}

export function firebaseClient() {
  return client ??= initializeClient().catch(error => {
    client = undefined;
    throw error;
  });
}
