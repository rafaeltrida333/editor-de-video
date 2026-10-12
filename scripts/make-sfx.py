"""Generates the sound effects in public/sfx/ from scratch (no third-party audio).

Usage: python3 scripts/make-sfx.py
"""
import math
import os
import random
import struct
import wave

RATE = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx')


def write(name, samples):
    peak = max(abs(s) for s in samples) or 1
    with wave.open(os.path.join(OUT, name), 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b''.join(struct.pack('<h', int(s / peak * 0.9 * 32767)) for s in samples))


def whoosh(duration=0.55):
    # Noise through a lowpass whose cutoff rises and falls, with a swelling envelope.
    random.seed(1)
    n = int(RATE * duration)
    out, lp, lp2 = [], 0.0, 0.0
    for i in range(n):
        t = i / n
        cutoff = 200 + 3000 * math.sin(math.pi * t) ** 2
        a = 1 - math.exp(-2 * math.pi * cutoff / RATE)
        lp += a * (random.uniform(-1, 1) - lp)
        lp2 += a * (lp - lp2)
        out.append(lp2 * math.sin(math.pi * t) ** 1.5)
    return out


def pop(duration=0.12):
    # Sine that drops in pitch quickly, like a bubble.
    n = int(RATE * duration)
    out, phase = [], 0.0
    for i in range(n):
        t = i / RATE
        freq = 150 + 650 * math.exp(-t * 40)
        phase += 2 * math.pi * freq / RATE
        out.append(math.sin(phase) * math.exp(-t * 30))
    return out


def impact(duration=0.7):
    # Low boom with a short noise click on top.
    random.seed(2)
    n = int(RATE * duration)
    out, phase = [], 0.0
    for i in range(n):
        t = i / RATE
        freq = 45 + 80 * math.exp(-t * 12)
        phase += 2 * math.pi * freq / RATE
        click = random.uniform(-1, 1) * math.exp(-t * 90) * 0.5
        out.append(math.sin(phase) * math.exp(-t * 5) + click)
    return out


def ding(duration=1.2):
    # Bell-like tone with a few harmonics.
    n = int(RATE * duration)
    out = []
    for i in range(n):
        t = i / RATE
        s = (math.sin(2 * math.pi * 1320 * t)
             + 0.5 * math.sin(2 * math.pi * 2640 * t) * math.exp(-t * 3)
             + 0.3 * math.sin(2 * math.pi * 3960 * t) * math.exp(-t * 6))
        out.append(s * math.exp(-t * 3.5) * min(1, t * 400))
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    write('whoosh.wav', whoosh())
    write('pop.wav', pop())
    write('impact.wav', impact())
    write('ding.wav', ding())
