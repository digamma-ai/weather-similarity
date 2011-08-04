#!/usr/bin/env python

import sys,string

inf  = file(sys.argv[1],"r")
rec = {}
for f in inf:
    if f.startswith("Obs:"):
        break
    field = f.split('=')
    if len(field)==2:
        name = field[0].strip()
        val = field[1].strip()
        rec[name]=val

if not rec.has_key("Country"):
    rec["Country"]="Unknown"
    
keys = ['Number','Name','Normals','Lat','Long','Height',]

if not reduce(lambda x, y: rec.has_key(y) and x,keys,True):
    mf = reduce(lambda x, y: x if rec.has_key(y) else ([y]+x) ,keys, [])
    print >> sys.stderr, "%s: Missing fields: %s" % (sys.argv[1],mf)
    sys.exit(1)

ns = string.split(rec["Normals"])

if len(ns)!=12:
    print >> sys.stderr, "%s: Bad normals size: %s" % (sys.argv[1],ns)
    sys.exit(1)

if reduce(lambda x, y: y=='-99.0' and x,ns,True):
    print >> sys.stderr, "%s: Skipping due to missing normals" % sys.argv[1]
    sys.exit(1)

print '"%s","%s","%s",%s' % (rec["Number"],rec["Name"],rec["Country"],
                        string.join([rec[x] for x in keys[3:]] + ns,","))

