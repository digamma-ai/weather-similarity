#!/bin/sh
rm -f data.csv

echo "Number,Name,Country,Lat,Long,Height,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec" > data.csv
find station_files.20110720 -type f -exec ./CSV_extract.py {} \; >> data.csv
