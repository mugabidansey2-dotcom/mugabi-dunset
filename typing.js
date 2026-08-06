// ═══════════════════════════════════════════════════════════════════════════
// TYPING.JS — Typewriter effect with keystroke sound on page titles
// Targets any element with [data-type-title] attribute
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── Web Audio keystroke sound (no external files needed) ─────────────────
    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function playKeystroke() {
        try {
            const ctx  = getAudioCtx();
            const now  = ctx.currentTime;

            // Short noise burst — mechanical key click feel
            const bufLen = Math.floor(ctx.sampleRate * 0.04);
            const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            const data   = buffer.getChannelData(0);
            for (let i = 0; i < bufLen; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;

            // Band-pass filter gives it a crisp "click" character
            const filter = ctx.createBiquadFilter();
            filter.type            = 'bandpass';
            filter.frequency.value = 1800;
            filter.Q.value         = 1.2;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            source.start(now);
            source.stop(now + 0.05);
        } catch (e) {
            // Audio not available — silently continue
        }
    }

    // ── Typewriter core ───────────────────────────────────────────────────────
    function typeTitle(el) {
        const fullText  = el.getAttribute('data-type-title') || el.textContent;
        const speed     = 55; // ms per character

        // Clear the element and add a blinking cursor span
        el.textContent = '';
        el.style.visibility = 'visible';

        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.textContent = '|';
        el.appendChild(cursor);

        let i = 0;

        function typeNext() {
            if (i < fullText.length) {
                // Insert character before the cursor
                el.insertBefore(document.createTextNode(fullText[i]), cursor);
                playKeystroke();
                i++;
                setTimeout(typeNext, speed + Math.random() * 30); // slight jitter = natural feel
            } else {
                // Typing done — keep cursor blinking for 2s then fade it out
                setTimeout(() => {
                    cursor.style.transition = 'opacity 0.5s ease';
                    cursor.style.opacity    = '0';
                    setTimeout(() => cursor.remove(), 600);
                }, 2000);
            }
        }

        // Small delay so the page has settled before typing starts
        setTimeout(typeNext, 300);
    }

    // ── Init — run on DOMContentLoaded ────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        const targets = document.querySelectorAll('[data-type-title]');
        if (!targets.length) return;

        targets.forEach((el, idx) => {
            // Hide text initially so the empty element doesn't flash
            el.style.visibility = 'hidden';

            // Stagger multiple titles if more than one on the page
            setTimeout(() => typeTitle(el), idx * 400);
        });
    });

})();
