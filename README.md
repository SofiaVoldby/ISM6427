# ISM6427

A glassmorphic weather app powered by the [Open-Meteo](https://open-meteo.com/) API. Defaults to Boca Raton, FL, with city search and geolocation.

## Running locally

Static site, no build step. Serve the root with any static file server, e.g.:

```bash
npx serve .
```

## Deploying

Drop this repo into Netlify (publish directory `.`, no build command — see `netlify.toml`).
