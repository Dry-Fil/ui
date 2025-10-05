#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Vite build..."
vite build

echo "Moving assets and CSS files..."
mv dist/assets/* dist/css/* dist/

echo "Removing empty directories..."
rmdir dist/css dist/assets

echo "Removing img directory..."
rm -r dist/img

echo "Replacing '/assets/' with 'assets/' in index.html..."
sed -i 's/\/assets\//\//g' dist/index.html

echo "Applying gzip compression to build assets..."
# Check if gzip is installed
if ! command -v gzip &> /dev/null
then
    echo "gzip could not be found, please install it."
    exit 1
fi

# Find all HTML, CSS, and JS files and gzip them
find dist -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -exec gzip "{}" \;

echo "Build process completed successfully!"
