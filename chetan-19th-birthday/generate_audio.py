import wave
import math
import struct
import random

SAMPLE_RATE = 44100

def note_freq(name):
    # Equal temperament frequencies
    notes = {
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
        'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
        'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
    }
    return notes.get(name, 440.0)

def generate_tone(freq, duration, instrument='music_box'):
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        if instrument == 'music_box':
            # Bell/music box: fundamental + shimmer harmonics + decay envelope
            env = math.exp(-3.5 * t / duration)
            sig = (math.sin(2 * math.pi * freq * t) * 0.5 +
                   math.sin(2 * math.pi * freq * 2.0 * t) * 0.25 +
                   math.sin(2 * math.pi * freq * 3.0 * t) * 0.12 +
                   math.sin(2 * math.pi * freq * 4.0 * t) * 0.08)
            val = sig * env
        elif instrument == 'bass':
            # Warm acoustic/synth bass
            env = math.exp(-2.0 * t / duration)
            sig = (math.sin(2 * math.pi * freq * t) * 0.6 +
                   math.sin(2 * math.pi * freq * 2.0 * t) * 0.3)
            val = sig * env
        elif instrument == 'pad':
            # Soft warm chord pad
            # Attack and release envelope
            attack = 0.08
            release = 0.15
            if t < attack:
                env = t / attack
            elif t > duration - release:
                env = (duration - t) / release
            else:
                env = 1.0
            sig = (math.sin(2 * math.pi * freq * t) * 0.4 +
                   math.sin(2 * math.pi * (freq * 1.002) * t) * 0.3 +
                   math.sin(2 * math.pi * freq * 0.5 * t) * 0.2)
            val = sig * env * 0.5
        samples.append(val)
    return samples

def write_wav(filename, samples):
    # Normalize
    max_val = max(abs(s) for s in samples) or 1.0
    scale = 32760 / max_val * 0.92
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(2)  # Stereo
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        
        # Add subtle stereo pan effect
        for i, sample in enumerate(samples):
            t = i / SAMPLE_RATE
            pan = 0.5 + 0.15 * math.sin(2 * math.pi * 0.4 * t)
            left = int(sample * scale * (1 - pan))
            right = int(sample * scale * pan)
            left = max(-32767, min(32767, left))
            right = max(-32767, min(32767, right))
            wav_file.writeframes(struct.pack('<hh', left, right))

# Happy Birthday Song Composition in G Major (upbeat, joyous tempo 120 bpm)
# Beat = 0.5s, dotted = 0.75s, quarter = 0.5s, half = 1.0s, dotted half = 1.5s
BPM = 126
BEAT = 60.0 / BPM  # ~0.476 sec

melody_notes = [
    # Bar 1: Hap-py birth-day to you
    ('D4', 0.75 * BEAT), ('D4', 0.25 * BEAT), ('E4', 1.0 * BEAT), ('D4', 1.0 * BEAT), ('G4', 1.0 * BEAT), ('F#4', 2.0 * BEAT),
    # Bar 2: Hap-py birth-day to you
    ('D4', 0.75 * BEAT), ('D4', 0.25 * BEAT), ('E4', 1.0 * BEAT), ('D4', 1.0 * BEAT), ('A4', 1.0 * BEAT), ('G4', 2.0 * BEAT),
    # Bar 3: Hap-py birth-day dear Chetan
    ('D4', 0.75 * BEAT), ('D4', 0.25 * BEAT), ('D5', 1.0 * BEAT), ('B4', 1.0 * BEAT), ('G4', 1.0 * BEAT), ('F#4', 1.0 * BEAT), ('E4', 1.5 * BEAT),
    # Bar 4: Hap-py birth-day to you!
    ('C5', 0.75 * BEAT), ('C5', 0.25 * BEAT), ('B4', 1.0 * BEAT), ('G4', 1.0 * BEAT), ('A4', 1.0 * BEAT), ('G4', 2.5 * BEAT),
]

# Chords progression (G, D, G, D, G, C, G-D-G)
chords = [
    (['G3', 'B3', 'D4'], 3.0 * BEAT),
    (['D3', 'F#3', 'A3'], 3.0 * BEAT),
    (['D3', 'F#3', 'A3'], 3.0 * BEAT),
    (['G3', 'B3', 'D4'], 3.0 * BEAT),
    (['G3', 'B3', 'D4'], 3.0 * BEAT),
    (['C4', 'E4', 'G4'], 3.0 * BEAT),
    (['G3', 'B3', 'D4'], 1.5 * BEAT),
    (['D3', 'F#3', 'A3'], 1.5 * BEAT),
    (['G3', 'B3', 'D4'], 3.0 * BEAT),
]

def render_song():
    total_duration = sum(dur for _, dur in melody_notes) + 1.0
    total_samples = int(SAMPLE_RATE * total_duration)
    buffer = [0.0] * total_samples
    
    # Layer 1: Melody (Music box / Celesta bell tone)
    cursor = 0
    for note, dur in melody_notes:
        freq = note_freq(note)
        samples = generate_tone(freq, dur * 1.15, 'music_box')
        # Also octave sparkle
        sparkle = generate_tone(freq * 2, dur * 1.15, 'music_box')
        for i in range(len(samples)):
            idx = cursor + i
            if idx < total_samples:
                spk = sparkle[i] if i < len(sparkle) else 0.0
                buffer[idx] += samples[i] * 0.75 + spk * 0.25
        cursor += int(SAMPLE_RATE * dur)
        
    # Layer 2: Chords & Bass
    chord_cursor = 0
    for note_list, dur in chords:
        for chord_note in note_list:
            freq = note_freq(chord_note)
            pad_s = generate_tone(freq, dur * 1.05, 'pad')
            for i in range(len(pad_s)):
                idx = chord_cursor + i
                if idx < total_samples:
                    buffer[idx] += pad_s[i] * 0.35
        # Bass root note
        root_freq = note_freq(note_list[0]) / 2.0
        bass_s = generate_tone(root_freq, dur * 0.95, 'bass')
        for i in range(len(bass_s)):
            idx = chord_cursor + i
            if idx < total_samples:
                buffer[idx] += bass_s[i] * 0.4
        chord_cursor += int(SAMPLE_RATE * dur)
        
    return buffer

def generate_sfx():
    # 1. Pop sound (balloon pop)
    pop_dur = 0.12
    n_pop = int(SAMPLE_RATE * pop_dur)
    pop_samples = []
    for i in range(n_pop):
        t = i / SAMPLE_RATE
        env = math.exp(-35.0 * t)
        noise = (random.random() * 2 - 1) * 0.7
        thump = math.sin(2 * math.pi * (160 - 120 * (t / pop_dur)) * t) * 0.8
        pop_samples.append((noise + thump) * env)
    write_wav('C:/Users/gsant/.gemini/antigravity/scratch/chetan-19th-birthday/assets/audio/pop.wav', pop_samples)
    
    # 2. Sparkle / chime sound
    chime_dur = 0.8
    n_chime = int(SAMPLE_RATE * chime_dur)
    chime_samples = [0.0] * n_chime
    chime_notes = [note_freq('E5'), note_freq('G5'), note_freq('B5'), note_freq('E6'), note_freq('G6')]
    for step, freq in enumerate(chime_notes):
        offset = int(SAMPLE_RATE * (step * 0.08))
        tone = generate_tone(freq, chime_dur - (step * 0.08), 'music_box')
        for i in range(len(tone)):
            idx = offset + i
            if idx < n_chime:
                chime_samples[idx] += tone[i] * 0.4
    write_wav('C:/Users/gsant/.gemini/antigravity/scratch/chetan-19th-birthday/assets/audio/sparkle.wav', chime_samples)

    # 3. Cheer / festive fanfare whoosh
    cheer_dur = 2.0
    n_cheer = int(SAMPLE_RATE * cheer_dur)
    cheer_samples = [0.0] * n_cheer
    for i in range(n_cheer):
        t = i / SAMPLE_RATE
        env = math.sin(math.pi * min(1.0, t / 0.5)) * math.exp(-1.5 * max(0.0, t - 0.5))
        # applause-like filtered noise + harmonic resonance
        noise = (random.random() * 2 - 1) * 0.4
        shimmer = math.sin(2 * math.pi * 880 * t) * 0.15 + math.sin(2 * math.pi * 1320 * t) * 0.1
        cheer_samples[i] = (noise + shimmer) * env
    write_wav('C:/Users/gsant/.gemini/antigravity/scratch/chetan-19th-birthday/assets/audio/cheer.wav', cheer_samples)

if __name__ == '__main__':
    print("Generating Happy Birthday song...")
    song = render_song()
    # Repeat song 2 times for a complete smooth loop
    song_loop = song + song
    write_wav('C:/Users/gsant/.gemini/antigravity/scratch/chetan-19th-birthday/assets/audio/happy_birthday.wav', song_loop)
    print("Generating SFX...")
    generate_sfx()
    print("All audio generated successfully!")
