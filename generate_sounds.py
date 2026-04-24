"""
Loopable ambient sound generator — bundles directly into app assets
"""
import wave, struct, math, random, os

SAMPLE_RATE = 44100
DURATION = 30  # seconds — short enough to load fast, long enough before loop is noticed
N = SAMPLE_RATE * DURATION
os.makedirs("assets/sounds", exist_ok=True)

def write_wav(filename, samples):
    path = f"assets/sounds/{filename}"
    with wave.open(path, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(struct.pack(f'<{len(samples)}h', *samples))
    print(f"✓ {path}")

def clamp(v, lo=-32767, hi=32767):
    return max(lo, min(hi, int(v)))

# White Noise
random.seed(42)
white = [clamp(random.gauss(0, 8000)) for _ in range(N)]
write_wav("white_noise.wav", white)

# Brown Noise (integrated white noise)
brown, val = [], 0.0
for s in white:
    val = (val + s * 0.02) * 0.998
    brown.append(clamp(val * 400))
write_wav("brown_noise.wav", brown)

# Rain (filtered white noise bursts)
rain = []
burst_state = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    burst_state = burst_state * 0.97 + noise * 0.03
    # Add drip transients
    drop = 0
    if random.random() < 0.003:
        drop = random.gauss(0, 1) * 5000 * math.exp(-((i % 100) / 20.0))
    rain.append(clamp((burst_state * 15000) + drop))
write_wav("rain.wav", rain)

# Ocean waves (slow sine modulated noise)
ocean = []
for i in range(N):
    wave_mod = 0.5 + 0.5 * math.sin(2 * math.pi * i / (SAMPLE_RATE * 4.5))
    noise = random.gauss(0, 1)
    ocean.append(clamp(noise * 12000 * wave_mod))
write_wav("ocean.wav", ocean)

# Fan (steady low-frequency hum + noise)
fan = []
for i in range(N):
    hum = math.sin(2 * math.pi * 60 * i / SAMPLE_RATE) * 3000
    hum += math.sin(2 * math.pi * 120 * i / SAMPLE_RATE) * 1500
    noise = random.gauss(0, 3000)
    fan.append(clamp(hum + noise))
write_wav("fan.wav", fan)

# Forest (birds chirp + wind)
forest = []
chirp_phase = 0.0
for i in range(N):
    wind = random.gauss(0, 4000) * (0.3 + 0.7 * abs(math.sin(2 * math.pi * i / (SAMPLE_RATE * 8))))
    bird = 0
    if random.random() < 0.0005:
        chirp_phase = random.uniform(2000, 5000)
    if chirp_phase > 0:
        bird = math.sin(2 * math.pi * chirp_phase * i / SAMPLE_RATE) * 6000 * math.exp(-i % 4000 / 500)
        chirp_phase *= 0.9999
        if chirp_phase < 100:
            chirp_phase = 0
    forest.append(clamp(wind + bird))
write_wav("forest.wav", forest)

# Thunderstorm (rain + thunder rumble)
storm = []
rumble = 0.0
for i in range(N):
    noise = random.gauss(0, 1)
    rumble = rumble * 0.995 + noise * 0.005
    rain_layer = random.gauss(0, 8000)
    thunder = rumble * 20000 if random.random() < 0.00001 else 0
    storm.append(clamp(rain_layer + thunder))
write_wav("thunderstorm.wav", storm)

# Fireplace (crackle = random spikes + low rumble)
fire = []
for i in range(N):
    rumble = random.gauss(0, 2000)
    crackle = 0
    if random.random() < 0.008:
        crackle = random.gauss(0, 1) * 18000 * math.exp(-(random.random() * 20))
    fire.append(clamp(rumble + crackle))
write_wav("fireplace.wav", fire)

print("\nAll sounds generated!")
