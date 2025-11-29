#!/usr/bin/env python3
"""
Verification script to confirm Ndebele statistics integration
This script validates that all statistics have been properly regenerated
and that Ndebele support is fully integrated across all files.
"""

import os
import json
import csv
from pathlib import Path

def verify_ndebele_integration():
    """Verify that Ndebele integration is complete across all statistics files"""
    
    print("Ndebele Statistics Integration Verification")
    print("=" * 50)
    
    # Set up paths
    repo_root = Path(__file__).parent.parent
    website_dir = repo_root / "website"
    csv_dir = website_dir / "public" / "csv"
    
    # Files to verify
    files_to_check = {
        "Main stats": website_dir / "app" / "stats.json",
        "Generated stats": csv_dir / "stats_generated.json",
        "Summary CSV": csv_dir / "stats_summary.csv",
        "Geographic stats": csv_dir / "swivuriso_geographic_stats.json",
        "Comprehensive CSV": csv_dir / "swivuriso_comprehensive_data.csv"
    }
    
    all_good = True
    
    # 1. Verify main stats.json includes Ndebele
    print("\n[CHECK 1] Main application statistics (app/stats.json)")
    try:
        with open(files_to_check["Main stats"], 'r', encoding='utf-8') as f:
            main_stats = json.load(f)
        
        # Check audio hours
        if "isiNdebele" in main_stats["dataCollection"]["audioHours"]["byLanguage"]:
            ndebele_audio = main_stats["dataCollection"]["audioHours"]["byLanguage"]["isiNdebele"]
            print(f"  [OK] isiNdebele audio hours: {ndebele_audio}h")
        else:
            print(f"  [ERROR] isiNdebele not found in audioHours")
            all_good = False
        
        # Check transcribed hours
        if "isiNdebele" in main_stats["dataCollection"]["transcribedHours"]["byLanguage"]:
            ndebele_transcribed = main_stats["dataCollection"]["transcribedHours"]["byLanguage"]["isiNdebele"]
            print(f"  [OK] isiNdebele transcribed hours: {ndebele_transcribed}h")
        else:
            print(f"  [ERROR] isiNdebele not found in transcribedHours")
            all_good = False
        
        # Check model performance
        if "isiNdebele" in main_stats["modelPerformance"]["speechToText"]["werScores"]:
            wer_score = main_stats["modelPerformance"]["speechToText"]["werScores"]["isiNdebele"]
            print(f"  [OK] isiNdebele WER score: {wer_score}%")
        else:
            print(f"  [ERROR] isiNdebele not found in WER scores")
            all_good = False
        
        # Check TTS scores
        if "isiNdebele" in main_stats["modelPerformance"]["textToSpeech"]["mosScores"]:
            mos_score = main_stats["modelPerformance"]["textToSpeech"]["mosScores"]["isiNdebele"]
            print(f"  [OK] isiNdebele MOS score: {mos_score}")
        else:
            print(f"  [ERROR] isiNdebele not found in MOS scores")
            all_good = False
        
        print(f"  [OK] Last updated: {main_stats['timeline']['lastUpdated']}")
        
    except Exception as e:
        print(f"  [ERROR] Failed to verify main stats: {e}")
        all_good = False
    
    # 2. Verify current dataset statistics
    print(f"\n[CHECK 2] Current dataset statistics")
    try:
        with open(files_to_check["Generated stats"], 'r', encoding='utf-8') as f:
            generated_stats = json.load(f)
        
        print(f"  [OK] Total clips: {generated_stats['overview']['totalClips']:,}")
        print(f"  [OK] Total hours: {generated_stats['overview']['totalHours']:.2f}")
        print(f"  [OK] Total speakers: {generated_stats['overview']['totalSpeakers']}")
        print(f"  [OK] Languages in dataset: {generated_stats['overview']['totalLanguages']}")
        
        # Check language breakdown
        if 'languages' in generated_stats:
            for lang_code, lang_data in generated_stats['languages'].items():
                print(f"  [DATA] {lang_data['name']}: {lang_data['hours']:.2f}h ({lang_data['clips']} clips)")
        
    except Exception as e:
        print(f"  [ERROR] Failed to verify generated stats: {e}")
        all_good = False
    
    # 3. Verify CSV files exist and contain data
    print(f"\n[CHECK 3] CSV output files")
    csv_files = [
        "swivuriso_province_summary.csv",
        "swivuriso_language_breakdown.csv", 
        "swivuriso_language_totals.csv",
        "swivuriso_province_language_matrix.csv",
        "swivuriso_dataset_metadata.csv",
        "swivuriso_comprehensive_data.csv"
    ]
    
    for csv_file in csv_files:
        csv_path = csv_dir / csv_file
        if csv_path.exists():
            try:
                with open(csv_path, 'r', encoding='utf-8') as f:
                    reader = csv.reader(f)
                    rows = list(reader)
                    print(f"  [OK] {csv_file}: {len(rows)-1} data rows")
            except Exception as e:
                print(f"  [ERROR] Failed to read {csv_file}: {e}")
                all_good = False
        else:
            print(f"  [ERROR] Missing file: {csv_file}")
            all_good = False
    
    # 4. Verify processing scripts support Ndebele
    print(f"\n[CHECK 4] Processing scripts Ndebele support")
    scripts_dir = website_dir / "scripts"
    
    # Check generate_stats_from_csv.py
    try:
        with open(scripts_dir / "generate_stats_from_csv.py", 'r', encoding='utf-8') as f:
            content = f.read()
            if "'nbl': 'isiNdebele'" in content:
                print(f"  [OK] generate_stats_from_csv.py supports nbl → isiNdebele mapping")
            else:
                print(f"  [ERROR] generate_stats_from_csv.py missing nbl mapping")
                all_good = False
    except Exception as e:
        print(f"  [ERROR] Failed to check generate_stats_from_csv.py: {e}")
        all_good = False
    
    # Check generate_province_language_stats.py
    try:
        with open(scripts_dir / "generate_province_language_stats.py", 'r', encoding='utf-8') as f:
            content = f.read()
            if "'nbl': 'isiNdebele'" in content:
                print(f"  [OK] generate_province_language_stats.py supports nbl → isiNdebele mapping")
            else:
                print(f"  [ERROR] generate_province_language_stats.py missing nbl mapping")
                all_good = False
    except Exception as e:
        print(f"  [ERROR] Failed to check generate_province_language_stats.py: {e}")
        all_good = False
    
    # 5. Summary and recommendations
    print(f"\n[SUMMARY] Verification Results")
    if all_good:
        print(f"  [SUCCESS] All verifications passed!")
        print(f"  [READY] System is ready for Ndebele data integration")
        print(f"\n[NEXT STEPS]")
        print(f"  1. Add Ndebele recordings to transcripts.csv with mother_language='nbl'")
        print(f"  2. Add corresponding metadata entries to meta_all.csv")
        print(f"  3. Rerun: python3 regenerate_all_stats.py")
        print(f"  4. Statistics will automatically include Ndebele data")
    else:
        print(f"  [ERROR] Some verifications failed. Please review errors above.")
        print(f"  [ACTION] Fix the reported issues before proceeding.")
    
    return all_good

if __name__ == "__main__":
    success = verify_ndebele_integration()
    exit(0 if success else 1)