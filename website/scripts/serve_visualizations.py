#!/usr/bin/env python3
"""
Simple HTTP server to view the Swivuriso visualizations locally.
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path
import argparse

def serve_visualizations(port=8000, directory=None):
    """Start a local HTTP server to serve visualization files."""
    
    if directory is None:
        directory = Path("../public/visualizations/").resolve()
    else:
        directory = Path(directory).resolve()
    
    if not directory.exists():
        print(f"Error: Directory {directory} does not exist!")
        return
    
    # Change to the visualization directory
    os.chdir(directory)
    
    # Create HTTP server
    handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"Serving Swivuriso visualizations at http://localhost:{port}")
            print(f"Directory: {directory}")
            print("\nAvailable visualizations:")
            print(f"  - http://localhost:{port}/index.html (summary page)")
            print(f"  - http://localhost:{port}/swivuriso_provinces_bar.html (interactive bar chart)")
            print(f"  - http://localhost:{port}/swivuriso_languages_pie.html (interactive pie chart)")
            print(f"  - Static images: swivuriso_sa_map.png, swivuriso_language_heatmap.png")
            print(f"\nPress Ctrl+C to stop the server")
            
            # Try to open the browser automatically
            try:
                webbrowser.open(f"http://localhost:{port}/index.html")
            except:
                pass
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"Port {port} is already in use. Try a different port with --port option.")
        else:
            print(f"Error starting server: {e}")

def main():
    parser = argparse.ArgumentParser(description='Serve Swivuriso visualizations locally')
    parser.add_argument('--port', '-p', type=int, default=8000,
                       help='Port to serve on (default: 8000)')
    parser.add_argument('--directory', '-d', 
                       default='../public/visualizations/',
                       help='Directory to serve (default: ../public/visualizations/)')
    
    args = parser.parse_args()
    
    serve_visualizations(args.port, args.directory)

if __name__ == "__main__":
    main()