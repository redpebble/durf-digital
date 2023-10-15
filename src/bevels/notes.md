bevel size:      b = 30
stroke width:    s = 4
mid edge length: m = 8

viewmax: v = b * 2 + (s * 2) / 2 + m
           = 2b + s + m
           = 30 * 2 + 4 + 8
           = 60 + 12
           = 72

min = s / 2   = 2
max = v - min = 70
bmin = min + b = 32
bmax = max - b = 40

bevel points = 
    min bmin, bmin min, // tl
    bmax min, max bmin, // tr
    max bmax, bmax max, // br
    bmin max, min bmax  // bl

rect points = 
    min min, // tl
    max min, // tr
    max max, // br
    min max  // bl

bevel corner px = bmin = 32