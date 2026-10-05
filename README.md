# Creator Studio

A responsive React studio with six browser-side generators for video prompts, image prompts, YouTube titles, YouTube descriptions, hashtags, and story scripts.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Generation

The generators use structured templates in the browser. They need no API key, send no input to a server, and are not connected to a hosted AI model. Connect a server-side AI provider to `src/generators.js` if model-generated results are required; keep provider credentials on the server.

## Install and test the PWA

Run `npm run dev` and open the localhost URL in Chrome or Edge. After the service worker activates, use the install icon in the address bar or the browser menu's **Install Creator Studio** option. In DevTools, check **Application → Manifest** to confirm installability; under **Application → Service Workers**, confirm the worker is active. To test offline use, load the app once, switch DevTools' network setting to **Offline**, and reload. Recent creations remain in local storage across reloads.

On iOS, use Safari's **Share → Add to Home Screen** instead of a browser install prompt.