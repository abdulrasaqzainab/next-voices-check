#!/usr/bin/env python3
"""
Convert Swivuriso geographic statistics from JSON to CSV format.
Creates multiple CSV files for different analysis purposes.
"""

import json
import pandas as pd
import argparse
from pathlib import Path

def json_to_csv(json_file, output_dir):
    """Convert JSON geographic statistics to CSV files."""
    
    # Load JSON data
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create output directory
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Main province summary CSV
    print("Creating province summary CSV...")
    province_summary = []
    
    for province_name, province_info in data['provinces'].items():
        if province_info['has_data']:
            dominant_lang = province_info['dominant_language']
            
            province_summary.append({
                'province': province_name,
                'dominant_language': dominant_lang['name'],
                'province_dominant_language': f"{province_name} - {dominant_lang['name']}",
                'total_hours': province_info['total_hours'],
                'total_clips': province_info['total_clips'],
                'dominant_language_code': dominant_lang['code'],
                'dominant_language_hours': dominant_lang['hours'],
                'dominant_language_clips': dominant_lang['clips'],
                'dominant_language_percentage': dominant_lang['percentage']
            })
    
    df_summary = pd.DataFrame(province_summary)
    df_summary = df_summary.sort_values('total_hours', ascending=False)
    summary_file = output_dir / 'swivuriso_province_summary.csv'
    df_summary.to_csv(summary_file, index=False)
    print(f"Province summary saved to: {summary_file}")
    
    # 2. Detailed language breakdown CSV
    print("Creating detailed language breakdown CSV...")
    language_breakdown = []
    
    for province_name, province_info in data['provinces'].items():
        if province_info['has_data']:
            for lang_name, lang_data in province_info['language_breakdown'].items():
                language_breakdown.append({
                    'province': province_name,
                    'language': lang_name,
                    'province_language': f"{province_name} - {lang_name}",
                    'hours': lang_data['hours'],
                    'clips': lang_data['clips'],
                    'percentage': lang_data['percentage'],
                    'province_total_hours': province_info['total_hours'],
                    'province_total_clips': province_info['total_clips']
                })
    
    df_breakdown = pd.DataFrame(language_breakdown)
    df_breakdown = df_breakdown.sort_values(['province', 'hours'], ascending=[True, False])
    breakdown_file = output_dir / 'swivuriso_language_breakdown.csv'
    df_breakdown.to_csv(breakdown_file, index=False)
    print(f"Language breakdown saved to: {breakdown_file}")
    
    # 3. Language totals across all provinces CSV
    print("Creating language totals CSV...")
    language_totals = {}
    
    for province_info in data['provinces'].values():
        if province_info['has_data']:
            for lang_name, lang_data in province_info['language_breakdown'].items():
                if lang_name not in language_totals:
                    language_totals[lang_name] = {'hours': 0, 'clips': 0, 'provinces': []}
                
                language_totals[lang_name]['hours'] += lang_data['hours']
                language_totals[lang_name]['clips'] += lang_data['clips']
                language_totals[lang_name]['provinces'].append(province_info['province_name'])
    
    language_summary = []
    total_hours = data['summary']['total_hours']
    total_clips = data['summary']['total_clips']
    
    for lang_name, lang_data in language_totals.items():
        language_summary.append({
            'language': lang_name,
            'total_hours': lang_data['hours'],
            'total_clips': lang_data['clips'],
            'percentage_of_dataset': (lang_data['hours'] / total_hours) * 100,
            'provinces_count': len(set(lang_data['provinces'])),
            'provinces_list': ', '.join(sorted(set(lang_data['provinces'])))
        })
    
    df_lang_summary = pd.DataFrame(language_summary)
    df_lang_summary = df_lang_summary.sort_values('total_hours', ascending=False)
    lang_summary_file = output_dir / 'swivuriso_language_totals.csv'
    df_lang_summary.to_csv(lang_summary_file, index=False)
    print(f"Language totals saved to: {lang_summary_file}")
    
    # 4. Province-Language matrix CSV (pivot table style)
    print("Creating province-language matrix CSV...")
    
    # Create matrix data
    matrix_data = []
    provinces = sorted([p for p in data['provinces'].keys() if data['provinces'][p]['has_data']])
    languages = sorted(language_totals.keys())
    
    for province in provinces:
        row = {'province': province}
        province_info = data['provinces'][province]
        
        for language in languages:
            if language in province_info['language_breakdown']:
                row[f'{language}_hours'] = province_info['language_breakdown'][language]['hours']
                row[f'{language}_clips'] = province_info['language_breakdown'][language]['clips']
                row[f'{language}_percentage'] = province_info['language_breakdown'][language]['percentage']
            else:
                row[f'{language}_hours'] = 0
                row[f'{language}_clips'] = 0
                row[f'{language}_percentage'] = 0
        
        # Add totals
        row['province_total_hours'] = province_info['total_hours']
        row['province_total_clips'] = province_info['total_clips']
        
        matrix_data.append(row)
    
    df_matrix = pd.DataFrame(matrix_data)
    matrix_file = output_dir / 'swivuriso_province_language_matrix.csv'
    df_matrix.to_csv(matrix_file, index=False)
    print(f"Province-language matrix saved to: {matrix_file}")
    
    # 5. Dataset metadata CSV
    print("Creating dataset metadata CSV...")
    metadata = [
        ['metric', 'value'],
        ['title', data['title']],
        ['description', data['description']],
        ['generated_at', data['generated_at']],
        ['total_hours', data['summary']['total_hours']],
        ['total_clips', data['summary']['total_clips']],
        ['provinces_with_data', data['summary']['provinces_with_data']],
        ['provinces_without_data', data['summary']['provinces_without_data']],
        ['languages_count', len(language_totals)],
        ['languages_list', ', '.join(sorted(language_totals.keys()))]
    ]
    
    df_metadata = pd.DataFrame(metadata[1:], columns=metadata[0])
    metadata_file = output_dir / 'swivuriso_dataset_metadata.csv'
    df_metadata.to_csv(metadata_file, index=False)
    print(f"Dataset metadata saved to: {metadata_file}")
    
    # 6. Combined comprehensive CSV
    print("Creating comprehensive combined CSV...")
    comprehensive_data = []
    
    for province_name, province_info in data['provinces'].items():
        if province_info['has_data']:
            for lang_name, lang_data in province_info['language_breakdown'].items():
                comprehensive_data.append({
                    'province': province_name,
                    'language': lang_name,
                    'province_language': f"{province_name} - {lang_name}",
                    'hours': lang_data['hours'],
                    'clips': lang_data['clips'],
                    'percentage_in_province': lang_data['percentage'],
                    'province_total_hours': province_info['total_hours'],
                    'province_total_clips': province_info['total_clips'],
                    'is_dominant_language': (lang_name == province_info['dominant_language']['name']),
                    'dataset_total_hours': data['summary']['total_hours'],
                    'dataset_total_clips': data['summary']['total_clips'],
                    'percentage_of_total_dataset': (lang_data['hours'] / data['summary']['total_hours']) * 100
                })
    
    df_comprehensive = pd.DataFrame(comprehensive_data)
    df_comprehensive = df_comprehensive.sort_values(['province', 'hours'], ascending=[True, False])
    comprehensive_file = output_dir / 'swivuriso_comprehensive_data.csv'
    df_comprehensive.to_csv(comprehensive_file, index=False)
    print(f"Comprehensive data saved to: {comprehensive_file}")
    
    # Print summary
    print(f"\n[SUCCESS] Successfully created 6 CSV files in {output_dir}:")
    print(f"   1. swivuriso_province_summary.csv - Main province statistics")
    print(f"   2. swivuriso_language_breakdown.csv - Detailed language breakdown")
    print(f"   3. swivuriso_language_totals.csv - Language totals across all provinces")
    print(f"   4. swivuriso_province_language_matrix.csv - Pivot table format")
    print(f"   5. swivuriso_dataset_metadata.csv - Dataset information")
    print(f"   6. swivuriso_comprehensive_data.csv - Complete combined dataset")
    
    return {
        'summary': df_summary,
        'breakdown': df_breakdown,
        'language_totals': df_lang_summary,
        'matrix': df_matrix,
        'metadata': df_metadata,
        'comprehensive': df_comprehensive
    }

def main():
    parser = argparse.ArgumentParser(description='Convert Swivuriso JSON to CSV files')
    parser.add_argument('--input', '-i', 
                       default='../public/csv/swivuriso_geographic_stats.json',
                       help='Input JSON file with geographic statistics')
    parser.add_argument('--output-dir', '-o', 
                       default='../public/csv/',
                       help='Output directory for CSV files')
    
    args = parser.parse_args()
    
    print(f"Converting {args.input} to CSV format...")
    dataframes = json_to_csv(args.input, args.output_dir)
    
    print(f"\n[SUMMARY] Data Summary:")
    print(f"   Provinces: {len(dataframes['summary'])}")
    print(f"   Total Hours: {dataframes['summary']['total_hours'].sum():.1f}")
    print(f"   Total Clips: {dataframes['summary']['total_clips'].sum():,}")
    print(f"   Languages: {dataframes['language_totals'].shape[0]}")

if __name__ == "__main__":
    main()