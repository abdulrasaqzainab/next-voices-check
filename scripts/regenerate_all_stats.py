#!/usr/bin/env python3
"""
Comprehensive statistics regeneration script for South African language data.
This script regenerates all statistics including geographic distributions and CSV exports.
Supports all 11 official South African languages including isiNdebele.
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(command, description="Running command"):
    """Execute a shell command and return success status"""
    print(f"\n{description}...")
    print(f"Command: {' '.join(command)}")
    
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print(f"[SUCCESS] {description} completed successfully")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] {description} failed with error code {e.returncode}")
        print(f"Error: {e.stderr}")
        return False

def check_file_exists(filepath, description="File"):
    """Check if a file exists and report status"""
    if os.path.exists(filepath):
        print(f"[OK] {description} exists: {filepath}")
        return True
    else:
        print(f"[WARNING] {description} not found: {filepath}")
        return False

def regenerate_all_statistics():
    """Regenerate all statistics including Ndebele support"""
    
    print("South African Language Statistics Regeneration")
    print("=" * 60)
    
    # Get script directory and set up paths
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent if script_dir.name == "scripts" else script_dir
    website_dir = repo_root / "website"
    csv_dir = website_dir / "public" / "csv"
    website_scripts_dir = website_dir / "scripts"
    
    # Required files
    meta_file = csv_dir / "meta_all.csv"
    transcripts_file = csv_dir / "transcripts.csv"
    
    print(f"\nBase directory: {repo_root}")
    print(f"Website directory: {website_dir}")
    print(f"CSV directory: {csv_dir}")
    print(f"Website scripts directory: {website_scripts_dir}")
    
    # Check required input files
    print(f"\n[STEP] Checking required input files...")
    if not check_file_exists(meta_file, "Metadata file"):
        return False
    if not check_file_exists(transcripts_file, "Transcripts file"):
        return False
    
    # Check if website scripts directory exists and has the processing scripts
    if not website_scripts_dir.exists():
        print(f"[WARNING] Website scripts directory not found: {website_scripts_dir}")
        return False
    
    # Change to website scripts directory
    original_dir = os.getcwd()
    os.chdir(website_scripts_dir)
    
    try:
        # Step 1: Generate general statistics from CSV
        print(f"\n[STEP 1] Generating general statistics...")
        success = run_command([
            "python3", "generate_stats_from_csv.py",
            "--meta", str(meta_file),
            "--transcripts", str(transcripts_file)
        ], "Generate general statistics")
        
        if not success:
            return False
        
        # Step 2: Generate geographic distribution statistics  
        print(f"\n[STEP 2] Generating geographic distribution statistics...")
        geographic_stats_file = csv_dir / "swivuriso_geographic_stats.json"
        success = run_command([
            "python3", "generate_province_language_stats.py",
            "--meta", str(meta_file),
            "--transcripts", str(transcripts_file),
            "--output", str(geographic_stats_file)
        ], "Generate geographic statistics")
        
        if not success:
            return False
        
        # Step 3: Convert geographic statistics to CSV format
        print(f"\n[STEP 3] Converting statistics to CSV format...")
        success = run_command([
            "python3", "json_to_csv_converter.py",
            "--input", str(geographic_stats_file),
            "--output-dir", str(csv_dir)
        ], "Convert to CSV format")
        
        if not success:
            return False
        
        # Step 4: Update main stats.json with current data
        print(f"\n[STEP 4] Updating main statistics file...")
        update_main_stats(website_dir)
        
        # Step 5: Summary report
        print(f"\n[STEP 5] Generating summary report...")
        generate_summary_report(csv_dir)
        
        print(f"\n[SUCCESS] All statistics regenerated successfully!")
        print(f"\nUpdated files:")
        print(f"  - {csv_dir}/stats_generated.json (detailed statistics)")
        print(f"  - {csv_dir}/stats_summary.csv (summary table)")
        print(f"  - {csv_dir}/swivuriso_geographic_stats.json (geographic data)")
        print(f"  - {csv_dir}/swivuriso_*.csv (6 different CSV formats)")
        print(f"  - {website_dir}/app/stats.json (main application statistics)")
        
        return True
        
    finally:
        os.chdir(original_dir)

def update_main_stats(website_dir):
    """Update the main stats.json file with current data"""
    csv_dir = website_dir / "public" / "csv"
    stats_generated_file = csv_dir / "stats_generated.json"
    main_stats_file = website_dir / "app" / "stats.json"
    
    try:
        # Load generated statistics
        with open(stats_generated_file, 'r', encoding='utf-8') as f:
            generated_stats = json.load(f)
        
        # Load existing main stats
        with open(main_stats_file, 'r', encoding='utf-8') as f:
            main_stats = json.load(f)
        
        # Update data collection statistics with actual data
        if 'languages' in generated_stats and generated_stats['languages']:
            # Calculate totals from actual data
            total_hours = generated_stats['overview']['totalHours']
            total_speakers = generated_stats['overview']['totalSpeakers']
            
            # Update audio hours by language - preserve existing Ndebele data
            main_stats['dataCollection']['audioHours']['total'] = total_hours + main_stats['dataCollection']['audioHours']['byLanguage'].get('isiNdebele', 0)
            
            # Update actual data while preserving Ndebele
            for lang_code, lang_data in generated_stats['languages'].items():
                lang_name = lang_data['name']
                hours = lang_data['hours']
                
                main_stats['dataCollection']['audioHours']['byLanguage'][lang_name] = hours
                main_stats['dataCollection']['transcribedHours']['byLanguage'][lang_name] = hours
            
            # Update transcribed hours total
            ndebele_transcribed = main_stats['dataCollection']['transcribedHours']['byLanguage'].get('isiNdebele', 0)
            main_stats['dataCollection']['transcribedHours']['total'] = total_hours + ndebele_transcribed
            
            # Update speaker count
            main_stats['dataCollection']['speakers']['total'] = total_speakers
            
            # Update demographics with actual province data
            if 'demographics' in generated_stats and 'provinces' in generated_stats['demographics']:
                province_mapping = {
                    'Eastern Cape': 'EasternCape',
                    'Free State': 'FreeState', 
                    'Gauteng': 'Gauteng',
                    'KwaZulu-Natal': 'KwaZuluNatal',
                    'Limpopo': 'Limpopo',
                    'Mpumalanga': 'Mpumalanga',
                    'Northern Cape': 'NorthernCape',
                    'North West': 'NorthWest',
                    'Western Cape': 'WesternCape'
                }
                
                # Reset province data
                for key in main_stats['dataCollection']['speakers']['byRegion']:
                    main_stats['dataCollection']['speakers']['byRegion'][key] = 0
                
                # Update with actual data
                for province, count in generated_stats['demographics']['provinces'].items():
                    mapped_province = province_mapping.get(province, province.replace(' ', ''))
                    if mapped_province in main_stats['dataCollection']['speakers']['byRegion']:
                        main_stats['dataCollection']['speakers']['byRegion'][mapped_province] = count
        
        # Update timestamp
        main_stats['timeline']['lastUpdated'] = "2025-01-26"
        
        # Save updated stats
        with open(main_stats_file, 'w', encoding='utf-8') as f:
            json.dump(main_stats, f, indent=2, ensure_ascii=False)
        
        print("[SUCCESS] Main stats.json updated with current data")
        
    except Exception as e:
        print(f"[WARNING] Could not update main stats.json: {e}")

def generate_summary_report(csv_dir):
    """Generate a summary report of the statistics"""
    
    try:
        stats_generated_file = csv_dir / "stats_generated.json"
        with open(stats_generated_file, 'r', encoding='utf-8') as f:
            stats = json.load(f)
        
        print(f"\n" + "="*50)
        print(f"STATISTICS SUMMARY REPORT")
        print(f"="*50)
        print(f"Total Clips: {stats['overview']['totalClips']:,}")
        print(f"Total Hours: {stats['overview']['totalHours']:.2f}")
        print(f"Total Speakers: {stats['overview']['totalSpeakers']}")
        print(f"Languages: {stats['overview']['totalLanguages']}")
        
        print(f"\n[LANGUAGES] Language Breakdown:")
        for lang_code, lang_data in sorted(stats['languages'].items(), 
                                         key=lambda x: x[1]['hours'], reverse=True):
            print(f"  {lang_data['name']:>12}: {lang_data['hours']:>8.2f}h "
                  f"({lang_data['clips']:>5,} clips, {lang_data['speakers']:>3} speakers)")
        
        if 'demographics' in stats and 'provinces' in stats['demographics']:
            print(f"\n[PROVINCES] Province Distribution:")
            for province, count in sorted(stats['demographics']['provinces'].items(), 
                                        key=lambda x: x[1], reverse=True):
                print(f"  {province:>15}: {count:>4,} clips")
        
        print(f"\n[READY] Ndebele Integration Status:")
        print(f"  - Scripts support isiNdebele (nbl) language code")
        print(f"  - Geographic mapping includes all 9 provinces")
        print(f"  - CSV export includes combined province-language columns")
        print(f"  - Main stats.json preserves Ndebele placeholders")
        
    except Exception as e:
        print(f"[WARNING] Could not generate summary report: {e}")

if __name__ == "__main__":
    print("Starting comprehensive statistics regeneration...")
    success = regenerate_all_statistics()
    
    if success:
        print(f"\n[COMPLETE] All statistics successfully regenerated and updated!")
        sys.exit(0)
    else:
        print(f"\n[ERROR] Statistics regeneration failed. Please check errors above.")
        sys.exit(1)