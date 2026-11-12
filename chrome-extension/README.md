# India History — offline Chrome reader

Click the extension's toolbar icon to open the full India History application
in a tab from files installed inside the extension. Chrome's normal new-tab
page stays unchanged. Reading, search, images, books, timelines, themes, personalities,
blogs, and all released language editions work without an internet connection.
The extension makes no HTTP(S) requests and does not open the website.

## Automatic build

From the repository root:

```sh
npm run build
```

The root `postbuild` lifecycle automatically builds and packages the offline
extension after generating the website's deployable `dist` and share pages:

- `chrome-extension/dist/india-history-new-tab/` — loadable extension.
- `chrome-extension/dist/india-history-new-tab.zip` — packaged extension.

This is part of every production build. Keep it automatic when changing the
website build. A failed extension build fails the overall build.

To rebuild just the extension from current content and cached counter data:

```sh
npm --prefix chrome-extension run build
```

Standalone builds validate translations, optimize local media, generate current
content, compile the Angular reader, and package it. The private
`--content-ready` flag is used by the root build to reuse its freshly generated
content and optimized images.

## Install or update locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select `chrome-extension/dist/india-history-new-tab`.
4. In Chrome's Extensions menu (the puzzle icon), pin **India History** to the toolbar.
5. Click its toolbar icon to open the offline reader.

After rebuilding, click **Reload** on the existing extension card, then click
the toolbar icon. You can disconnect from the internet and continue reading.

An installed extension contains a content snapshot. Website deployments do not
change that snapshot; new content is delivered by rebuilding and installing or
reloading the extension. A Chrome Web Store distribution would deliver later
versions through extension updates. This build does not publish the package or
install it into a personal browser profile.

## Offline behavior

- All published article and blog editions, interface translations, search data,
  book metadata, and media are bundled. Unpublished draft assets are emptied.
- Hash routes keep navigation, refresh, article guides, and links between pages
  inside the installed `newtab.html`. The selected language is saved locally.
- A local service worker opens that bundled page when the toolbar icon is
  clicked. It does not override the new-tab page or open tabs automatically.
- Images and app code load from the extension. The reader uses local system
  fonts. The website keeps its normal web fonts in its separate build.
- Ads and network clients are excluded. View counts are bundled snapshots;
  article reactions are remembered locally without a backend call.
- External source and book URLs are preserved as metadata, but displayed links
  do not navigate online. Their original URLs are available as hover text.
  Article and blog reference URLs are also displayed as copyable plain text.
  Purchase buttons are hidden while book titles, authors, and covers remain.
- The Manifest V3 policy permits resource loading and connections only from the
  extension itself. No additional browser or website permissions are requested.

`offline-content.json` in the built package records its build date, languages,
article/blog counts, and media count. The builder checks complete language
editions, nonempty stories, local image availability, and absence of remote
resources in the shell and styles before creating the ZIP.

Extension labels are translated in `translations.json` for all site languages.
Only Chrome's supported installation-label locales are packaged under
`_locales`; the reader itself includes every released website language.

References: [Chrome toolbar actions](https://developer.chrome.com/docs/extensions/reference/api/action),
[local installation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked),
[Chrome locale support](https://developer.chrome.com/docs/extensions/reference/api/i18n#locales).
