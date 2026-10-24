// Public Firebase identifiers; access is controlled by App Check enforcement.
export const firebaseConfig = {
  apiKey: 'AIzaSyC2vTiYOvmrP3bTo9c0BlK_W4Le8Nyg8oQ',
  authDomain: 'indiahistorypageviews.firebaseapp.com',
  projectId: 'indiahistorypageviews',
  appId: '1:459246488891:web:ddc1fc5a3fea90c343fb1e',
};

export const appCheckSiteKey = '6LemIv4tAAAAABGBPhnlPrsgZ-3HcBUBsOogJitZ';

export function supportsViewCounting(url: URL): boolean {
  return url.protocol === 'https:' && (
    url.hostname === 'www.indiahistory.info' ||
    (url.hostname === 'indicamind.github.io' && url.pathname.startsWith('/indianhistory/'))
  );
}
