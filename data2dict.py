#!/usr/bin/env python

import simplejson as json
import csv
from decimal import Decimal

res={}
cr = csv.reader(open('newdata.csv', 'rb'))
for i in cr:
    x={}
    x['Number']=i[0]
    x['Name']=i[1]
    x['Country']=i[2]
    x['Lat']=Decimal(i[3])
    x['Long']=Decimal(i[4])
    x['Height']=Decimal(i[5])
    x['Temps']=map(Decimal,i[6:])
    
    res[i[0]]=x
    
f = open('datadict.json','w')
f.write('var mapdict = ')
json.dump(res,f,indent=1,use_decimal=True)
f.close()
