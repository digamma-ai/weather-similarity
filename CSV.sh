#!/bin/sh
rm -f data.csv
find station_files.20110720 -type f -exec ./CSV_extract.py {} \; > data.csv
