#!/usr/bin/env python3
"""Generate stats from meta_all.csv and transcripts.csv.

⚠️  WARNING: This script processes ALL data including hidden test sets.
    Generated files MUST NOT be committed to public repositories or shared publicly.
    Keep stats_generated.json and stats_summary.csv in .gitignore.

Defaults:
  meta: website/public/csv/meta_all.csv
  transcripts: website/public/csv/transcripts.csv
  out json: website/public/csv/stats_generated.json
  out csv: website/public/csv/stats_summary.csv

Usage:
  python3 website/scripts/generate_stats_from_csv.py
  python3 website/scripts/generate_stats_from_csv.py --meta path/to/meta.csv --transcripts path/to/transcripts.csv
"""
import argparse
import csv
import json
import os
import re
from collections import defaultdict
from typing import Dict, Set


def safe_float(v):
    try:
        return float(v)
    except Exception:
        return 0.0


def read_meta(path: str) -> Dict[str, dict]:
    meta = {}
    with open(path, newline='', encoding='utf-8-sig') as fh:  # Handle BOM
        reader = csv.DictReader(fh)  # Use default comma delimiter
        for row in reader:
            uid = (row.get('recorder_uuid') or '').strip()
            if not uid:
                continue
            meta[uid] = {
                'age_range': row.get('age_range') or 'unknown',
                'country': row.get('country') or '',
                'province': row.get('province') or 'unknown',
                'city': row.get('city') or '',
                'gender': (row.get('gender') or 'unknown').lower(),
                'mother_language': (row.get('mother_language') or '').lower(),
            }
    return meta


def detect_lang_from_path(full_path: str) -> str:
    """Extract language code from path like audio/SOT/... or from filename prefix SOT-..."""
    if not full_path:
        return 'unknown'
    
    # Try to find ISO code in path (e.g., audio/SOT/..., audio/ZUL/...)
    parts = full_path.split('/')
    try:
        idx = parts.index('audio')
        if idx + 1 < len(parts):
            candidate = parts[idx + 1].upper()
            # Known ISO codes
            if candidate in ['ZUL', 'XHO', 'SOT', 'TSN', 'TSO', 'VEN', 'NBL']:
                return candidate.lower()
    except ValueError:
        pass
    
    # Try filename prefix pattern like SOT-..., ZUL-..., etc.
    filename = os.path.basename(full_path)
    match = re.match(r'^([A-Z]{3})-', filename)
    if match:
        code = match.group(1).upper()
        if code in ['ZUL', 'XHO', 'SOT', 'TSN', 'TSO', 'VEN', 'NBL']:
            return code.lower()
    
    return 'unknown'


def generate(meta_path: str, transcripts_path: str, out_json: str, out_csv: str):
    meta = read_meta(meta_path)
    
    # Language ISO code mapping
    LANG_NAMES = {
        'zul': 'isiZulu',
        'xho': 'isiXhosa',
        'sot': 'Sesotho',
        'tsn': 'seTswana',
        'tso': 'Xitsonga',
        'ven': 'Tshivenda',
        'nbl': 'isiNdebele',
    }

    stats = {
        'overview': {'totalClips': 0, 'totalHours': 0.0, 'totalSpeakers': 0, 'totalLanguages': 0},
        'languages': {},
        'demographics': {'ageGroups': {}, 'genders': {'male': 0, 'female': 0, 'unknown': 0}, 'provinces': {}},
        'domains': {},
    }

    language_acc = {}
    global_speakers: Set[str] = set()
    
    # Track per-language demographics and domains
    lang_demographics = defaultdict(lambda: {
        'genders': defaultdict(int),
        'ageGroups': defaultdict(int),
        'speakers_set': set(),
        'domains': defaultdict(int)
    })

    with open(transcripts_path, newline='', encoding='utf-8-sig') as fh:  # Handle BOM
        reader = csv.DictReader(fh)  # Use default comma delimiter
        for row in reader:
            stats['overview']['totalClips'] += 1
            dur = safe_float(row.get('duration', 0))
            stats['overview']['totalHours'] += dur / 3600.0

            uid = (row.get('recorder_uuid') or '').strip()
            if uid:
                global_speakers.add(uid)

            # language determination
            lang = 'unknown'
            m = meta.get(uid)
            if m and m.get('mother_language'):
                lang = m.get('mother_language').lower()
            else:
                lang = detect_lang_from_path(row.get('full_path') or '')

            if lang not in language_acc:
                language_acc[lang] = {'name': LANG_NAMES.get(lang, lang), 'clips': 0, 'seconds': 0.0, 'speakers': set()}
            language_acc[lang]['clips'] += 1
            language_acc[lang]['seconds'] += dur
            if uid:
                language_acc[lang]['speakers'].add(uid)
                lang_demographics[lang]['speakers_set'].add(uid)

            # domain
            domain = (row.get('domain') or 'unknown').strip()
            stats['domains'][domain] = stats['domains'].get(domain, 0) + 1
            lang_demographics[lang]['domains'][domain] += 1

            # demographics from meta
            if m:
                prov = m.get('province') or 'unknown'
                stats['demographics']['provinces'][prov] = stats['demographics']['provinces'].get(prov, 0) + 1

                gender = (m.get('gender') or 'unknown').lower()
                stats['demographics']['genders'][gender] = stats['demographics']['genders'].get(gender, 0) + 1
                lang_demographics[lang]['genders'][gender] += 1

                age = m.get('age_range') or 'unknown'
                stats['demographics']['ageGroups'][age] = stats['demographics']['ageGroups'].get(age, 0) + 1
                lang_demographics[lang]['ageGroups'][age] += 1

    # finalize language stats with detailed breakdowns
    for k, v in language_acc.items():
        hours = round(v['seconds'] / 3600.0, 2)
        avg_duration = round((v['seconds'] / v['clips']) if v['clips'] else 0.0, 2)
        
        # Convert defaultdicts to regular dicts for JSON serialization
        genders_dict = dict(lang_demographics[k]['genders'])
        age_groups_dict = dict(lang_demographics[k]['ageGroups'])
        domains_dict = dict(lang_demographics[k]['domains'])
        
        stats['languages'][k] = {
            'name': v['name'],
            'clips': v['clips'],
            'hours': hours,
            'speakers': len(v['speakers']),
            'avgDuration': avg_duration,
            'genders': genders_dict,
            'ageGroups': age_groups_dict,
            'domains': domains_dict,
        }

    stats['overview']['totalSpeakers'] = len(global_speakers)
    stats['overview']['totalHours'] = round(stats['overview']['totalHours'], 2)
    stats['overview']['totalLanguages'] = len([x for x in stats['languages'].keys() if x and x != 'unknown'])

    # ensure output dir exists
    os.makedirs(os.path.dirname(out_json), exist_ok=True)

    with open(out_json, 'w', encoding='utf-8') as fh:
        json.dump(stats, fh, indent=2, ensure_ascii=False)

    # write detailed CSV summary
    lines = []
    lines.append(['metric', 'value'])
    lines.append(['total_clips', str(stats['overview']['totalClips'])])
    lines.append(['total_hours', str(stats['overview']['totalHours'])])
    lines.append(['total_speakers', str(stats['overview']['totalSpeakers'])])
    lines.append(['total_languages', str(stats['overview']['totalLanguages'])])

    # language summary table
    lang_rows = [['', ''], ['language', 'clips', 'hours', 'speakers', 'avgDuration', 'male', 'female']]
    for k, v in sorted(stats['languages'].items()):
        if k == 'unknown':
            continue
        male_count = v['genders'].get('male', 0)
        female_count = v['genders'].get('female', 0)
        lang_rows.append([
            v['name'], str(v['clips']), str(v['hours']), 
            str(v['speakers']), str(v['avgDuration']),
            str(male_count), str(female_count)
        ])

    # write CSV
    with open(out_csv, 'w', newline='', encoding='utf-8') as fh:
        writer = csv.writer(fh)
        for row in lines:
            writer.writerow(row)
        for row in lang_rows:
            writer.writerow(row)

    print(f'[SUCCESS] Wrote {out_json} and {out_csv}')
    print(f'[WARNING] These files contain ALL data including test sets.')
    print(f'   DO NOT commit to public repos or share publicly!')


def main():
    repo_root = os.path.join(os.path.dirname(__file__), '..')
    default_meta = os.path.join(repo_root, 'public', 'csv', 'meta_all.csv')
    default_transcripts = os.path.join(repo_root, 'public', 'csv', 'transcripts.csv')
    default_out_json = os.path.join(repo_root, 'public', 'csv', 'stats_generated.json')
    default_out_csv = os.path.join(repo_root, 'public', 'csv', 'stats_summary.csv')

    parser = argparse.ArgumentParser()
    parser.add_argument('--meta', default=default_meta)
    parser.add_argument('--transcripts', default=default_transcripts)
    parser.add_argument('--out', default=default_out_json)
    parser.add_argument('--outcsv', default=default_out_csv)
    args = parser.parse_args()

    generate(args.meta, args.transcripts, args.out, args.outcsv)


if __name__ == '__main__':
    main()
