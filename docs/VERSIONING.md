# Prototype versioning

This prototype follows the same URL pattern as [teaching-vacancies-prototype](https://github.com/DFE-Digital/teaching-vacancies-prototype):

| URL | Purpose |
|-----|---------|
| `/` | Version hub (pick a snapshot) |
| `/1-0/...` | Version **1.0** — frozen baseline |
| `/1-1/...` | Version **1.1** — WIP (create job flow improvements) |
| `/1-2/...` | Version **1.2** — WIP (forked from 1.0) |
| `/jobs`, `/home`, etc. (no prefix) | **Legacy redirect** → `/1-0/...` |

## Layout

- `app/versions/mount.js` — mounts each version, session data, link rewriting
- `app/versions/1-0/`, `app/versions/1-1/`, and `app/versions/1-2/` — full copies of `routes`, `views`, `data`, `middleware`, `helpers`, `lib`
- `app/views/prototypes/index.njk` — homepage hub
- `app/config.json`, `app/config.js` — shared kit config

## New version (for example 1-2)

1. Copy the version you are forking: e.g. `cp -R app/versions/1-0 app/versions/1-2`
2. Add `'1-2'` to `VERSIONS` in `app/versions/mount.js`
3. Update `server.js` skip logic via `prototypeVersions.versionPathSkip` (uses `VERSIONS` from mount)
4. Update the hub in `app/views/prototypes/index.njk`
5. Implement changes only under `app/versions/1-2/`

## Data generators

Mock data lives under each version’s `data/` folder. Generators write to `app/versions/1-1/data` (see `scripts/version-data-dir.js`). Run `npm run generate-data`, then copy JSON into `1-0/data` if you need both versions to stay in sync.