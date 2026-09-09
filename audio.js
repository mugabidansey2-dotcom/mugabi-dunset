// ═══════════════════════════════════════════════════════════════════════════
// AUDIO.JS — Voice greeting + water ambient background
// Uses Web Audio API — no external files needed
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    let audioCtx = null;
    let waterNode = null;
    let waterGain = null;
    let isMuted = false;
    let started = false;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    // ── Water flowing ambient sound ───────────────────────────────────────────
    function startWater() {
        const ctx = getCtx();

        // White noise buffer — 3 seconds, looped
        const bufLen = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(2, bufLen, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const data = buffer.getChannelData(ch);
            for (let i = 0; i < bufLen; i++) {
                data[i] = (Math.random() * 2 - 1);
            }
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // ── Filter chain to shape noise into flowing water ────────────────────
        // Low-pass to remove harsh highs
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1400;
        lowpass.Q.value = 0.8;

        // Band-pass to add that bubbly mid-frequency water character
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 600;
        bandpass.Q.value = 0.6;

        // Second lowpass for smoothness
        const lowpass2 = ctx.createBiquadFilter();
        lowpass2.type = 'lowpass';
        lowpass2.frequency.value = 800;
        lowpass2.Q.value = 1.2;

        // Slow LFO to make the water "flow" and ripple
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.18; // very slow ripple
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 180;
        lfo.connect(lfoGain);
        lfoGain.connect(bandpass.frequency);
        lfo.start();

        // Second LFO for subtle volume swell
        const lfo2 = ctx.createOscillator();
        lfo2.type = 'sine';
        lfo2.frequency.value = 0.08;
        const lfoGain2 = ctx.createGain();
        lfoGain2.gain.value = 0.12;
        lfo2.connect(lfoGain2);

        waterGain = ctx.createGain();
        waterGain.gain.value = 0; // start silent, fade in
        lfoGain2.connect(waterGain.gain);
        lfo2.start();

        source.connect(lowpass);
        lowpass.connect(bandpass);
        bandpass.connect(lowpass2);
        lowpass2.connect(waterGain);
        waterGain.connect(ctx.destination);
        source.start();

        waterNode = source;

        // Fade in gently over 3 seconds
        waterGain.gain.setValueAtTime(0, ctx.currentTime);
        waterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3);
    }

    // ── Voice greeting using SpeechSynthesis ─────────────────────────────────
    function speakGreeting() {
        if (!window.speechSynthesis) return;

        const utter = new SpeechSynthesisUtterance(
            "Hello, I am Danny. Welcome to my portfolio."
        );
        utter.rate   = 0.92;
        utter.pitch  = 1.05;
        utter.volume = 1.0;

        // Try to pick a natural English voice
        function speak() {
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v =>
                v.lang.startsWith('en') && (
                    v.name.includes('Google') ||
                    v.name.includes('Natural') ||
                    v.name.includes('Premium') ||
                    v.name.includes('Daniel') ||
                    v.name.includes('David') ||
                    v.name.includes('James')
                )
            ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

            if (preferred) utter.voice = preferred;
            window.speechSynthesis.speak(utter);
        }

        // Voices may not be loaded yet
        if (window.speechSynthesis.getVoices().length) {
            speak();
        } else {
            window.speechSynthesis.onvoiceschanged = speak;
        }
    }

    // ── Mute / unmute toggle ──────────────────────────────────────────────────
    function setMute(mute) {
        isMuted = mute;
        if (waterGain && audioCtx) {
            const now = audioCtx.currentTime;
            if (mute) {
                waterGain.gain.linearRampToValueAtTime(0, now + 0.5);
            } else {
                waterGain.gain.linearRampToValueAtTime(0.18, now + 0.5);
            }
        }
        const btn = document.getElementById('audio-toggle-btn');
        if (btn) {
            btn.innerHTML = mute ? '🔇' : '🔊';
            btn.title = mute ? 'Unmute ambient sound' : 'Mute ambient sound';
        }
        localStorage.setItem('danny-muted', mute ? '1' : '0');
    }

    // ── Build mute button UI ──────────────────────────────────────────────────
    function buildButton() {
        const style = document.createElement('style');
        style.textContent = `
            #audio-toggle-btn {
                position: fixed;
                bottom: 2rem;
                right: 5rem;
                width: 42px;
                height: 42px;
                border-radius: 50%;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                font-size: 1.1rem;
                cursor: pointer;
                z-index: 9990;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease, transform 0.2s ease;
                box-shadow: 0 2px 12px rgba(0,0,0,0.3);
            }
            #audio-toggle-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
            @media (max-width: 480px) {
                #audio-toggle-btn { bottom: 1.2rem; right: 4rem; width: 36px; height: 36px; font-size: 1rem; }
            }
        `;
        document.head.appendChild(style);

        const btn = document.createElement('button');
        btn.id = 'audio-toggle-btn';
        btn.innerHTML = '🔊';
        btn.title = 'Mute ambient sound';
        btn.setAttribute('aria-label', 'Toggle ambient sound');
        btn.addEventListener('click', () => setMute(!isMuted));
        document.body.appendChild(btn);
    }

    // ── Init — triggered by first user interaction ────────────────────────────
    function initAudio() {
        if (started) return;
        started = true;

        startWater();

        // Only speak greeting on the home page
        const isHome = window.location.pathname.endsWith('index.html') ||
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname === '';
        if (isHome) {
            setTimeout(speakGreeting, 800);
        }

        // Restore mute preference
        if (localStorage.getItem('danny-muted') === '1') {
            setTimeout(() => setMute(true), 200);
        }
    }

    // ── Wait for first click/touch to comply with browser autoplay policy ─────
    document.addEventListener('DOMContentLoaded', () => {
        buildButton();

        // Try to start immediately (works if page was navigated to)
        setTimeout(() => {
            try { initAudio(); } catch(e) {}
        }, 500);

        // Fallback — first user interaction
        const startOnInteraction = () => {
            initAudio();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (!audioCtx) return;
        if (document.hidden) {
            audioCtx.suspend();
        } else {
            audioCtx.resume();
        }
    });

})();
