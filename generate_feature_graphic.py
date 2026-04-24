"""
Play Store Feature Graphic — 1024x500 px
"""
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1024, 500

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(4))

img = Image.new("RGBA", (W, H))
draw = ImageDraw.Draw(img)

# Background gradient
c_left  = (10, 8, 35, 255)
c_right = (28, 14, 62, 255)
for x in range(W):
    t = x / W
    col = lerp_color(c_left, c_right, t)
    draw.line([(x, 0), (x, H)], fill=col)

# Moon (left-center area)
moon_cx, moon_cy = int(W * 0.28), int(H * 0.48)
moon_r = int(H * 0.32)

# Halo
halo = Image.new("RGBA", (W, H), (0,0,0,0))
hd = ImageDraw.Draw(halo)
hr = int(moon_r * 1.5)
hd.ellipse([moon_cx-hr, moon_cy-hr, moon_cx+hr, moon_cy+hr], fill=(108,99,255,55))
halo = halo.filter(ImageFilter.GaussianBlur(radius=40))
img = Image.alpha_composite(img, halo)
draw = ImageDraw.Draw(img)

# Sound wave rings
for i, factor in enumerate([1.9, 2.6, 3.3]):
    wr = int(moon_r * factor)
    alpha = [22, 14, 8][i]
    gw = Image.new("RGBA", (W, H), (0,0,0,0))
    gd = ImageDraw.Draw(gw)
    gd.ellipse([moon_cx-wr, moon_cy-wr, moon_cx+wr, moon_cy+wr],
               outline=(108, 99, 255, alpha), width=3)
    gw = gw.filter(ImageFilter.GaussianBlur(radius=3))
    img = Image.alpha_composite(img, gw)
draw = ImageDraw.Draw(img)

# Moon body
draw.ellipse([moon_cx-moon_r, moon_cy-moon_r, moon_cx+moon_r, moon_cy+moon_r],
             fill=(230, 225, 255, 255))

# Crescent bite
bite_r = int(moon_r * 0.78)
bite_cx = moon_cx + int(moon_r * 0.40)
bite_cy = moon_cy - int(moon_r * 0.15)
draw.ellipse([bite_cx-bite_r, bite_cy-bite_r, bite_cx+bite_r, bite_cy+bite_r],
             fill=(22, 11, 50, 255))

# Stars
stars = [
    (int(W*0.52), int(H*0.12), 3),
    (int(W*0.63), int(H*0.22), 2),
    (int(W*0.75), int(H*0.10), 3),
    (int(W*0.85), int(H*0.28), 2),
    (int(W*0.91), int(H*0.15), 2),
    (int(W*0.68), int(H*0.80), 2),
    (int(W*0.15), int(H*0.15), 2),
    (int(W*0.08), int(H*0.70), 3),
]
for sx, sy, sr in stars:
    draw.ellipse([sx-sr, sy-sr, sx+sr, sy+sr], fill=(255,255,255,200))

# Text — App name
try:
    font_big  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
    font_med  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    font_tag  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
except:
    font_big = font_med = font_tag = ImageFont.load_default()

text_x = int(W * 0.48)
# App name
draw.text((text_x, int(H * 0.28)), "SleepFlow", font=font_big, fill=(230, 225, 255, 255))
# Tagline
draw.text((text_x, int(H * 0.58)), "White Noise & Sleep Sounds", font=font_med, fill=(155, 147, 255, 220))
# Sub tagline
draw.text((text_x, int(H * 0.74)), "Sleep better. Focus deeper.", font=font_tag, fill=(139, 148, 158, 200))

import os
os.makedirs("store", exist_ok=True)
img = img.convert("RGB")
img.save("store/feature_graphic.png")
print("✓ store/feature_graphic.png saved (1024x500)")
