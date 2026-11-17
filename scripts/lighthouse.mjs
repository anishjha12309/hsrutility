/**
 * Lighthouse gate.
 *
 * Runs the built site (npm run preview) through Lighthouse on both form factors and
 * prints a score table. Exits non-zero if any category on any page/form factor is
 * below the threshold, so it works as a check as well as a report.
 *
 *   npm run lh                 # default pages
 *   npm run lh -- /arul /terms
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ORIGIN = process.env.LH_ORIGIN ?? 'http://localhost:4321';
const THRESHOLD = Number(process.env.LH_THRESHOLD ?? 90);

/**
 * chrome-launcher builds its throwaway profile under os.tmpdir(). Point that at a
 * directory we can definitely write to (LH_TMP, else the system default) — on a
 * locked-down Windows box the bare temp root can be permission-denied.
 */
const TMP = process.env.LH_TMP ?? tmpdir();
mkdirSync(TMP, { recursive: true });
const childEnv = { ...process.env, TMPDIR: TMP, TEMP: TMP, TMP: TMP };

const paths = process.argv.slice(2).filter((a) => a.startsWith('/'));
const PAGES = paths.length ? paths : ['/', '/arul', '/privacy', '/support'];

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const outDir = join(TMP, 'hsr-lh');
mkdirSync(outDir, { recursive: true });

const bin = join('node_modules', '.bin', process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse');

function run(url, formFactor) {
  const outPath = join(outDir, `${formFactor}-${url.replace(/\W+/g, '_')}.json`);
  rmSync(outPath, { force: true });

  const args = [
    url,
    '--quiet',
    '--output=json',
    `--output-path=${outPath}`,
    `--only-categories=${CATEGORIES.join(',')}`,
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    // Deterministic runs: no extensions, no first-run noise.
    '--disable-full-page-screenshot',
  ];
  if (formFactor === 'desktop') args.push('--preset=desktop');

  /*
   * chrome-launcher deletes its temp profile after the run, and on Windows that
   * rmSync intermittently loses a race with Chrome releasing its file handles —
   * EPERM, non-zero exit, AFTER the report has already been written to disk.
   * So a failed exit is only a real failure if the report is missing or unreadable.
   */
  let launchError = null;
  try {
    execFileSync(bin, args, {
      stdio: ['ignore', 'ignore', 'pipe'],
      shell: process.platform === 'win32',
      env: childEnv,
    });
  } catch (error) {
    launchError = error;
  }

  let report;
  try {
    report = JSON.parse(readFileSync(outPath, 'utf8'));
  } catch {
    const stderr = launchError?.stderr?.toString() ?? String(launchError);
    throw new Error(`Lighthouse produced no report for ${url} (${formFactor}):\n${stderr}`);
  }
  const scores = Object.fromEntries(
    CATEGORIES.map((c) => [c, Math.round((report.categories[c]?.score ?? 0) * 100)])
  );

  // Surface the numbers that actually drive the Performance score, so a failing run
  // says WHY rather than just how much.
  const audits = report.audits;
  const metrics = {
    lcp: audits['largest-contentful-paint']?.numericValue,
    cls: audits['cumulative-layout-shift']?.numericValue,
    tbt: audits['total-blocking-time']?.numericValue,
    fcp: audits['first-contentful-paint']?.numericValue,
  };

  const failed = [];
  for (const c of CATEGORIES) {
    for (const ref of report.categories[c].auditRefs) {
      const a = audits[ref.id];
      if (!a || a.scoreDisplayMode === 'notApplicable' || a.scoreDisplayMode === 'informative') continue;
      if (a.score !== null && a.score < 0.9) {
        failed.push(`${c}/${ref.id}${a.displayValue ? ` (${a.displayValue})` : ''}`);
      }
    }
  }

  return { scores, metrics, failed };
}

const ms = (v) => (v == null ? '—' : `${(v / 1000).toFixed(2)}s`);
let allPass = true;
const problems = new Map();

console.log(`\nLighthouse ${THRESHOLD}+ gate · ${ORIGIN}\n`);
console.log(
  ['page'.padEnd(18), 'form'.padEnd(8), 'perf', ' a11y', ' bp', ' seo', '   LCP', '    CLS', '     TBT'].join('')
);
console.log('─'.repeat(78));

for (const page of PAGES) {
  for (const formFactor of ['mobile', 'desktop']) {
    const { scores, metrics, failed } = run(ORIGIN + page, formFactor);
    const cells = CATEGORIES.map((c) => String(scores[c]).padStart(4) + ' ');
    const pass = CATEGORIES.every((c) => scores[c] >= THRESHOLD);
    if (!pass) allPass = false;

    console.log(
      [
        page.padEnd(18),
        formFactor.padEnd(8),
        ...cells,
        ms(metrics.lcp).padStart(7),
        (metrics.cls?.toFixed(3) ?? '—').padStart(8),
        `${Math.round(metrics.tbt ?? 0)}ms`.padStart(8),
        pass ? '' : '  ✗',
      ].join('')
    );

    for (const f of failed) problems.set(f, (problems.get(f) ?? 0) + 1);
  }
}

if (problems.size) {
  console.log('\nFailing audits (count = how many runs hit it):');
  [...problems.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([id, n]) => console.log(`  ${String(n).padStart(2)}x  ${id}`));
}

console.log(allPass ? '\n✓ All categories ≥ ' + THRESHOLD + '\n' : '\n✗ Below threshold\n');
process.exit(allPass ? 0 : 1);
