#!/usr/bin/env node
// Usage: npm run version:bump -- <patch|minor|major>
// Bumps the app version in app.json (the source of truth), the Android versionCode and the
// iOS buildNumber together, keeps package.json in step, and dates the CHANGELOG's Unreleased notes.
import { readFileSync, writeFileSync } from 'node:fs';
import { bumpVersion, releaseChangelog } from './version-lib.mjs';

process.on('uncaughtException', (e) => {
  console.error(`version:bump: ${e.message}`);
  process.exit(1);
});

const part = process.argv[2];
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const write = (f, data) => writeFileSync(f, `${JSON.stringify(data, null, 2)}\n`);

const app = read('app.json');
const version = bumpVersion(app.expo.version, part);
const build = (app.expo.android?.versionCode ?? 0) + 1;
const today = new Date().toISOString().slice(0, 10);

writeFileSync('CHANGELOG.md', releaseChangelog(readFileSync('CHANGELOG.md', 'utf8'), version, today));

app.expo.version = version;
app.expo.android = { ...app.expo.android, versionCode: build };
app.expo.ios = { ...app.expo.ios, buildNumber: String(build) };
write('app.json', app);

const pkg = read('package.json');
pkg.version = version;
write('package.json', pkg);

const lock = read('package-lock.json');
lock.version = version;
if (lock.packages?.['']) lock.packages[''].version = version;
write('package-lock.json', lock);

console.log(`Served Up ${version} (build ${build}). Commit, then rebuild the native app.`);
