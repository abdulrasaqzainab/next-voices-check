#!/usr/bin/env python3
"""Combine individual language CSV files into master meta_all.csv and transcripts.csv with language info.

⚠️  WARNING: This script processes ALL data including hidden test sets.
"""
import csv
import os
from pathlib import Path

# Language mapping
LANG_CODES = {
    'ZUL': 'isiZulu',
    'XHO': 'isiXhosa',
    'SOT': 'Sesotho',
    'TSN': 'seTswana',
    'TSO': 'Xitsonga',
    'VEN': 'Tshivenda',
    'NBL': 'isiNdebele',
}


def combine_meta_files(data_dir: str, output_file: str):
    """Combine all *_meta.csv files into one with mother_language column."""
    all_rows = []
    all_fieldnames = set()
    
    # First pass: collect all unique fieldnames and rows
    for lang_code in LANG_CODES.keys():
        meta_file = os.path.join(data_dir, f'{lang_code}_meta.csv')
        if not os.path.exists(meta_file):
            print(f'⚠️  Skipping {meta_file} (not found)')
            continue
        
        print(f'Reading {meta_file}...')
        with open(meta_file, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
            reader = csv.DictReader(f)  # Use default comma delimiter
            all_fieldnames.update(reader.fieldnames or [])
            
            for row in reader:
                row['mother_language'] = lang_code.lower()
                all_rows.append(row)
    
    # Add mother_language to fieldnames
    all_fieldnames.add('mother_language')
    fieldnames = sorted(list(all_fieldnames))  # Sort for consistency
    
    # Write combined file
    print(f'\n✅ Writing {len(all_rows)} rows to {output_file}')
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')  # Use default comma delimiter
        writer.writeheader()
        writer.writerows(all_rows)


def combine_transcript_files(data_dir: str, output_file: str):
    """Combine all *_transcripts.csv files into one."""
    all_rows = []
    all_fieldnames = set()
    
    # First pass: collect all unique fieldnames and rows
    for lang_code in LANG_CODES.keys():
        trans_file = os.path.join(data_dir, f'{lang_code}_transcripts.csv')
        if not os.path.exists(trans_file):
            print(f'⚠️  Skipping {trans_file} (not found)')
            continue
        
        print(f'Reading {trans_file}...')
        with open(trans_file, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
            reader = csv.DictReader(f)  # Use default comma delimiter
            all_fieldnames.update(reader.fieldnames or [])
            
            for row in reader:
                all_rows.append(row)
    
    fieldnames = sorted(list(all_fieldnames))  # Sort for consistency
    
    # Write combined file
    print(f'\n✅ Writing {len(all_rows)} rows to {output_file}')
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')  # Use default comma delimiter
        writer.writeheader()
        writer.writerows(all_rows)


def main():
    # Default paths
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    data_dir = repo_root / 'data'
    
    meta_output = data_dir / 'meta_all_combined.csv'
    trans_output = data_dir / 'transcripts_all_combined.csv'
    
    print('=' * 60)
    print('Combining language-specific CSV files')
    print('=' * 60)
    
    print('\n📁 META FILES:')
    combine_meta_files(str(data_dir), str(meta_output))
    
    print('\n📁 TRANSCRIPT FILES:')
    combine_transcript_files(str(data_dir), str(trans_output))
    
    print('\n' + '=' * 60)
    print('✅ Done!')
    print('=' * 60)
    print(f'\n📄 Output files:')
    print(f'   - {meta_output}')
    print(f'   - {trans_output}')
    print(f'\n⚠️  WARNING: These files contain ALL data including test sets.')
    print(f'   Add to .gitignore: data/meta_all_combined.csv and data/transcripts_all_combined.csv')


if __name__ == '__main__':
    main()
