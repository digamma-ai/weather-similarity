#!/usr/bin/env python

import json
f = open('data.json','r')
d=json.load(f)
res={}
for i in d:
    res[(i['Number'])]=i
f.close()

f = open('datadict.json','w')
json.dump(res,f,indent=1)
f.close()
