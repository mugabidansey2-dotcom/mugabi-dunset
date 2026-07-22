// ═══════════════════════════════════════════════════════════════════════════
// INTRO.JS — Dodge Ignition Startup Sequence
// Plays once per browser session (sessionStorage flag)
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // Only run on index page and only once per session
    const isIndex = window.location.pathname.endsWith('index.html') ||
                    window.location.pathname.endsWith('/') ||
                    window.location.pathname === '';

    if (!isIndex) return;
    if (sessionStorage.getItem('intro-done')) return;

    // ── Build the overlay HTML ─────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.innerHTML = `
        <div class="intro-stage">
            <div class="intro-brand" id="intro-brand">DANNY TECH</div>

            <div class="ignition-panel" id="ignition-panel">
                <div class="key-slot" id="key-slot">
                    <span class="key-icon" id="key-icon">🔑</span>
                </div>
                <p class="key-hint" id="key-hint">CLICK TO START</p>
            </div>

            <div class="rpm-gauge" id="rpm-gauge">
                <div class="rpm-label">RPM</div>
                <div class="rpm-track">
                    <div class="rpm-fill" id="rpm-fill"></div>
                </div>
            </div>

            <div class="intro-status" id="intro-status"></div>
        </div>

        <div class="speed-lines" id="speed-lines"></div>
        <div class="intro-flash" id="intro-flash"></div>
        <div class="intro-watermark">EST. 2025 · DANNY TECH</div>
    `;
    document.body.prepend(overlay);

    // ── Audio engine using Web Audio API (no external files needed) ────────
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let ctx;

    function getAudio() {
        if (!ctx) ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // Low rumble / idle engine sound
    function playRumble(duration = 1.5, intensity = 0.3) {
        const audio = getAudio();
        const bufferSize = audio.sampleRate * duration;
        const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * intensity;
        }

        const source = audio.createBufferSource();
        source.buffer = buffer;

        // Low pass — gives that bassy engine rumble
        const filter = audio.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;
        filter.Q.value = 8;

        // Gain envelope
        const gainNode = audio.createGain();
        gainNode.gain.setValueAtTime(0, audio.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.9, audio.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.6, audio.currentTime + duration * 0.7);
        gainNode.gain.linearRampToValueAtTime(0, audio.currentTime + duration);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audio.destination);
        source.start();
        source.stop(audio.currentTime + duration);

        return source;
    }

    // Rev sound — oscillator pitch sweep up
    function playRev(duration = 1.2) {
        const audio = getAudio();

        // Multiple oscillators for a rich rev
        const frequencies = [60, 120, 180, 240];
        frequencies.forEach((freq, i) => {
            const osc = audio.createOscillator();
            const gainNode = audio.createGain();
            const filter = audio.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, audio.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 6, audio.currentTime + duration * 0.7);
            osc.frequency.linearRampToValueAtTime(freq * 2, audio.currentTime + duration);

            filter.type = 'lowpass';
            filter.frequency.value = 800;

            gainNode.gain.setValueAtTime(0, audio.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15 / (i + 1), audio.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.25 / (i + 1), audio.currentTime + duration * 0.5);
            gainNode.gain.linearRampToValueAtTime(0, audio.currentTime + duration);

            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audio.destination);
            osc.start(audio.currentTime);
            osc.stop(audio.currentTime + duration);
        });
    }

    // Click / ignition turn sound
    function playClick() {
        const audio = getAudio();
        const osc = audio.createOscillator();
        const gain = audio.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(80, audio.currentTime);
        osc.frequency.linearRampToValueAtTime(40, audio.currentTime + 0.08);

        gain.gain.setValueAtTime(0.6, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(audio.currentTime);
        osc.stop(audio.currentTime + 0.1);
    }

    // Tyre screech / speed-off whoosh
    function playScreech(duration = 0.8) {
        const audio = getAudio();
        const bufferSize = audio.sampleRate * duration;
        const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const source = audio.createBufferSource();
        source.buffer = buffer;

        const filter = audio.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 2;

        const gain = audio.createGain();
        gain.gain.setValueAtTime(0.4, audio.currentTime);
        gain.gain.linearRampToValueAtTime(0, audio.currentTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audio.destination);
        source.start();
        source.stop(audio.currentTime + duration);
    }

    // ── UI references ──────────────────────────────────────────────────────
    const brand        = document.getElementById('intro-brand');
    const panel        = document.getElementById('ignition-panel');
    const keySlot      = document.getElementById('key-slot');
    const keyIcon      = document.getElementById('key-icon');
    const keyHint      = document.getElementById('key-hint');
    const rpmGauge     = document.getElementById('rpm-gauge');
    const rpmFill      = document.getElementById('rpm-fill');
    const statusEl     = document.getElementById('intro-status');
    const speedLines   = document.getElementById('speed-lines');
    const flash        = document.getElementById('intro-flash');

    function setStatus(text) {
        statusEl.classList.add('show');
        statusEl.textContent = text;
    }

    function setRPM(pct) {
        rpmFill.style.width = pct + '%';
    }

    // ── Step helpers ───────────────────────────────────────────────────────
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Animate RPM smoothly
    function animateRPM(from, to, durationMs) {
        return new Promise(resolve => {
            const steps = 40;
            const interval = durationMs / steps;
            const step = (to - from) / steps;
            let current = from;
            let i = 0;

            const timer = setInterval(() => {
                current += step;
                i++;
                setRPM(Math.min(Math.max(current, 0), 100));
                if (i >= steps) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    }

    // Generate speed lines
    function generateSpeedLines() {
        speedLines.innerHTML = '';
        const count = 40;
        for (let i = 0; i < count; i++) {
            const line = document.createElement('div');
            line.className = 'speed-line';
            const top = Math.random() * 100;
            const width = Math.random() * 40 + 20;
            const delay = Math.random() * 0.3;
            line.style.cssText = `
                top: ${top}vh;
                left: 0;
                width: ${width}vw;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.6 + 0.4};
            `;
            speedLines.appendChild(line);
        }
        speedLines.classList.add('active');
    }

    // ── Main sequence ──────────────────────────────────────────────────────
    let sequenceStarted = false;

    async function startSequence() {
        if (sequenceStarted) return;
        sequenceStarted = true;

        keyHint.classList.add('hidden');
        keyIcon.classList.add('turning');

        // Step 1 — Key turn click
        playClick();
        await wait(300);

        keyIcon.classList.remove('turning');
        keyIcon.classList.add('fully-turned');
        setStatus('IGNITION');
        playClick();
        await wait(200);

        // Step 2 — Engine cranks (stutter)
        setStatus('ENGINE STARTING...');
        rpmGauge.classList.add('show');
        statusEl.classList.add('show');

        for (let i = 0; i < 3; i++) {
            playRumble(0.3, 0.2 + i * 0.1);
            keySlot.classList.add('firing');
            document.querySelector('.intro-stage').classList.add('shaking');
            await animateRPM(0, 20 + i * 15, 200);
            await animateRPM(20 + i * 15, 5, 150);
            await wait(100);
        }

        // Step 3 — Engine catches
        document.querySelector('.intro-stage').classList.remove('shaking');
        setStatus('ENGINE RUNNING');
        playRumble(1.2, 0.4);
        await animateRPM(5, 35, 400);
        await wait(400);

        // Step 4 — REV IT
        setStatus('REVVING...');
        document.querySelector('.intro-stage').classList.add('shaking');
        playRev(1.4);
        await animateRPM(35, 100, 700);
        await wait(200);

        // Step 5 — LAUNCH
        setStatus('LAUNCHING');
        playScreech(0.8);
        generateSpeedLines();

        await wait(100);
        flash.classList.add('fire');
        await wait(150);
        flash.classList.remove('fire');
        await wait(100);
        flash.classList.add('fire');

        await wait(300);

        // Step 6 — Exit
        overlay.style.opacity = '0';
        await wait(600);
        overlay.style.display = 'none';
        document.querySelector('.intro-stage').classList.remove('shaking');

        sessionStorage.setItem('intro-done', '1');
    }

    // ── Boot sequence (show brand, then panel) ─────────────────────────────
    document.addEventListener('DOMContentLoaded', async () => {
        // Brief pause then show brand
        await wait(300);
        brand.classList.add('show');
        await wait(700);
        panel.classList.add('show');

        // Key icon is clickable
        keyIcon.addEventListener('click', startSequence);
        keySlot.addEventListener('click', startSequence);

        // Also allow spacebar / enter
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                startSequence();
            }
        });
    });

})();
