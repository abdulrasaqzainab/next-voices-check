#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parse } = require('csv-parse');

// Simple CLI with defaults (supports --meta=, --transcripts=, --out=, --outcsv=)
const repoRoot = path.join(__dirname, '..');
const rawArgs = process.argv.slice(2);
const argMap = {};
rawArgs.forEach((a) => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  if (m) argMap[m[1]] = m[2];
});
const metaPath = path.resolve(argMap.meta || path.join(repoRoot, 'public', 'csv', 'meta_all.csv'));
const transcriptsPath = path.resolve(argMap.transcripts || path.join(repoRoot, 'public', 'csv', 'transcripts.csv'));
const outJson = path.resolve(argMap.out || path.join(repoRoot, 'public', 'csv', 'stats_generated.json'));
const outCsv = path.resolve(argMap.outcsv || path.join(repoRoot, 'public', 'csv', 'stats_summary.csv'));

function safeNumber(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function readMeta(file) {
  return new Promise((resolve, reject) => {
    const meta = new Map();
    fs.createReadStream(file)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        const id = (row.recorder_uuid || '').trim();
        if (!id) return;
        meta.set(id, {
          age_range: row.age_range || 'unknown',
          country: row.country || '',
          province: row.province || 'unknown',
          city: row.city || '',
          gender: (row.gender || 'unknown').toLowerCase(),
          mother_language: (row.mother_language || '').toLowerCase(),
        });
      })
      .on('end', () => resolve(meta))
      .on('error', reject);
  });
}

async function generate(metaFile, transcriptsFile) {
  const meta = await readMeta(metaFile);

  const stats = {
    overview: { totalClips: 0, totalHours: 0, totalSpeakers: 0, totalLanguages: 0 },
    languages: {},
    demographics: { ageGroups: {}, genders: { male:0, female:0, unknown:0 }, provinces: {} },
    domains: {},
  };

  const globalSpeakers = new Set();

  await new Promise((resolve, reject) => {
    fs.createReadStream(transcriptsFile)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        stats.overview.totalClips += 1;
        const dur = safeNumber(row.duration);
        stats.overview.totalHours += dur / 3600;

        const uuid = (row.recorder_uuid || '').trim();
        if (uuid) globalSpeakers.add(uuid);

        // language: prefer meta -> mother_language, fallback to path (audio/<LANG>/...)
        let lang = 'unknown';
        const m = meta.get(uuid);
        if (m && m.mother_language) lang = m.mother_language;
        else if (row.full_path) {
          const fp = row.full_path;
          const m2 = fp.match(/audio\/(?:([A-Za-z0-9_\-]+)\/)?/i);
          if (m2 && m2[1]) lang = m2[1].toLowerCase();
        }

        if (!stats.languages[lang]) stats.languages[lang] = { name: lang, clips: 0, seconds: 0, speakers: new Set(), avgDuration: 0 };
        stats.languages[lang].clips += 1;
        stats.languages[lang].seconds += dur;
        if (uuid) stats.languages[lang].speakers.add(uuid);

        // domain
        const domain = (row.domain || 'unknown').trim();
        stats.domains[domain] = (stats.domains[domain] || 0) + 1;

        // demographics from meta
        if (m) {
          const prov = m.province || 'unknown';
          stats.demographics.provinces[prov] = (stats.demographics.provinces[prov] || 0) + 1;

          const gender = (m.gender || 'unknown').toLowerCase();
          stats.demographics.genders[gender] = (stats.demographics.genders[gender] || 0) + 1;

          const age = m.age_range || 'unknown';
          stats.demographics.ageGroups[age] = (stats.demographics.ageGroups[age] || 0) + 1;
        }
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  // finalize language stats
  const languageKeys = Object.keys(stats.languages);
  languageKeys.forEach((k) => {
    const l = stats.languages[k];
    l.hours = +(l.seconds / 3600).toFixed(2);
    l.avgDuration = l.clips ? +(l.seconds / l.clips).toFixed(2) : 0;
    l.speakers = l.speakers.size;
    delete l.seconds;
  });

  stats.overview.totalSpeakers = globalSpeakers.size;
  stats.overview.totalHours = +stats.overview.totalHours.toFixed(2);
  stats.overview.totalLanguages = languageKeys.filter(k => k && k !== 'unknown').length;

  // write JSON
  fs.writeFileSync(outJson, JSON.stringify(stats, null, 2), 'utf8');

  // write CSV summary
  const lines = [];
  lines.push('metric,value');
  lines.push(`total_clips,${stats.overview.totalClips}`);
  lines.push(`total_hours,${stats.overview.totalHours}`);
  lines.push(`total_speakers,${stats.overview.totalSpeakers}`);
  lines.push(`total_languages,${stats.overview.totalLanguages}`);
  lines.push('\nlanguages,clips,hours,speakers,avgDuration');
  languageKeys.forEach(k => {
    const l = stats.languages[k];
    lines.push(`${k},${l.clips},${l.hours},${l.speakers},${l.avgDuration}`);
  });
  fs.writeFileSync(outCsv, lines.join('\n'), 'utf8');

  console.log('Wrote', outJson, 'and', outCsv);
}

generate(metaPath, transcriptsPath).catch((err) => {
  console.error('Error generating stats:', err);
  process.exit(1);
});
