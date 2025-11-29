#!/usr/bin/env python3
"""Generate table statistics matching the research paper format.

⚠️  WARNING: This script processes ALL data including hidden test sets.
    Generated files MUST NOT be committed to public repositories.

Output format matches Table 2 from the paper:
Language | # Clips | # Speakers | Hours | Avg Dur (s) | # Male | # Female | 18-29 | 30-39 | 40-49 | 50-59 | 60+
"""
import argparse
import csv
import json
import os
from collections import defaultdict
from typing import Dict, Set


def safe_float(v):
    try:
        return float(v)
    except Exception:
        return 0.0


def read_meta(path: str) -> Dict[str, dict]:
    """Read metadata CSV with BOM handling."""
    meta = {}
    with open(path, newline='', encoding='utf-8-sig') as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            uid = (row.get('recorder_uuid') or '').strip()
            if not uid:
                continue
            meta[uid] = {
                'age_range': row.get('age_range') or 'unknown',
                'gender': (row.get('gender') or 'unknown').lower(),
                'mother_language': (row.get('mother_language') or '').lower(),
            }
    return meta


def generate_table_stats(meta_path: str, transcripts_path: str, out_json: str):
    """Generate statistics in table format."""
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

    # Track per-language statistics
    lang_stats = defaultdict(lambda: {
        'clips': 0,
        'speakers': set(),
        'total_duration': 0.0,
        'male_clips': 0,
        'female_clips': 0,
        'age_18_29': 0,
        'age_30_39': 0,
        'age_40_49': 0,
        'age_50_59': 0,
        'age_60_plus': 0,
    })

    # Read transcripts and aggregate clip-based statistics
    with open(transcripts_path, newline='', encoding='utf-8-sig') as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            # Get language from mother_language in meta
            uid = (row.get('recorder_uuid') or '').strip()
            m = meta.get(uid)
            
            if not m or not m.get('mother_language'):
                continue
                
            lang = m.get('mother_language').lower()
            if lang not in LANG_NAMES:
                continue
            
            # Increment clip count
            lang_stats[lang]['clips'] += 1
            
            # Track speaker
            if uid:
                lang_stats[lang]['speakers'].add(uid)
            
            # Track duration
            dur = safe_float(row.get('duration', 0))
            lang_stats[lang]['total_duration'] += dur
            
            # Track CLIP-BASED gender (each clip contributes to gender count)
            gender = m.get('gender', 'unknown').lower()
            if gender == 'male':
                lang_stats[lang]['male_clips'] += 1
            elif gender == 'female':
                lang_stats[lang]['female_clips'] += 1
            
            # Track CLIP-BASED age groups (each clip contributes to age count)
            age = m.get('age_range', 'unknown')
            if age == '18-29':
                lang_stats[lang]['age_18_29'] += 1
            elif age == '30-39':
                lang_stats[lang]['age_30_39'] += 1
            elif age == '40-49':
                lang_stats[lang]['age_40_49'] += 1
            elif age == '50-59':
                lang_stats[lang]['age_50_59'] += 1
            elif age == '60+':
                lang_stats[lang]['age_60_plus'] += 1

    # Format output for table
    table_data = []
    for lang_code in ['xho', 'zul', 'sot', 'tsn', 'tso', 'ven', 'nbl']:
        if lang_code not in lang_stats:
            continue
            
        stats = lang_stats[lang_code]
        clips = stats['clips']
        speakers = len(stats['speakers'])
        total_seconds = stats['total_duration']
        hours = round(total_seconds / 3600.0, 2)
        avg_dur = round((total_seconds / clips) if clips > 0 else 0.0, 2)
        
        table_data.append({
            'language': LANG_NAMES[lang_code],
            'language_code': lang_code.upper(),
            'clips': clips,
            'speakers': speakers,
            'hours': hours,
            'avg_duration_seconds': avg_dur,
            'male_clips': stats['male_clips'],
            'female_clips': stats['female_clips'],
            'age_18_29': stats['age_18_29'],
            'age_30_39': stats['age_30_39'],
            'age_40_49': stats['age_40_49'],
            'age_50_59': stats['age_50_59'],
            'age_60_plus': stats['age_60_plus'],
        })

    # Calculate totals
    totals = {
        'language': 'TOTAL',
        'language_code': 'ALL',
        'clips': sum(row['clips'] for row in table_data),
        'speakers': sum(row['speakers'] for row in table_data),
        'hours': round(sum(row['hours'] for row in table_data), 2),
        'avg_duration_seconds': round(
            sum(row['clips'] * row['avg_duration_seconds'] for row in table_data) / 
            sum(row['clips'] for row in table_data) if sum(row['clips'] for row in table_data) > 0 else 0, 2
        ),
        'male_clips': sum(row['male_clips'] for row in table_data),
        'female_clips': sum(row['female_clips'] for row in table_data),
        'age_18_29': sum(row['age_18_29'] for row in table_data),
        'age_30_39': sum(row['age_30_39'] for row in table_data),
        'age_40_49': sum(row['age_40_49'] for row in table_data),
        'age_50_59': sum(row['age_50_59'] for row in table_data),
        'age_60_plus': sum(row['age_60_plus'] for row in table_data),
    }

    output = {
        'table_data': table_data,
        'totals': totals,
        'note': 'Clip-based demographic breakdowns (each clip counted by speaker demographics)'
    }

    # Write JSON
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, 'w', encoding='utf-8') as fh:
        json.dump(output, fh, indent=2, ensure_ascii=False)

    # Print formatted table
    print('\n' + '=' * 140)
    print('Table 2: Overview of Swivuriso statistics per language')
    print('=' * 140)
    print(f"{'Language':<12} {'# Clips':<10} {'# Speakers':<12} {'Hours':<10} {'Avg Dur (s)':<12} "
          f"{'# Male':<10} {'# Female':<10} {'18-29':<10} {'30-39':<10} {'40-49':<10} {'50-59':<10} {'60+':<10}")
    print('-' * 140)
    
    for row in table_data:
        print(f"{row['language_code']:<12} {row['clips']:<10,} {row['speakers']:<12,} {row['hours']:<10.2f} {row['avg_duration_seconds']:<12.2f} "
              f"{row['male_clips']:<10,} {row['female_clips']:<10,} {row['age_18_29']:<10,} {row['age_30_39']:<10,} "
              f"{row['age_40_49']:<10,} {row['age_50_59']:<10,} {row['age_60_plus']:<10,}")
    
    print('-' * 140)
    print(f"{totals['language']:<12} {totals['clips']:<10,} {totals['speakers']:<12,} {totals['hours']:<10.2f} {totals['avg_duration_seconds']:<12.2f} "
          f"{totals['male_clips']:<10,} {totals['female_clips']:<10,} {totals['age_18_29']:<10,} {totals['age_30_39']:<10,} "
          f"{totals['age_40_49']:<10,} {totals['age_50_59']:<10,} {totals['age_60_plus']:<10,}")
    print('=' * 140)
    
    print(f'\n✅ Wrote {out_json}')
    print(f'⚠️  WARNING: This file contains ALL data including test sets.')
    print(f'   DO NOT commit to public repos or share publicly!\n')


def main():
    repo_root = os.path.join(os.path.dirname(__file__), '..', '..')
    default_meta = os.path.join(repo_root, 'data', 'meta_all_combined.csv')
    default_transcripts = os.path.join(repo_root, 'data', 'transcripts_all_combined.csv')
    default_out = os.path.join(repo_root, 'website', 'public', 'csv', 'table_stats.json')

    parser = argparse.ArgumentParser(description='Generate table statistics for research paper')
    parser.add_argument('--meta', default=default_meta, help='Path to combined meta CSV')
    parser.add_argument('--transcripts', default=default_transcripts, help='Path to combined transcripts CSV')
    parser.add_argument('--out', default=default_out, help='Output JSON file path')
    args = parser.parse_args()

    generate_table_stats(args.meta, args.transcripts, args.out)


if __name__ == '__main__':
    main()
