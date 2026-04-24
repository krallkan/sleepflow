"""
SleepFlow — 30 loopable ambient sounds
Float processing throughout, peak-normalized to -6dB, 50ms crossfade at loop boundary.
"""
import wave, struct, math, random, os

SAMPLE_RATE = 44100
DURATION = 30
N = SAMPLE_RATE * DURATION
TARGET_PEAK = 0.50
CROSSFADE = int(SAMPLE_RATE * 0.05)

os.makedirs("assets/sounds", exist_ok=True)
random.seed(42)

def write(filename, samples):
    peak = max(abs(s) for s in samples) or 1.0
    scale = TARGET_PEAK * 32767.0 / peak
    cf = min(CROSSFADE, len(samples) // 4)
    for i in range(cf):
        t = i / cf
        samples[i] = samples[i] * t + samples[-cf + i] * (1 - t)
    ints = [max(-32767, min(32767, int(s * scale))) for s in samples]
    path = f"assets/sounds/{filename}"
    with wave.open(path, 'w') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SAMPLE_RATE)
        f.writeframes(struct.pack(f'<{len(ints)}h', *ints))
    print(f"✓ {filename}")

def gauss_stream(n):
    return [random.gauss(0, 1) for _ in range(n)]

def lowpass(samples, coeff):
    out, v = [], 0.0
    for s in samples:
        v = v * coeff + s * (1 - coeff)
        out.append(v)
    return out

# 1 — White Noise
write("white_noise.wav", gauss_stream(N))

# 2 — Pink Noise  (Voss-McCartney approximation)
pink = []
b = [0.0] * 7
white_src = gauss_stream(N)
for s in white_src:
    b[0] = 0.99886 * b[0] + s * 0.0555179
    b[1] = 0.99332 * b[1] + s * 0.0750759
    b[2] = 0.96900 * b[2] + s * 0.1538520
    b[3] = 0.86650 * b[3] + s * 0.3104856
    b[4] = 0.55000 * b[4] + s * 0.5329522
    b[5] = -0.7616 * b[5] - s * 0.0168980
    pink.append(sum(b) + s * 0.5362)
write("pink_noise.wav", pink)

# 3 — Brown Noise
white2 = gauss_stream(N)
brown = lowpass(white2, 0.998)
write("brown_noise.wav", brown)

# 4 — Gray Noise (psychoacoustically flat, shaped pink)
gray = []
b2 = [0.0] * 7
w3 = gauss_stream(N)
for i, s in enumerate(w3):
    b2[0] = 0.99886 * b2[0] + s * 0.0555179
    b2[1] = 0.99332 * b2[1] + s * 0.0750759
    b2[2] = 0.96900 * b2[2] + s * 0.1538520
    b2[3] = 0.86650 * b2[3] + s * 0.3104856
    b2[4] = 0.55000 * b2[4] + s * 0.5329522
    b2[5] = -0.7616 * b2[5] - s * 0.0168980
    pink_s = sum(b2) + s * 0.5362
    gray.append(pink_s * 0.7 + s * 0.3)
write("gray_noise.wav", gray)

# 5 — Fan  (50Hz hum + harmonics + broadband)
fan = []
for i in range(N):
    t = i / SAMPLE_RATE
    hum = (math.sin(2*math.pi*50*t)*0.4
           + math.sin(2*math.pi*100*t)*0.2
           + math.sin(2*math.pi*150*t)*0.1
           + math.sin(2*math.pi*200*t)*0.05)
    fan.append(hum + random.gauss(0, 0.15))
write("fan.wav", fan)

# 6 — Rain
rain = []
drizzle = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    drizzle = drizzle * 0.93 + noise * 0.07
    drop = 0.0
    if random.random() < 0.004:
        age = i % int(SAMPLE_RATE * 0.08)
        drop = random.gauss(0, 0.5) * math.exp(-50 * age / SAMPLE_RATE)
    rain.append(drizzle * 0.8 + drop)
write("rain.wav", rain)

# 7 — Ocean Waves
ocean = []
lp1 = lp2 = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    lp1 = lp1 * 0.92 + noise * 0.08
    lp2 = lp2 * 0.97 + lp1 * 0.03
    swell = 0.3 + 0.7 * (0.5 + 0.5 * math.sin(2*math.pi*i/(SAMPLE_RATE*5.5)))
    ocean.append(lp2 * swell)
write("ocean.wav", ocean)

# 8 — Thunderstorm
storm = []
rlp = tlp = 0.0
for i in range(N):
    rlp = rlp * 0.91 + random.gauss(0, 1) * 0.09
    tlp = tlp * 0.9995 + random.gauss(0, 0.003)
    if random.random() < 0.000015:
        tlp += random.uniform(0.4, 0.9)
    storm.append(rlp * 0.75 + tlp * 0.35)
write("thunderstorm.wav", storm)

# 9 — Heavy Rain
heavyrain = []
hlp = 0.0
for i in range(N):
    hlp = hlp * 0.88 + random.gauss(0, 1) * 0.12
    drop = 0.0
    if random.random() < 0.012:
        age = i % int(SAMPLE_RATE * 0.05)
        drop = random.gauss(0, 0.8) * math.exp(-80 * age / SAMPLE_RATE)
    heavyrain.append(hlp + drop * 0.5)
write("heavy_rain.wav", heavyrain)

# 10 — Light Drizzle
drizzle_out = []
dlp = 0.0
for i in range(N):
    dlp = dlp * 0.96 + random.gauss(0, 1) * 0.04
    drop = 0.0
    if random.random() < 0.002:
        age = i % int(SAMPLE_RATE * 0.1)
        drop = random.gauss(0, 0.25) * math.exp(-30 * age / SAMPLE_RATE)
    drizzle_out.append(dlp * 0.5 + drop)
write("light_drizzle.wav", drizzle_out)

# 11 — Rain on Window
rain_win = []
wlp = 0.0
for i in range(N):
    wlp = wlp * 0.94 + random.gauss(0, 1) * 0.06
    tap = 0.0
    if random.random() < 0.006:
        age = i % int(SAMPLE_RATE * 0.06)
        tap = random.gauss(0, 0.6) * math.exp(-120 * age / SAMPLE_RATE)
    streak = 0.0
    if random.random() < 0.001:
        streak = random.gauss(0, 0.2)
    rain_win.append(wlp * 0.4 + tap * 0.4 + streak * 0.2)
write("rain_on_window.wav", rain_win)

# 12 — Waterfall
wfall = []
lpa = lpb = lpc = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    lpa = lpa * 0.80 + n * 0.20
    lpb = lpb * 0.90 + lpa * 0.10
    lpc = lpc * 0.95 + lpb * 0.05
    wfall.append(lpa * 0.5 + lpb * 0.35 + lpc * 0.15)
write("waterfall.wav", wfall)

# 13 — Stream / Creek
stream = []
s1 = s2 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    s1 = s1 * 0.85 + n * 0.15
    s2 = s2 * 0.97 + s1 * 0.03
    gurgle = 0.0
    if random.random() < 0.008:
        gurgle = random.gauss(0, 0.3) * math.sin(random.uniform(400, 900) * i / SAMPLE_RATE)
    stream.append(s1 * 0.4 + s2 * 0.4 + gurgle * 0.2)
write("stream.wav", stream)

# 14 — Forest
forest = []
wlp_f = 0.0
ca, cf_freq, cage = False, 0.0, 0
for i in range(N):
    wlp_f = wlp_f * 0.97 + random.gauss(0, 1) * 0.03
    wmod = 0.4 + 0.6 * abs(math.sin(2*math.pi*i/(SAMPLE_RATE*9)))
    wind = wlp_f * wmod * 0.6
    bird = 0.0
    if not ca and random.random() < 0.0004:
        ca, cf_freq, cage = True, random.uniform(2400, 4800), 0
    if ca:
        env = math.exp(-cage / (SAMPLE_RATE * 0.12))
        bird = math.sin(2*math.pi*cf_freq*i/SAMPLE_RATE) * env * 0.25
        cage += 1
        if env < 0.01: ca = False
    forest.append(wind + bird)
write("forest.wav", forest)

# 15 — Fireplace
fire = []
rlp_f = 0.0
for i in range(N):
    rlp_f = rlp_f * 0.985 + random.gauss(0, 1) * 0.015
    crackle = 0.0
    if random.random() < 0.006:
        amp = random.uniform(0.1, 0.35)
        age = i % int(SAMPLE_RATE * 0.02)
        crackle = random.choice([-1, 1]) * amp * math.exp(-150 * age / SAMPLE_RATE)
    fire.append(rlp_f * 0.6 + crackle)
write("fireplace.wav", fire)

# 16 — Campfire (softer, more open air)
camp = []
clp = 0.0
for i in range(N):
    clp = clp * 0.990 + random.gauss(0, 1) * 0.010
    crackle = 0.0
    if random.random() < 0.004:
        amp = random.uniform(0.05, 0.25)
        age = i % int(SAMPLE_RATE * 0.015)
        crackle = random.choice([-1, 1]) * amp * math.exp(-200 * age / SAMPLE_RATE)
    wind_bg = random.gauss(0, 0.04)
    camp.append(clp * 0.5 + crackle + wind_bg)
write("campfire.wav", camp)

# 17 — Morning Birds
mbirds = []
birds_state = []
for i in range(N):
    bg = random.gauss(0, 0.05)
    total_bird = 0.0
    if random.random() < 0.0006:
        birds_state.append({
            'freq': random.uniform(1800, 5500),
            'mod': random.uniform(3, 12),
            'age': 0,
            'decay': random.uniform(0.08, 0.25)
        })
    new_state = []
    for b in birds_state:
        env = math.exp(-b['age'] / (SAMPLE_RATE * b['decay']))
        freq_mod = b['freq'] * (1 + 0.15 * math.sin(2*math.pi*b['mod']*b['age']/SAMPLE_RATE))
        total_bird += math.sin(2*math.pi*freq_mod*i/SAMPLE_RATE) * env * 0.2
        b['age'] += 1
        if env > 0.01: new_state.append(b)
    birds_state = new_state[:6]
    mbirds.append(bg + total_bird)
write("morning_birds.wav", mbirds)

# 18 — Night Crickets
crickets = []
cricket_phases = [random.uniform(0, 2*math.pi) for _ in range(12)]
cricket_freqs = [random.uniform(3800, 4400) for _ in range(12)]
cricket_rates = [random.uniform(14, 22) for _ in range(12)]
for i in range(N):
    t = i / SAMPLE_RATE
    sig = 0.0
    for j in range(12):
        chirp_env = 0.5 + 0.5 * math.sin(2*math.pi*cricket_rates[j]*t + cricket_phases[j])
        chirp_env = max(0, chirp_env) ** 2
        sig += math.sin(2*math.pi*cricket_freqs[j]*t) * chirp_env * 0.07
    bg = random.gauss(0, 0.03)
    crickets.append(sig + bg)
write("night_crickets.wav", crickets)

# 19 — Jungle Night
jungle = []
jlp = 0.0
j_birds = []
for i in range(N):
    jlp = jlp * 0.96 + random.gauss(0, 1) * 0.04
    insect = 0.0
    for f in [3200, 4100, 5200]:
        t_mod = 0.5 + 0.5 * math.sin(2*math.pi*random.uniform(8,18)*i/SAMPLE_RATE)
        insect += math.sin(2*math.pi*f*i/SAMPLE_RATE) * t_mod * 0.04
    if random.random() < 0.0003:
        j_birds.append({'freq': random.uniform(800, 3000), 'age': 0, 'dec': random.uniform(0.15, 0.4)})
    bird_sig = 0.0
    new_jb = []
    for b in j_birds:
        env = math.exp(-b['age']/(SAMPLE_RATE*b['dec']))
        bird_sig += math.sin(2*math.pi*b['freq']*i/SAMPLE_RATE) * env * 0.15
        b['age'] += 1
        if env > 0.01: new_jb.append(b)
    j_birds = new_jb[:8]
    jungle.append(jlp * 0.3 + insect + bird_sig)
write("jungle_night.wav", jungle)

# 20 — Gentle Breeze
breeze = []
blp1 = blp2 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    blp1 = blp1 * 0.97 + n * 0.03
    blp2 = blp2 * 0.995 + blp1 * 0.005
    mod = 0.5 + 0.5 * math.sin(2*math.pi*i/(SAMPLE_RATE*7))
    breeze.append((blp1 * 0.6 + blp2 * 0.4) * (0.3 + 0.7 * mod))
write("gentle_breeze.wav", breeze)

# 21 — Mountain Wind
mwind = []
mwlp1 = mwlp2 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    mwlp1 = mwlp1 * 0.94 + n * 0.06
    mwlp2 = mwlp2 * 0.99 + mwlp1 * 0.01
    gust = 0.6 + 0.4 * math.sin(2*math.pi*i/(SAMPLE_RATE*4.2) + 0.8)
    mwind.append((mwlp1 * 0.7 + mwlp2 * 0.3) * gust)
write("mountain_wind.wav", mwind)

# 22 — Blizzard
bliz = []
bzlp1 = bzlp2 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    bzlp1 = bzlp1 * 0.92 + n * 0.08
    bzlp2 = bzlp2 * 0.985 + bzlp1 * 0.015
    howl = 1.0 + 0.5 * math.sin(2*math.pi*i/(SAMPLE_RATE*2.8))
    bliz.append((bzlp1 * 0.65 + bzlp2 * 0.35) * howl)
write("blizzard.wav", bliz)

# 23 — Cave Drips
cave = []
for i in range(N):
    bg = random.gauss(0, 0.015)
    reverb = 0.0
    if random.random() < 0.0012:
        age = i % int(SAMPLE_RATE * 0.4)
        reverb = (random.gauss(0, 0.6) * math.exp(-8 * age / SAMPLE_RATE)
                  * math.sin(2*math.pi*random.uniform(400, 900)*age/SAMPLE_RATE))
    cave.append(bg + reverb)
write("cave_drips.wav", cave)

# 24 — Underwater
uwater = []
ulp1 = ulp2 = ulp3 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    ulp1 = ulp1 * 0.97 + n * 0.03
    ulp2 = ulp2 * 0.99 + ulp1 * 0.01
    ulp3 = ulp3 * 0.995 + ulp2 * 0.005
    bubble = 0.0
    if random.random() < 0.003:
        age = i % int(SAMPLE_RATE * 0.05)
        bubble = random.gauss(0, 0.3) * math.sin(2*math.pi*random.uniform(200, 600)*age/SAMPLE_RATE) * math.exp(-30*age/SAMPLE_RATE)
    uwater.append(ulp3 + bubble * 0.4)
write("underwater.wav", uwater)

# 25 — Singing Bowl
bowl = []
fund = 220.0
for i in range(N):
    t = i / SAMPLE_RATE
    env = 0.3 + 0.7 * math.exp(-0.015 * t)
    tone = (math.sin(2*math.pi*fund*t) * 0.5
            + math.sin(2*math.pi*fund*2.756*t) * 0.25
            + math.sin(2*math.pi*fund*5.404*t) * 0.12
            + math.sin(2*math.pi*fund*9.0*t) * 0.06)
    bowl.append(tone * env + random.gauss(0, 0.008))
write("singing_bowl.wav", bowl)

# 26 — Heartbeat
hbeat = []
bpm = 58
beat_interval = int(SAMPLE_RATE * 60 / bpm)
for i in range(N):
    phase = i % beat_interval
    lub = 0.0
    dub = 0.0
    if phase < int(SAMPLE_RATE * 0.12):
        lub = math.sin(2*math.pi*50*phase/SAMPLE_RATE) * math.exp(-30*phase/SAMPLE_RATE) * 0.8
    dub_start = int(beat_interval * 0.3)
    dub_phase = phase - dub_start
    if 0 <= dub_phase < int(SAMPLE_RATE * 0.08):
        dub = math.sin(2*math.pi*60*dub_phase/SAMPLE_RATE) * math.exp(-40*dub_phase/SAMPLE_RATE) * 0.5
    hbeat.append(lub + dub + random.gauss(0, 0.015))
write("heartbeat.wav", hbeat)

# 27 — Airplane Cabin
plane = []
p1 = p2 = p3 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    p1 = p1 * 0.87 + n * 0.13
    p2 = p2 * 0.97 + p1 * 0.03
    p3 = p3 * 0.999 + p2 * 0.001
    t = i / SAMPLE_RATE
    engine = (math.sin(2*math.pi*105*t)*0.12
              + math.sin(2*math.pi*210*t)*0.06
              + math.sin(2*math.pi*315*t)*0.03)
    plane.append(p1 * 0.5 + p2 * 0.3 + p3 * 0.1 + engine)
write("airplane_cabin.wav", plane)

# 28 — Train
train = []
t1 = t2 = 0.0
clack_interval = int(SAMPLE_RATE * 0.52)
for i in range(N):
    t1 = t1 * 0.91 + random.gauss(0, 1) * 0.09
    t2 = t2 * 0.997 + t1 * 0.003
    t_sec = i / SAMPLE_RATE
    engine = (math.sin(2*math.pi*78*t_sec)*0.15
              + math.sin(2*math.pi*156*t_sec)*0.08)
    clack = 0.0
    cp = i % clack_interval
    if cp < int(SAMPLE_RATE * 0.04):
        clack = random.gauss(0, 0.5) * math.exp(-80*cp/SAMPLE_RATE)
    train.append(t1 * 0.4 + t2 * 0.2 + engine + clack * 0.25)
write("train.wav", train)

# 29 — Washing Machine
wash = []
drum_period = int(SAMPLE_RATE * 1.8)
for i in range(N):
    t_sec = i / SAMPLE_RATE
    motor = (math.sin(2*math.pi*50*t_sec)*0.25
             + math.sin(2*math.pi*100*t_sec)*0.12
             + math.sin(2*math.pi*150*t_sec)*0.06)
    drum_phase = (i % drum_period) / drum_period
    drum_mod = 0.6 + 0.4 * math.sin(2*math.pi*drum_phase)
    water = random.gauss(0, 0.12) * drum_mod
    wash.append(motor * drum_mod + water)
write("washing_machine.wav", wash)

# 30 — Air Conditioner
ac = []
a1 = a2 = 0.0
for i in range(N):
    n = random.gauss(0, 1)
    a1 = a1 * 0.95 + n * 0.05
    a2 = a2 * 0.998 + a1 * 0.002
    t_sec = i / SAMPLE_RATE
    hum = (math.sin(2*math.pi*60*t_sec)*0.18
           + math.sin(2*math.pi*120*t_sec)*0.09
           + math.sin(2*math.pi*180*t_sec)*0.04)
    ac.append(a1 * 0.5 + a2 * 0.3 + hum)
write("air_conditioner.wav", ac)

print(f"\n✅ 30 ses üretildi — -6dB normalize, loop-ready.")
