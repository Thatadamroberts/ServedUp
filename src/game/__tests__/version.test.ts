/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bumpVersion, releaseChangelog } from '../../../scripts/version-lib.mjs';

const root = new URL('../../../', import.meta.url);
const json = (f: string) => JSON.parse(readFileSync(new URL(f, root), 'utf8'));

test('version numbers agree across app.json, package.json and the changelog', () => {
  const { expo } = json('app.json');
  assert.match(expo.version, /^\d+\.\d+\.\d+$/);
  assert.equal(json('package.json').version, expo.version, 'package.json version');
  assert.equal(json('package-lock.json').version, expo.version, 'package-lock.json version');
  assert.ok(Number.isInteger(expo.android.versionCode) && expo.android.versionCode >= 1);
  assert.equal(expo.ios.buildNumber, String(expo.android.versionCode), 'iOS buildNumber matches Android versionCode');
  assert.equal(json('eas.json').cli.appVersionSource, 'local', 'EAS reads versions from app.json');
  const changelog = readFileSync(new URL('CHANGELOG.md', root), 'utf8');
  assert.ok(changelog.includes(`## [${expo.version}]`), `CHANGELOG.md has a section for ${expo.version}`);
});

test('bumpVersion', () => {
  assert.equal(bumpVersion('1.1.0', 'patch'), '1.1.1');
  assert.equal(bumpVersion('1.1.3', 'minor'), '1.2.0');
  assert.equal(bumpVersion('1.9.3', 'major'), '2.0.0');
  assert.throws(() => bumpVersion('1.1', 'patch'));
  assert.throws(() => bumpVersion('1.1.0', 'huge'));
});

test('releaseChangelog dates the Unreleased notes', () => {
  const before = '# Changelog\n\n## Unreleased\n\n- New thing\n\n## [1.0.0] - 2026-01-01\n\n- First\n';
  const after = releaseChangelog(before, '1.1.0', '2026-02-02');
  assert.equal(after, '# Changelog\n\n## Unreleased\n\n## [1.1.0] - 2026-02-02\n\n- New thing\n\n## [1.0.0] - 2026-01-01\n\n- First\n');
  assert.throws(() => releaseChangelog('# Changelog\n\n## Unreleased\n\n## [1.0.0]\n', '1.1.0', 'x'), /Nothing under/);
});
