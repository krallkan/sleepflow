"""
High-quality loopable ambient sound generator for SleepFlow
- Float processing throughout, peak-normalized at -6dB to prevent any clipping
- 15-second loops with crossfade at boundaries for seamless looping
"""
import wave, struct, math, random, os

SAMPLE_RATE = 44100
DURATION = 30
N = SAMPLE_RATE * DURATION
TARGET_PEAK = 0.50  # -6dB — comfortable listening level, no clipping
CROSSFADE = int(SAMPLE_RATE * 0.05)  # 50ms crossfade at loop boundary

os.makedirs("assets/sounds", exist_ok=True)

def normalize_and_write(filename, samples_f):
    peak = max(abs(s) for s in samples_f)
    if peak == 0:
        peak = 1
    scale = TARGET_PEAK * 32767 / peak
    # Crossfade loop boundaries to eliminate click on repeat
    cf = min(CROSSFADE, len(samples_f) // 4)
    for i in range(cf):
        t = i / cf
        samples_f[i] = samples_f[i] * t + samples_f[-cf + i] * (1 - t)
    samples_i = [max(-32767, min(32767, int(s * scale))) for s in samples_f]
    path = f"assets/sounds/{filename}"
    with wave.open(path, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(struct.pack(f'<{len(samples_i)}h', *samples_i))
    print(f"✓ {path}  (peak scale: {scale:.2f}x)")

random.seed(42)

# --- White Noise ---
# Gaussian noise, consistent energy across all frequencies
white_raw = [random.gauss(0, 1) for _ in range(N)]
normalize_and_write("white_noise.wav", white_raw)

# --- Brown Noise ---
# Integrated white noise → warm, bass-heavy rumble
brown_raw, val = [], 0.0
for s in white_raw:
    val = val * 0.998 + s * 0.015
    brown_raw.append(val)
normalize_and_write("brown_noise.wav", brown_raw)

# --- Rain ---
# Multi-layer: background drizzle + individual drops
rain_raw = []
drizzle = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    drizzle = drizzle * 0.94 + noise * 0.06  # low-pass filtered noise
    drop = 0.0
    if random.random() < 0.004:  # occasional drop impact
        t = i / SAMPLE_RATE
        drop = random.gauss(0, 0.4) * math.exp(-random.uniform(30, 80) * (i % int(SAMPLE_RATE * 0.1)) / SAMPLE_RATE)
    rain_raw.append(drizzle * 0.7 + drop)
normalize_and_write("rain.wav", rain_raw)

# --- Ocean Waves ---
# Slow sinusoidal swell modulating noise, gentle and deep
ocean_raw = []
lp1, lp2 = 0.0, 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    lp1 = lp1 * 0.92 + noise * 0.08
    lp2 = lp2 * 0.97 + lp1 * 0.03
    swell = 0.3 + 0.7 * (0.5 + 0.5 * math.sin(2 * math.pi * i / (SAMPLE_RATE * 5.5)))
    ocean_raw.append(lp2 * swell)
normalize_and_write("ocean.wav", ocean_raw)

# --- Fan ---
# Steady electric fan: 50Hz hum + harmonics + gentle broadband noise
fan_raw = []
for i in range(N):
    t = i / SAMPLE_RATE
    hum = (math.sin(2 * math.pi * 50 * t) * 0.35
           + math.sin(2 * math.pi * 100 * t) * 0.18
           + math.sin(2 * math.pi * 150 * t) * 0.08)
    noise = random.gauss(0, 0.12)
    fan_raw.append(hum + noise)
normalize_and_write("fan.wav", fan_raw)

# --- Forest ---
# Wind through trees (low-freq modulated noise) + distant bird chirps
forest_raw = []
wind_lp = 0.0
chirp_active, chirp_freq, chirp_age = False, 0.0, 0
for i in range(N):
    noise = random.gauss(0, 1)
    wind_lp = wind_lp * 0.97 + noise * 0.03
    wind_mod = 0.4 + 0.6 * abs(math.sin(2 * math.pi * i / (SAMPLE_RATE * 9)))
    wind = wind_lp * wind_mod * 0.6
    bird = 0.0
    if not chirp_active and random.random() < 0.0004:
        chirp_active = True
        chirp_freq = random.uniform(2400, 4800)
        chirp_age = 0
    if chirp_active:
        envelope = math.exp(-chirp_age / (SAMPLE_RATE * 0.12))
        bird = math.sin(2 * math.pi * chirp_freq * i / SAMPLE_RATE) * envelope * 0.25
        chirp_age += 1
        if envelope < 0.01:
            chirp_active = False
    forest_raw.append(wind + bird)
normalize_and_write("forest.wav", forest_raw)

# --- Thunderstorm ---
# Heavy rain layer + soft rolling thunder (no sudden spikes)
storm_raw = []
rain_lp = 0.0
thunder_lp = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    rain_lp = rain_lp * 0.91 + noise * 0.09
    thunder_lp = thunder_lp * 0.9995 + random.gauss(0, 0.003)
    if random.random() < 0.000015:  # rare soft thunder roll
        thunder_lp += random.uniform(0.3, 0.7)
    storm_raw.append(rain_lp * 0.75 + thunder_lp * 0.35)
normalize_and_write("thunderstorm.wav", storm_raw)

# --- Fireplace ---
# Soft low rumble + gentle crackles (no hard clipping transients)
fire_raw = []
rumble_lp = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    rumble_lp = rumble_lp * 0.985 + noise * 0.015
    crackle = 0.0
    if random.random() < 0.006:  # soft crackle pop
        amp = random.uniform(0.1, 0.35)
        decay = random.uniform(80, 200)
        crackle = random.choice([-1, 1]) * amp * math.exp(-decay * (i % int(SAMPLE_RATE * 0.02)) / SAMPLE_RATE)
    fire_raw.append(rumble_lp * 0.6 + crackle)
normalize_and_write("fireplace.wav", fire_raw)

print("\n✅ All 8 sounds generated — normalized to -6dB, loop-ready.")
