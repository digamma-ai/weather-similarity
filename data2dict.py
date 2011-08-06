#!/usr/bin/env python

#(requires simplejson)

import simplejson as json
from decimal import Decimal

f = open('data.json','r')
d = json.load(f)
f.close()

res={}
nfields=["m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11","m12",
         "Long","Lat","Height"]
for i in d:
    for fn in nfields:
        i[fn] = Decimal(i[fn])
    res[(i['Number'])]=i

f = open('datadict.json','w')
json.dump(res,f,indent=1,use_decimal=True)
f.close()
