#!/usr/bin/env python3
"""
Generate interactive South African map visualization for Swivuriso geographic distribution.
Shows provinces shaded by total hours of recorded speech with dominant language labels.
"""

import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import argparse
from pathlib import Path

# South African province name mappings for different data sources
PROVINCE_MAPPINGS = {
    'Eastern Cape': ['Eastern Cape', 'EC'],
    'Free State': ['Free State', 'FS'],
    'Gauteng': ['Gauteng', 'GP'],
    'KwaZulu-Natal': ['KwaZulu-Natal', 'KZN'],
    'Limpopo': ['Limpopo', 'LP'],
    'Mpumalanga': ['Mpumalanga', 'MP'],
    'Northern Cape': ['Northern Cape', 'NC'],
    'North West': ['North West', 'NW'],
    'Western Cape': ['Western Cape', 'WC']
}

def load_swivuriso_data(json_file):
    """Load the Swivuriso geographic statistics from JSON file."""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def prepare_map_data(swivuriso_data):
    """Prepare data for map visualization."""
    provinces_data = []
    
    for province_name, province_info in swivuriso_data['provinces'].items():
        if province_info['has_data']:
            dominant_lang = province_info['dominant_language']
            
            # Create hover text with detailed breakdown
            hover_text = f"<b>{province_name}</b><br>"
            hover_text += f"Total Hours: {province_info['total_hours']:.1f}h<br>"
            hover_text += f"Total Clips: {province_info['total_clips']:,}<br>"
            hover_text += f"<b>Dominant Language:</b><br>"
            hover_text += f"{dominant_lang['name']} ({dominant_lang['percentage']:.1f}%)<br>"
            hover_text += f"{dominant_lang['hours']:.1f}h, {dominant_lang['clips']:,} clips<br><br>"
            hover_text += "<b>Language Breakdown:</b><br>"
            
            # Add top 3 languages to hover text
            lang_breakdown = province_info['language_breakdown']
            sorted_langs = sorted(lang_breakdown.items(), 
                                key=lambda x: x[1]['hours'], reverse=True)
            
            for i, (lang_name, lang_data) in enumerate(sorted_langs[:3]):
                hover_text += f"{lang_name}: {lang_data['percentage']:.1f}% ({lang_data['hours']:.1f}h)<br>"
            
            if len(sorted_langs) > 3:
                hover_text += f"... and {len(sorted_langs) - 3} more languages"
            
            provinces_data.append({
                'province': province_name,
                'total_hours': province_info['total_hours'],
                'total_clips': province_info['total_clips'],
                'dominant_language': dominant_lang['name'],
                'dominant_percentage': dominant_lang['percentage'],
                'hover_text': hover_text,
                'log_hours': max(0.1, province_info['total_hours'])  # For log scale if needed
            })
    
    return pd.DataFrame(provinces_data)

def create_choropleth_map(df, output_file):
    """Create an interactive choropleth map of South Africa."""
    
    # Color scale for hours (using a warm color scheme)
    color_scale = [
        [0.0, '#FFF7E6'],    # Very light orange
        [0.2, '#FFDD94'],    # Light orange
        [0.4, '#FFB347'],    # Medium orange
        [0.6, '#FF8C42'],    # Orange
        [0.8, '#FF6B35'],    # Deep orange
        [1.0, '#CC5500']     # Dark orange/red
    ]
    
    # Create the choropleth map
    fig = go.Figure(data=go.Choropleth(
        locations=df['province'],
        z=df['total_hours'],
        locationmode='geojson-id',
        colorscale=color_scale,
        reversescale=False,
        marker_line_color='darkgray',
        marker_line_width=1.5,
        colorbar=dict(
            title="Total Hours<br>of Speech",
            titleside="right",
            tickmode="linear",
            tick0=0,
            dtick=200,
            thickness=20,
            len=0.7,
            x=1.02
        ),
        text=df['dominant_language'],
        textfont=dict(size=12, color='black'),
        textposition='middle center',
        hovertemplate='%{hovertext}<extra></extra>',
        hovertext=df['hover_text']
    ))
    
    # We'll need to add custom province boundaries since Plotly doesn't have built-in SA provinces
    # For now, let's create a simple visualization
    
    fig.update_layout(
        title={
            'text': 'Swivuriso: Geographic Distribution Across South African Provinces<br>' +
                   '<sub>Provinces shaded by total hours of recorded speech. Labels show dominant language.</sub>',
            'x': 0.5,
            'font': {'size': 20}
        },
        geo=dict(
            showframe=False,
            showcoastlines=True,
            projection_type='mercator',
            center=dict(lat=-29, lon=25),  # Center on South Africa
            lonaxis=dict(range=[16, 33]),
            lataxis=dict(range=[-35, -22]),
        ),
        font=dict(size=14),
        width=1200,
        height=800,
        annotations=[
            dict(
                text=f"Total Dataset: {df['total_hours'].sum():.1f} hours | " +
                     f"{df['total_clips'].sum():,} clips | " +
                     f"{len(df)} provinces",
                showarrow=False,
                xref="paper", yref="paper",
                x=0.5, y=-0.1,
                xanchor='center',
                font=dict(size=12, color='gray')
            )
        ]
    )
    
    # Save the interactive map
    fig.write_html(output_file)
    print(f"Interactive map saved to: {output_file}")
    
    return fig

def create_bar_chart(df, output_file):
    """Create a bar chart showing province distribution."""
    
    # Sort by total hours for better visualization
    df_sorted = df.sort_values('total_hours', ascending=True)
    
    # Create color mapping based on dominant language
    language_colors = {
        'isiZulu': '#1f77b4',
        'isiXhosa': '#ff7f0e', 
        'Sesotho': '#2ca02c',
        'seTswana': '#d62728',
        'Xitsonga': '#9467bd',
        'TshiVenda': '#8c564b',
        'isiNdebele': '#e377c2'
    }
    
    colors = [language_colors.get(lang, '#7f7f7f') for lang in df_sorted['dominant_language']]
    
    fig = go.Figure(data=[
        go.Bar(
            y=df_sorted['province'],
            x=df_sorted['total_hours'],
            orientation='h',
            marker=dict(color=colors, line=dict(color='black', width=1)),
            text=[f"{hours:.1f}h<br>({lang})" for hours, lang in 
                  zip(df_sorted['total_hours'], df_sorted['dominant_language'])],
            textposition='inside',
            textfont=dict(color='white', size=10),
            hovertemplate='<b>%{y}</b><br>' +
                         'Total Hours: %{x:.1f}h<br>' +
                         'Dominant Language: %{customdata}<br>' +
                         '<extra></extra>',
            customdata=df_sorted['dominant_language']
        )
    ])
    
    fig.update_layout(
        title={
            'text': 'Swivuriso: Total Hours by Province<br>' +
                   '<sub>Bars colored by dominant language</sub>',
            'x': 0.5,
            'font': {'size': 18}
        },
        xaxis_title="Total Hours of Recorded Speech",
        yaxis_title="Province",
        font=dict(size=12),
        width=1000,
        height=600,
        margin=dict(l=150, r=50, t=100, b=50)
    )
    
    # Add legend for language colors
    for lang, color in language_colors.items():
        if lang in df['dominant_language'].values:
            fig.add_trace(go.Scatter(
                x=[None], y=[None],
                mode='markers',
                marker=dict(size=10, color=color),
                name=lang,
                showlegend=True
            ))
    
    fig.write_html(output_file)
    print(f"Bar chart saved to: {output_file}")
    
    return fig

def create_language_pie_chart(swivuriso_data, output_file):
    """Create a pie chart showing overall language distribution."""
    
    # Aggregate language data across all provinces
    language_totals = {}
    
    for province_info in swivuriso_data['provinces'].values():
        if province_info['has_data']:
            for lang_name, lang_data in province_info['language_breakdown'].items():
                if lang_name not in language_totals:
                    language_totals[lang_name] = {'hours': 0, 'clips': 0}
                language_totals[lang_name]['hours'] += lang_data['hours']
                language_totals[lang_name]['clips'] += lang_data['clips']
    
    # Sort by hours
    sorted_languages = sorted(language_totals.items(), 
                            key=lambda x: x[1]['hours'], reverse=True)
    
    languages = [lang for lang, _ in sorted_languages]
    hours = [data['hours'] for _, data in sorted_languages]
    clips = [data['clips'] for _, data in sorted_languages]
    
    fig = go.Figure(data=[
        go.Pie(
            labels=languages,
            values=hours,
            hole=0.3,
            textinfo='label+percent',
            textposition='outside',
            hovertemplate='<b>%{label}</b><br>' +
                         'Hours: %{value:.1f}h<br>' +
                         'Percentage: %{percent}<br>' +
                         'Clips: %{customdata:,}<br>' +
                         '<extra></extra>',
            customdata=clips
        )
    ])
    
    fig.update_layout(
        title={
            'text': 'Swivuriso: Language Distribution Across All Provinces<br>' +
                   f'<sub>Total: {sum(hours):.1f} hours | {sum(clips):,} clips</sub>',
            'x': 0.5,
            'font': {'size': 18}
        },
        font=dict(size=12),
        width=800,
        height=600
    )
    
    fig.write_html(output_file)
    print(f"Language pie chart saved to: {output_file}")
    
    return fig

def main():
    parser = argparse.ArgumentParser(description='Generate South African map visualization for Swivuriso data')
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
    
    # Prepare map data
    print("Preparing visualization data...")
    df = prepare_map_data(swivuriso_data)
    
    print(f"\nDataset Summary:")
    print(f"  Total Hours: {df['total_hours'].sum():.1f}")
    print(f"  Total Clips: {df['total_clips'].sum():,}")
    print(f"  Provinces: {len(df)}")
    print(f"  Languages: {df['dominant_language'].nunique()}")
    
    # Create visualizations
    print("\nGenerating visualizations...")
    
    # 1. Choropleth map (simplified since we don't have geojson)
    print("1. Creating province bar chart...")
    bar_fig = create_bar_chart(df, output_dir / 'swivuriso_provinces_bar.html')
    
    # 2. Language distribution pie chart
    print("2. Creating language distribution pie chart...")
    pie_fig = create_language_pie_chart(swivuriso_data, output_dir / 'swivuriso_languages_pie.html')
    
    # 3. Create a summary table
    print("3. Creating summary table...")
    summary_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Swivuriso Geographic Distribution Summary</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .header {{ color: #333; border-bottom: 2px solid #007acc; }}
            .number {{ text-align: right; }}
        </style>
    </head>
    <body>
        <h1 class="header">Swivuriso: Geographic Distribution Summary</h1>
        <p><strong>Generated:</strong> {swivuriso_data['generated_at']}</p>
        
        <h2>Dataset Overview</h2>
        <ul>
            <li><strong>Total Hours:</strong> {swivuriso_data['summary']['total_hours']:,.1f} hours</li>
            <li><strong>Total Clips:</strong> {swivuriso_data['summary']['total_clips']:,}</li>
            <li><strong>Provinces with Data:</strong> {swivuriso_data['summary']['provinces_with_data']}</li>
        </ul>
        
        <h2>Province Breakdown</h2>
        <table>
            <tr>
                <th>Province</th>
                <th>Total Hours</th>
                <th>Total Clips</th>
                <th>Dominant Language</th>
                <th>Dominance %</th>
            </tr>
    """
    
    for _, row in df.sort_values('total_hours', ascending=False).iterrows():
        summary_html += f"""
            <tr>
                <td>{row['province']}</td>
                <td class="number">{row['total_hours']:.1f}</td>
                <td class="number">{row['total_clips']:,}</td>
                <td>{row['dominant_language']}</td>
                <td class="number">{row['dominant_percentage']:.1f}%</td>
            </tr>
        """
    
    summary_html += """
        </table>
        
        <h2>Visualizations</h2>
        <ul>
            <li><a href="swivuriso_provinces_bar.html">Province Distribution (Bar Chart)</a></li>
            <li><a href="swivuriso_languages_pie.html">Language Distribution (Pie Chart)</a></li>
        </ul>
    </body>
    </html>
    """
    
    with open(output_dir / 'index.html', 'w', encoding='utf-8') as f:
        f.write(summary_html)
    
    print(f"\nVisualization files created in: {output_dir}")
    print("  - index.html (summary page)")
    print("  - swivuriso_provinces_bar.html (interactive bar chart)")
    print("  - swivuriso_languages_pie.html (interactive pie chart)")
    print(f"\nOpen {output_dir / 'index.html'} in your browser to view the visualizations!")

if __name__ == "__main__":
    main()