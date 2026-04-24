"""
SleepFlow - Modern icon generator
Design: Deep dark background, glowing moon, soft sound wave rings
"""
import math
from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
CORNER = 220  # rounded corner radius for adaptive icon feel

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(4))

def make_icon(size=1024, for_adaptive=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2

    # --- Background gradient (deep navy → deep purple) ---
    bg = Image.new("RGBA", (size, size))
    bg_draw = ImageDraw.Draw(bg)
    c_top    = (10, 8, 35, 255)
    c_bottom = (28, 14, 62, 255)
    for y in range(size):
        t = y / size
        col = lerp_color(c_top, c_bottom, t)
        bg_draw.line([(0, y), (size, y)], fill=col)

    if not for_adaptive:
        # Rounded rect clip for icon
        mask = Image.new("L", (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=CORNER, fill=255)
        img.paste(bg, (0, 0), mask)
    else:
        img.paste(bg, (0, 0))

    draw = ImageDraw.Draw(img)

    # --- Outer glow rings (sound waves) ---
    moon_r = int(size * 0.19)
    moon_cx = int(cx + size * 0.04)
    moon_cy = int(cy - size * 0.04)

    wave_colors = [
        (108, 99, 255, 18),
        (108, 99, 255, 12),
        (108, 99, 255, 7),
    ]
    wave_radii = [
        int(moon_r * 1.85),
        int(moon_r * 2.45),
        int(moon_r * 3.1),
    ]
    for i, (wr, wc) in enumerate(zip(wave_radii, wave_colors)):
        glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        lw = max(2, int(size * 0.012))
        gd.ellipse(
            [moon_cx - wr, moon_cy - wr, moon_cx + wr, moon_cy + wr],
            outline=wc, width=lw
        )
        glow = glow.filter(ImageFilter.GaussianBlur(radius=int(size * 0.008)))
        img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)

    # --- Moon glow halo ---
    halo_r = int(moon_r * 1.35)
    halo_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    halo_draw = ImageDraw.Draw(halo_img)
    halo_draw.ellipse(
        [moon_cx - halo_r, moon_cy - halo_r, moon_cx + halo_r, moon_cy + halo_r],
        fill=(108, 99, 255, 60)
    )
    halo_img = halo_img.filter(ImageFilter.GaussianBlur(radius=int(size * 0.055)))
    img = Image.alpha_composite(img, halo_img)
    draw = ImageDraw.Draw(img)

    # --- Moon body ---
    moon_color = (230, 225, 255, 255)
    draw.ellipse(
        [moon_cx - moon_r, moon_cy - moon_r, moon_cx + moon_r, moon_cy + moon_r],
        fill=moon_color
    )

    # --- Crescent bite (subtract) ---
    bite_offset_x = int(moon_r * 0.42)
    bite_offset_y = int(-moon_r * 0.18)
    bite_r = int(moon_r * 0.82)
    bite_cx = moon_cx + bite_offset_x
    bite_cy = moon_cy + bite_offset_y

    # Sample background color at bite center for seamless removal
    bite_bg = (22, 11, 50, 255)
    draw.ellipse(
        [bite_cx - bite_r, bite_cy - bite_r, bite_cx + bite_r, bite_cy + bite_r],
        fill=bite_bg
    )

    # --- Small stars ---
    stars = [
        (cx - int(size*0.27), cy - int(size*0.32), 3),
        (cx + int(size*0.28), cy - int(size*0.26), 2),
        (cx - int(size*0.32), cy + int(size*0.08), 2),
        (cx + int(size*0.22), cy + int(size*0.30), 3),
        (cx - int(size*0.10), cy - int(size*0.36), 2),
        (cx + int(size*0.35), cy - int(size*0.05), 2),
        (cx - int(size*0.38), cy - int(size*0.15), 3),
        (cx + int(size*0.10), cy + int(size*0.38), 2),
    ]
    for sx, sy, sr in stars:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 255, 255, 200))

    # --- "Z Z Z" sleep dots bottom right ---
    dot_col = (108, 99, 255, 180)
    dots = [
        (int(cx + size*0.24), int(cy + size*0.27), int(size*0.022)),
        (int(cx + size*0.31), int(cy + size*0.32), int(size*0.015)),
        (int(cx + size*0.37), int(cy + size*0.36), int(size*0.010)),
    ]
    for dx, dy, dr in dots:
        draw.ellipse([dx - dr, dy - dr, dx + dr, dy + dr], fill=dot_col)

    return img


# Main icon (1024x1024)
icon = make_icon(1024, for_adaptive=False)
icon.save("assets/icon.png")
print("✓ icon.png saved (1024x1024)")

# Adaptive icon foreground (1024x1024, no rounded corners, transparent bg area)
adaptive = make_icon(1024, for_adaptive=True)
adaptive.save("assets/adaptive-icon.png")
print("✓ adaptive-icon.png saved")

# Splash icon (centered, bigger, transparent bg)
splash = Image.new("RGBA", (1024, 1024), (13, 17, 23, 255))
icon_small = make_icon(512, for_adaptive=True)
offset = (256, 256)
splash.paste(icon_small, offset, icon_small)
splash.save("assets/splash-icon.png")
print("✓ splash-icon.png saved")

print("\nAll icons generated successfully!")
