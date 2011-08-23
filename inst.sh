#!/bin/sh
rm -rf web.DS_Store
rsync --exclude=.hg -avz web/ www.codeminders.com:/var/www/html/weather_similarity
ssh www.codeminders.com "chmod -R a+r /var/www/html/weather_similarity"
ssh www.codeminders.com 'chmod a+rx `find /var/www/html/weather_similarity -type d`'