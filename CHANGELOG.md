# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versions prior to 2.0.0 are not listed here; consult the git history for earlier changes.

## [2.0.0]

Consumes Mirador 4 via `hsp-fo-workspace` 2.0.0 and migrates the app to React 19 / MUI 7.

### Changed

- `hsp-fo-workspace` dependency bumped to `^2.0.0` (transitively pulls in Mirador 4).
- `hsp-web-module` dependency bumped to `^2.0.0`.
- `react` and `react-dom` upgraded `^17` -> `^19` (staged via `^18`).
- `@material-ui/core` v4 migrated to `@mui/material` v7.
- Added `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, and `tss-react` for the MUI 7 migration.
- `react-shadow` upgraded to `^20`.
- `react-redux` upgraded to `^9` and `redux` to `^5`.
- `react-query` v3 migrated to `@tanstack/react-query` v5.
- `react-i18next` upgraded to `^15` and `i18next` to `^25`.
- `@testing-library/react` upgraded to `^16`.
- `react-virtualized` replaced with `@tanstack/react-virtual`.
- `react-router-dom` v6 replaced with `react-router` v7.
- `@react-keycloak/web` replaced with a custom in-repo `KeycloakProvider`.
- `nuka-carousel` replaced with `embla-carousel-react`.

### Fixed

- Coalesce the workspace `MutationObserver` callback via `requestAnimationFrame` to reduce thrash during DOM updates (#24126).
- Search submit button now exposes its localized accessible name ("Suchen"/"Search") instead of the hardcoded `searchButton` `aria-label`.
- `i18next` support-notice banner now disabled in all environments.
- Deselecting the last active filter now drops the empty `fq` parameter from the URL instead of leaving an empty filter query behind (#24494).
- `isIIIFImageUrl` now returns `false` for non-IIIF thumbnail URLs instead of throwing a `TypeError` when the IIIF Image API regex finds no match (#24496).
- Removing several active-filter chips in quick succession now applies every removal instead of keeping only the last-clicked one (#24493).
- Header back buttons ("Zurück zur Suche", "Verwerfen") now return to the previous result list with its search term, filters, sorting, and paging preserved instead of resetting to a bare `/search` (#24497, #24507).
- Returning to the search via the sidebar "Search" link now keeps the most recent change (result page, sort, rows) instead of resetting to page 1 (#24550).
- Search field selection (collapsed) now keeps the v4 padding and alignment instead of MUI 7's reduced `.MuiSelect-select` padding and taller trigger (#24562).
- Tooltips now follow the mouse cursor on hover instead of appearing far from large clickable areas (e.g. result thumbnails, hit headings), and stay anchored to the element under keyboard focus (#19930).
- Result-context description cards' "add to workspace" Fab no longer renders on top of the open filter drawer; it is now covered like the IIIF thumbnail Fab (#24563).
- On mobile, the result-list filter button now slides away and back together with the header on scroll instead of staying anchored to the top of the result list, so scrolling back up no longer shows the header without the filter button (#24567).
- The `openAuthorityIdInSearchClicked` listeners now cancel the event to signal the workspace that the click was handled, keeping the portal's internal authority page navigation now that the workspace's authority links fall back to opening the portal's authority page via the permalink resolver in a new tab (#22401).
- The authority page's "Show Manuscript" button is now hidden when the page is opened without manuscript context (deep link, bookmark, new tab) instead of leading to an empty search (#24754).
- The authority overview card's variant names are now typed with their real API object shape (`{name, languageCode}` instead of `string[]`) and rendered with collision-free React keys, removing the duplicate-key `console.error`s React 19 surfaced in tests.

### Security

- Bumped `uuid` to `^11.1.1` and removed `@types/uuid` (v11 ships its own types).
- Removed the `immutable` `^3.8.3` override (obsoleted upstream by mirador-annotation-editor 1.3.1), letting it resolve to the fixed 4.3.9.
- Updated the vulnerable server-side stack in range: `express` 4.22.2 (with `qs` 6.15.3, `body-parser` 1.20.6, `path-to-regexp` 0.1.13), `i18next-fs-backend` 2.6.7, `i18next-http-middleware` 3.9.8, `http-proxy-middleware` 2.0.10, `compression` 1.8.1 (with `on-headers` 1.1.0).
- Updated further vulnerable transitive dependencies in range: `axios` 1.19.0, `react-router-dom` 6.30.4, `dompurify` 3.4.13, `form-data` 4.0.6, `ajv` 6.15.0/8.20.0, `picomatch` 2.3.2, `basic-ftp` 5.3.1, `shell-quote` 1.10.0, `fast-uri` 3.1.5.
- Upgraded `react-router` to v7, resolving an open-redirect (CVE-2026-53669) and an unsafe-reflection (CVE-2026-53666) advisory fixed only in v7.
- Replaced `eureka-js-client` with the `@rocketsoftware/eureka-js-client` fork, dropping the vulnerable `request` dependency chain.
- Forced `lodash` to 4.18.1 and `parse-link-header` to 2.0.0 via `overrides`.

### Tooling

- Added `typecheck` (`tsc --noEmit`).
- `tsconfig.json` now declares an explicit `include` covering `src/` and `test/`.
- `jest` coverage glob tightened to `src/**/*.{ts,tsx}` (excluding `.d.ts`); ts-jest transform widened to also cover `.js`/`.jsx`.
- `jest` now ignores build artifacts to avoid a Haste module-naming collision.
- Added `eslint-plugin-jest` and `eslint-plugin-testing-library`; `@mui` imports given their own import-sort group; `no-magic-numbers` disabled.
- Re-enabled the navigation test suite and added rendering/axe coverage for previously untested components; eliminated `act()` and i18n re-init warnings across specs.
