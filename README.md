# Pinyin Garden

Guided Mandarin sound lessons, interactive sound chart, tone games and 188 self-hosted recordings. Optional single-file offline HTML export.

Live site: https://pinyin.reallyenglish.cn

## Appearance and privacy

Light, dark and system themes are supported, with a preference remembered per app/browser. A same-origin bootstrap applies the theme before the main application bundle loads. Dark surfaces use a soft palette, not blanket colour inversion. No accounts, tracking, camera or microphone; learning progress stays in the browser.

## Run

Requires Node.js 22 and npm; optional asset/offline scripts use Python 3.

```sh
npm ci
npm run dev
```

Vite listens on loopback. `npm run build` creates static output in `dist/`; `npm run preview` serves that build locally. Deploy `dist/` at a domain root over HTTPS; preserve correct JavaScript/CSS/MP3/JSON MIME types and return 404 for missing assets.

## Verify

```sh
npm test
npm run build
python3 scripts/build_offline.py
npx playwright install chromium
npx playwright test
TEST_COLOR_SCHEME=dark npx playwright test
```

Playwright automatically starts an isolated local preview server. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing Chromium executable instead. CI runs unit tests, production builds and browser tests in light and dark modes. CI does not deploy the website.

## Learning assets

Recordings are unmodified syllables by Chen Wang, from `hugolpz/audio-cmn`. Source manifests in `public/` include commit-pinned original URLs, attribution, byte counts and SHA-256 hashes. Original attribution is preserved in `public/credits/`. Asset-fetch scripts under `scripts/` download the originals from upstream.

## Interest-led sound missions for roughly ages 8–10

Two additional five-question listening missions are available under **Sound missions**: spelling detective (choose the spelling of a recorded syllable) and tone twins (compare two recordings). Each question bank has twelve entries; a session selects five. Spelling distractors share the target's tone, so the game exercises the whole syllable rather than just tone-mark matching.

Choices unlock only after the relevant recording(s) finish; failed playback, cancelled rounds and stale callbacks cannot unlock answers. Corrected retries are welcome, with no timer or score penalty. Completion badges mark explored mission types, not pronunciation mastery. New records are stored separately from existing lesson progress, and the parent reset clears them. Browser tests complete both missions with real MP3 playback and exercise recovery, mobile/dark layouts and the regenerated offline export.

## Learning limitations

This is introductory learning material, not a complete official Mandarin/primary-school curriculum or an official textbook mapping. Adult guidance is recommended. Isolated-character citation pronunciations do not teach all contextual neutral tones or tone-sandhi rules; screen tracing does not replace pencil-and-paper practice.

## Licensing

No project-wide open-source license has yet been selected for the original application code. Third-party assets/dependencies retain their own licenses; public visibility does not relicense them. See [THIRD_PARTY.md](THIRD_PARTY.md), especially the upstream audio license-version caveat, before reuse or redistribution.

## Repository scope

Contains application source, tests and attributed learning assets. Excludes production infrastructure configuration, credentials, local operational records, backups and device-local progress.

## Offline export

After building, `python3 scripts/build_offline.py` creates `deliverables/Pinyin-Garden.html` with embedded recordings, theme code and attribution. It is browser-tested with networking disabled. Generated deliverables are not committed.
