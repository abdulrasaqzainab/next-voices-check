#!/usr/bin/env python3
"""
Generate geographic distribution statistics showing:
- Total hours of recorded speech by province
- Dominant language per province
- Province name and total duration
"""

import pandas as pd
import json
import argparse
from collections import defaultdict

def load_data(meta_file, transcripts_file):
    """Load and merge metadata and transcripts data"""
    
    # Load metadata
    print(f"Loading metadata from {meta_file}")
    meta_df = pd.read_csv(meta_file, encoding='utf-8-sig')
    
    # Load transcripts to get duration information
    print(f"Loading transcripts from {transcripts_file}")
    transcripts_df = pd.read_csv(transcripts_file, encoding='utf-8-sig')
    
    # Merge on recorder_uuid to get province and language info with durations
    merged_df = transcripts_df.merge(
        meta_df[['recorder_uuid', 'province', 'mother_language']], 
        on='recorder_uuid', 
        how='left'
    )
    
    return merged_df

def calculate_province_stats(df):
    """Calculate statistics by province and language"""
    
    # Language code mapping
    lang_map = {
        'zul': 'isiZulu',
        'xho': 'isiXhosa', 
        'sot': 'Sesotho',
        'tsn': 'seTswana',
        'tso': 'Xitsonga',
        'ven': 'Tshivenda',
        'nbl': 'isiNdebele'
    }
    
    # Group by province and language
    province_lang_stats = defaultdict(lambda: defaultdict(float))
    province_clips = defaultdict(lambda: defaultdict(int))
    
    for _, row in df.iterrows():
        if pd.notna(row['province']) and pd.notna(row['mother_language']) and pd.notna(row['duration']):
            province = row['province']
            lang = row['mother_language']
            duration_hours = row['duration'] / 3600  # Convert seconds to hours
            
            province_lang_stats[province][lang] += duration_hours
            province_clips[province][lang] += 1
    
    # Calculate totals and find dominant language per province
    province_data = {}
    
    for province in province_lang_stats:
        lang_hours = province_lang_stats[province]
        total_hours = sum(lang_hours.values())
        
        # Find dominant language (most hours)
        dominant_lang_code = max(lang_hours.keys(), key=lambda x: lang_hours[x])
        dominant_lang_name = lang_map.get(dominant_lang_code, dominant_lang_code)
        dominant_hours = lang_hours[dominant_lang_code]
        dominant_clips = province_clips[province][dominant_lang_code]
        
        # Create language breakdown
        language_breakdown = {}
        for lang_code, hours in lang_hours.items():
            lang_name = lang_map.get(lang_code, lang_code)
            clips = province_clips[province][lang_code]
            language_breakdown[lang_name] = {
                "hours": round(hours, 2),
                "clips": clips,
                "percentage": round((hours / total_hours) * 100, 1) if total_hours > 0 else 0
            }
        
        province_data[province] = {
            "province_name": province,
            "total_hours": round(total_hours, 2),
            "total_clips": sum(province_clips[province].values()),
            "dominant_language": {
                "name": dominant_lang_name,
                "code": dominant_lang_code,
                "hours": round(dominant_hours, 2),
                "clips": dominant_clips,
                "percentage": round((dominant_hours / total_hours) * 100, 1) if total_hours > 0 else 0
            },
            "language_breakdown": language_breakdown
        }
    
    return province_data

def generate_swivuriso_stats(meta_file, transcripts_file, output_file):
    """Generate the complete geographic distribution statistics"""
    
    # Load data
    df = load_data(meta_file, transcripts_file)
    
    # Calculate province statistics
    province_stats = calculate_province_stats(df)
    
    # Get overall totals
    total_hours = sum(data['total_hours'] for data in province_stats.values())
    total_clips = sum(data['total_clips'] for data in province_stats.values())
    
    # South African provinces (including those that might not have data)
    all_provinces = [
        "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", 
        "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
    ]
    
    # Ensure all provinces are represented (with zero data if no recordings)
    complete_province_data = {}
    for province in all_provinces:
        if province in province_stats:
            complete_province_data[province] = province_stats[province]
        else:
            complete_province_data[province] = {
                "province_name": province,
                "total_hours": 0,
                "total_clips": 0,
                "dominant_language": None,
                "language_breakdown": {},
                "has_data": False
            }
        
        # Add has_data flag
        complete_province_data[province]["has_data"] = province_stats.get(province, {}).get('total_hours', 0) > 0
    
    # Create final statistics object
    swivuriso_stats = {
        "title": "Geographic Distribution of Swivuriso Across South African Provinces",
        "description": "Each province shows total hours of recorded speech and dominant language. Provinces without data are indicated.",
        "generated_at": pd.Timestamp.now().isoformat(),
        "summary": {
            "total_hours": round(total_hours, 2),
            "total_clips": total_clips,
            "provinces_with_data": len([p for p in complete_province_data.values() if p["has_data"]]),
            "provinces_without_data": len([p for p in complete_province_data.values() if not p["has_data"]])
        },
        "provinces": complete_province_data,
        "metadata": {
            "shading_metric": "total_hours",
            "label_format": "{dominant_language} | {province_name} | {total_hours}h",
            "grey_provinces": [p for p, data in complete_province_data.items() if not data["has_data"]]
        }
    }
    
    # Save to file
    print(f"Saving geographic distribution statistics to {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(swivuriso_stats, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n=== Geographic Distribution Summary ===")
    print(f"Total hours: {total_hours:.2f}")
    print(f"Total clips: {total_clips}")
    print(f"Provinces with data: {len([p for p in complete_province_data.values() if p['has_data']])}/9")
    
    print(f"\nTop provinces by total hours:")
    sorted_provinces = sorted(
        [(name, data) for name, data in complete_province_data.items() if data["has_data"]], 
        key=lambda x: x[1]["total_hours"], 
        reverse=True
    )
    
    for province_name, data in sorted_provinces[:5]:
        dominant = data["dominant_language"]
        print(f"  {province_name}: {data['total_hours']:.1f}h ({dominant['name']} - {dominant['percentage']:.1f}%)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate geographic distribution statistics')
    parser.add_argument('--meta', required=True, help='Path to meta CSV file')
    parser.add_argument('--transcripts', required=True, help='Path to transcripts CSV file')
    parser.add_argument('--output', default='swivuriso_geographic_stats.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    generate_swivuriso_stats(args.meta, args.transcripts, args.output)