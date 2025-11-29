#!/usr/bin/env python3
"""
Generate South African geographic map using matplotlib with province boundaries.
Creates a choropleth map showing Swivuriso data distribution.
"""

import json
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.colors import LinearSegmentedColormap
import numpy as np
from pathlib import Path
import argparse

def load_swivuriso_data(json_file):
    """Load the Swivuriso geographic statistics from JSON file."""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def create_simplified_sa_map(swivuriso_data, output_file):
    """Create a simplified South African map visualization."""
    
    # Extract province data
    provinces_data = []
    for province_name, province_info in swivuriso_data['provinces'].items():
        if province_info['has_data']:
            provinces_data.append({
                'province': province_name,
                'total_hours': province_info['total_hours'],
                'dominant_language': province_info['dominant_language']['name'],
                'dominant_percentage': province_info['dominant_language']['percentage']
            })
    
    df = pd.DataFrame(provinces_data)
    
    # Create figure with subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
    
    # --- Left subplot: Horizontal bar chart with map-like ordering ---
    # Sort provinces roughly by geographic position (north to south, west to east)
    province_order = [
        'Limpopo', 'North West', 'Gauteng', 'Mpumalanga',
        'Free State', 'KwaZulu-Natal', 'Northern Cape', 
        'Eastern Cape', 'Western Cape'
    ]
    
    # Filter to only provinces with data and maintain order
    available_provinces = df['province'].tolist()
    ordered_provinces = [p for p in province_order if p in available_provinces]
    df_ordered = df.set_index('province').reindex(ordered_provinces).reset_index()
    
    # Create color mapping based on total hours
    norm = plt.Normalize(vmin=df['total_hours'].min(), vmax=df['total_hours'].max())
    cmap = plt.cm.OrRd  # Orange-Red colormap
    colors = [cmap(norm(hours)) for hours in df_ordered['total_hours']]
    
    # Create horizontal bar chart
    bars = ax1.barh(range(len(df_ordered)), df_ordered['total_hours'], 
                    color=colors, edgecolor='black', linewidth=1)
    
    # Customize the bar chart
    ax1.set_yticks(range(len(df_ordered)))
    ax1.set_yticklabels(df_ordered['province'])
    ax1.set_xlabel('Total Hours of Recorded Speech', fontsize=12)
    ax1.set_title('Swivuriso: Hours by Province\n(Arranged roughly by geographic position)', 
                  fontsize=14, fontweight='bold')
    ax1.grid(axis='x', alpha=0.3)
    
    # Add value labels on bars with dominant language
    for i, (hours, lang) in enumerate(zip(df_ordered['total_hours'], df_ordered['dominant_language'])):
        ax1.text(hours + 10, i, f'{hours:.0f}h\n({lang})', 
                va='center', ha='left', fontsize=9, fontweight='bold')
    
    # Add colorbar
    sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)
    sm.set_array([])
    cbar = plt.colorbar(sm, ax=ax1, shrink=0.6, aspect=20)
    cbar.set_label('Hours of Speech', fontsize=10)
    
    # --- Right subplot: Pie chart of language distribution ---
    # Aggregate language data
    language_totals = {}
    for province_info in swivuriso_data['provinces'].values():
        if province_info['has_data']:
            for lang_name, lang_data in province_info['language_breakdown'].items():
                if lang_name not in language_totals:
                    language_totals[lang_name] = 0
                language_totals[lang_name] += lang_data['hours']
    
    # Sort and prepare for pie chart
    sorted_languages = sorted(language_totals.items(), key=lambda x: x[1], reverse=True)
    languages = [lang for lang, _ in sorted_languages]
    hours = [hours for _, hours in sorted_languages]
    
    # Create pie chart
    colors_pie = plt.cm.Set3(np.linspace(0, 1, len(languages)))
    wedges, texts, autotexts = ax2.pie(hours, labels=languages, autopct='%1.1f%%',
                                       startangle=90, colors=colors_pie,
                                       textprops={'fontsize': 10})
    
    ax2.set_title('Language Distribution\nAcross All Provinces', 
                  fontsize=14, fontweight='bold')
    
    # Enhance pie chart text
    for autotext in autotexts:
        autotext.set_color('black')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(9)
    
    # Add summary statistics
    total_hours = swivuriso_data['summary']['total_hours']
    total_clips = swivuriso_data['summary']['total_clips']
    provinces_count = swivuriso_data['summary']['provinces_with_data']
    
    fig.suptitle(f'Swivuriso Dataset: Geographic and Language Distribution\n' +
                f'Total: {total_hours:.1f} hours | {total_clips:,} clips | {provinces_count} provinces',
                fontsize=16, fontweight='bold', y=0.95)
    
    plt.tight_layout(rect=[0, 0, 1, 0.92])
    
    # Save the plot
    plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white')
    plt.savefig(output_file.replace('.png', '.pdf'), bbox_inches='tight', facecolor='white')
    
    print(f"Static visualization saved to: {output_file}")
    print(f"PDF version saved to: {output_file.replace('.png', '.pdf')}")
    
    return fig

def create_language_heatmap(swivuriso_data, output_file):
    """Create a heatmap showing language distribution across provinces."""
    
    # Prepare data for heatmap
    provinces = []
    languages = set()
    
    # Collect all provinces and languages
    for province_name, province_info in swivuriso_data['provinces'].items():
        if province_info['has_data']:
            provinces.append(province_name)
            languages.update(province_info['language_breakdown'].keys())
    
    languages = sorted(list(languages))
    
    # Create matrix
    matrix = np.zeros((len(provinces), len(languages)))
    
    for i, province_name in enumerate(provinces):
        province_info = swivuriso_data['provinces'][province_name]
        for j, lang in enumerate(languages):
            if lang in province_info['language_breakdown']:
                # Use percentage of total hours in province
                matrix[i][j] = province_info['language_breakdown'][lang]['percentage']
    
    # Create heatmap
    fig, ax = plt.subplots(figsize=(12, 8))
    
    im = ax.imshow(matrix, cmap='YlOrRd', aspect='auto')
    
    # Set ticks and labels
    ax.set_xticks(np.arange(len(languages)))
    ax.set_yticks(np.arange(len(provinces)))
    ax.set_xticklabels(languages, rotation=45, ha='right')
    ax.set_yticklabels(provinces)
    
    # Add colorbar
    cbar = plt.colorbar(im, ax=ax)
    cbar.set_label('Percentage of Total Hours in Province (%)', fontsize=12)
    
    # Add text annotations
    for i in range(len(provinces)):
        for j in range(len(languages)):
            if matrix[i][j] > 0:
                text = ax.text(j, i, f'{matrix[i][j]:.1f}%',
                             ha="center", va="center", color="black" if matrix[i][j] < 50 else "white",
                             fontsize=8, fontweight='bold')
    
    ax.set_title('Language Distribution Heatmap by Province\n' +
                'Percentage of each language within each province',
                fontsize=14, fontweight='bold', pad=20)
    ax.set_xlabel('Languages', fontsize=12)
    ax.set_ylabel('Provinces', fontsize=12)
    
    plt.tight_layout()
    
    # Save the plot
    plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white')
    plt.savefig(output_file.replace('.png', '.pdf'), bbox_inches='tight', facecolor='white')
    
    print(f"Language heatmap saved to: {output_file}")
    print(f"PDF version saved to: {output_file.replace('.png', '.pdf')}")
    
    return fig

def main():
    parser = argparse.ArgumentParser(description='Generate static South African map visualizations')
    parser.add_argument('--input', '-i', 
                       default='../public/csv/swivuriso_geographic_stats.json',
                       help='Input JSON file with geographic statistics')
    parser.add_argument('--output-dir', '-o', 
                       default='../public/visualizations/',
                       help='Output directory for visualization files')
    
    args = parser.parse_args()
    
    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load data
    print(f"Loading data from {args.input}...")
    swivuriso_data = load_swivuriso_data(args.input)
    
    print("Generating static visualizations...")
    
    # 1. Main map visualization
    print("1. Creating South African map visualization...")
    map_fig = create_simplified_sa_map(swivuriso_data, 
                                      str(output_dir / 'swivuriso_sa_map.png'))
    
    # 2. Language heatmap
    print("2. Creating language distribution heatmap...")
    heatmap_fig = create_language_heatmap(swivuriso_data, 
                                         str(output_dir / 'swivuriso_language_heatmap.png'))
    
    print(f"\nStatic visualization files created in: {output_dir}")
    print("  - swivuriso_sa_map.png (main map visualization)")
    print("  - swivuriso_sa_map.pdf (PDF version)")
    print("  - swivuriso_language_heatmap.png (language heatmap)")
    print("  - swivuriso_language_heatmap.pdf (PDF version)")

if __name__ == "__main__":
    main()