# twc-web

A Next.js 15 app (Pages Router) with Truworth sign-in (`@truworth/twc-auth`) and every
published OmniWell tracker (`@rajs8952/tracker-*`), with a Hub home.

## Setup

1. **Registry access.** `.npmrc` (git-ignored) needs:
   - `@rajs8952:registry=https://npm.pkg.github.com` plus a GitHub token with `read:packages`
     (`//npm.pkg.github.com/:_authToken=…`), for the water tracker;
   - the private npm token (`//registry.npmjs.org/:_authToken=…`), for `@truworth/*`;
   - `legacy-peer-deps=true`: twc-auth lists React Native peers a web app doesn't install.
2. **Environment.** Copy `.env.example` to `.env.local` and fill in the Truworth API values.
   `NEXT_PUBLIC_TWC_API_BASE_URL` is required: twc-auth stops at startup without it.
   `NEXT_PUBLIC_GOOGLE_CLIENT_ID` turns on "Continue with Google".
3. **Run:**
   ```bash
   npm install
   npm run dev
   ```

## How it fits together

| Path | What it shows |
|---|---|
| `/` | Sends members to `/dashboard`, everyone else to `/login` |
| `/login`, `/registration` | twc-auth's sign-in (email, password, OTP, SSO) and sign-up |
| `/dashboard` | The Hub: today's progress on every tracker, alerts, and the wellness team |
| `/water` | Today, Stats, Garden and Goal |
| `/mood` | Check-ins; an "Awful" mood opens the crisis prompt with the EAP helpline |
| `/meditation`, `/sleep`, `/weight`, `/exercise`, `/bmi` | The other trackers |

- `src/pages/_app.tsx`: `AuthProvider`, with the saved session, `onLogin`/`onLogout` and the router adapter.
- `src/components/MemberShell.tsx`: every members-only page. Redirects signed-out visitors,
  waits for the profile, and wraps the page in a `TrackerStorageProvider` with the member's storage.
- `src/lib/member-storage.ts`: each member's data (all trackers and the goal details), saved in
  this browser under `twc-web:member:<member id>`, so people sharing a browser never see each
  other's data. Swap `createLocalStorage()` for `createRestStorage()` to sync across devices.
- `src/lib/wellness-team.ts`: the EAP, therapist and dietitian contacts and the emergency
  number, used by the Hub and by alerts from `@rajs8952/interventions`.
- `src/lib/session.ts` and `src/lib/router-adapter.ts`: the saved token and twc-auth's navigation.
- `next.config.mjs`: compiles twc-auth, and blanks a React Native icon import its web build doesn't use.
- `tailwind.config.ts`: the `@rajs8952/config-tailwind` preset; recolour with the `--omni-*` variables in `src/styles/globals.css`.
