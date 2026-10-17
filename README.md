# Musaib & Insha — Nikah Invitation

A responsive single-page wedding invitation built with React, TypeScript, Vite and Tailwind CSS.

## Run locally

1. Install Node.js (LTS) from https://nodejs.org/
2. Open this folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Ceremony details

Edit `src/App.tsx` near the top to update the ceremony details. The countdown uses the `Asia/Kolkata` timezone and targets **31 October 2026 at 4:00 PM IST**.

## Push this folder to GitHub

Create an empty repository on GitHub, then run these commands in the VS Code terminal from this folder (replace the URL with your own repository URL):

```bash
git init
git add .
git commit -m "Initial Nikah invitation website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not put passwords, tokens or private keys in this repository.

## Notes

- Google Maps opens a search/directions destination based on the supplied venue name and address; no unverified coordinates are used.
- The hero photograph is loaded from Unsplash. Replace the image URL in `src/App.tsx` with a locally licensed image if desired.
- The website has no backend, database, RSVP form or autoplay audio.
