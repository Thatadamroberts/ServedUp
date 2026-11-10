// Pure helpers for scripts/bump-version.mjs, kept separate so they can be unit-tested.

/** Bumps a semver "major.minor.patch" string. */
export function bumpVersion(version, part) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!m) throw new Error(`Not a major.minor.patch version: ${version}`);
  let [major, minor, patch] = m.slice(1).map(Number);
  if (part === 'major') [major, minor, patch] = [major + 1, 0, 0];
  else if (part === 'minor') [minor, patch] = [minor + 1, 0];
  else if (part === 'patch') patch += 1;
  else throw new Error(`Unknown part "${part}": use major, minor or patch`);
  return `${major}.${minor}.${patch}`;
}

/**
 * Moves the notes under "## Unreleased" into a new "## [version] - date" section and leaves an
 * empty Unreleased section on top for the next round of changes.
 */
export function releaseChangelog(text, version, date) {
  const heading = '## Unreleased';
  const start = text.indexOf(heading);
  if (start < 0) throw new Error('CHANGELOG.md has no "## Unreleased" section');
  const bodyStart = start + heading.length;
  const next = text.indexOf('\n## ', bodyStart);
  const notes = text.slice(bodyStart, next < 0 ? undefined : next).trim();
  if (!notes) throw new Error('Nothing under "## Unreleased": add notes for this release first');
  const rest = next < 0 ? '' : text.slice(next + 1);
  return `${text.slice(0, start)}${heading}\n\n## [${version}] - ${date}\n\n${notes}\n\n${rest}`.replace(/\n{3,}/g, '\n\n');
}
