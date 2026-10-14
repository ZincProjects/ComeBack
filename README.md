# ComeBack

Injury-recovery companion prototype for student athletes. NTU CC0015 Health & Wellbeing project, built around the persona "Ryan".

All data is mock and stored only in the browser (localStorage). No backend, no login. Not medical advice.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs dist/
```

## Deploy

Static site on Vercel (framework preset: Vite, build `npm run build`, output `dist`). `vercel.json` rewrites all routes to `/index.html`.

```bash
npx vercel --prod
```
