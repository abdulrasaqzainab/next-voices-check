# Stats Generation Scripts

## ⚠️ IMPORTANT: Data Privacy Warning

These scripts process **ALL data including hidden test sets**. The generated files contain sensitive information that **MUST NOT** be shared publicly or committed to public repositories.

**Generated files to keep private:**
- `data/meta_all_combined.csv` - Combined metadata with test data
- `data/transcripts_all_combined.csv` - Combined transcripts with test data
- `public/csv/stats_generated.json` - Generated statistics
- `public/csv/stats_summary.csv` - Generated summary CSV

**Add to .gitignore:**
```
# Combined CSV files (contain test data)
data/meta_all_combined.csv
data/transcripts_all_combined.csv

# Generated statistics
public/csv/stats_generated.json
public/csv/stats_summary.csv
website/public/csv/stats_generated.json
website/public/csv/stats_summary.csv
```

## Scripts

### Step 1: Combine Language CSV Files
**File:** `combine_language_csvs.py`

Combines individual language-specific CSV files into master files with language information.

**Usage:**
```bash
python3 website/scripts/combine_language_csvs.py
```

**Output:**
- `data/meta_all_combined.csv` - Combined metadata with `mother_language` column
- `data/transcripts_all_combined.csv` - Combined transcripts

### Step 2: Generate Statistics
**File:** `generate_stats_from_csv.py`

Generates comprehensive statistics from meta and transcripts CSV files, including:
- Overview metrics (total clips, hours, speakers, languages)
- Per-language breakdowns with:
  - Clips, hours, speakers, avgDuration
  - Gender distribution (male/female per language)
  - Age group distribution (18-29, 30-39, 40-49, 50-59, 60+)
  - Domain distribution (Agriculture, Health, General, etc.)
- Global demographics (provinces, genders, age groups)

**Language ISO codes supported:**
- `ZUL` → isiZulu
- `XHO` → isiXhosa
- `SOT` → Sesotho
- `TSN` → seTswana
- `TSO` → Xitsonga
- `VEN` → Tshivenda
- `NBL` → isiNdebele

**Usage:**
```bash
# From repository root (using combined files)
python3 website/scripts/generate_stats_from_csv.py \
  --meta=data/meta_all_combined.csv \
  --transcripts=data/transcripts_all_combined.csv

# Or from website directory
cd website
python3 scripts/generate_stats_from_csv.py \
  --meta=../data/meta_all_combined.csv \
  --transcripts=../data/transcripts_all_combined.csv
```

**Output files:**
- `website/public/csv/stats_generated.json` - Complete statistics JSON
- `website/public/csv/stats_summary.csv` - Summary CSV table
- Output CSV: `website/public/csv/stats_summary.csv`

### Node.js Script (Alternative)
**File:** `generate_stats_from_csv.js`

Provides basic statistics generation using csv-parse.

**Usage:**
```bash
cd website
node scripts/generate_stats_from_csv.js
```

## Output Format

### JSON Structure
```json
{
  "overview": {
    "totalClips": 59622,
    "totalHours": 418.99,
    "totalSpeakers": 663,
    "totalLanguages": 7
  },
  "languages": {
    "zul": {
      "name": "isiZulu",
      "clips": 16805,
      "hours": 123.41,
      "speakers": 276,
      "avgDuration": 26.44,
      "genders": { "male": 66, "female": 210 },
      "ageGroups": { "18-29": 138, "30-39": 99, "40-49": 27, "50-59": 7, "60+": 4 },
      "domains": { "Agriculture": 2731, "Health": 2770, "General": 9292, ... }
    },
    ...
  },
  "demographics": {
    "ageGroups": { "18-29": 337, "30-39": 234, ... },
    "genders": { "male": 161, "female": 502 },
    "provinces": { "Gauteng": 251, "KwaZulu-Natal": 151, ... }
  }
}
```

## Updating StatsVisualization Component

After generating new stats:

1. **Run the script** to generate fresh data
2. **Copy the JSON content** from `public/csv/stats_generated.json`
3. **Update** `components/StatsVisualization.tsx`:
   - Replace the `stats` constant (around line 54) with the new data
4. **Do NOT commit** the generated CSV/JSON files to public repos

## Requirements

- **Python:** 3.6+ (uses only stdlib: csv, json, argparse, os, re, collections)
- **Node.js:** 14+ (requires csv-parse package, already in package.json)
