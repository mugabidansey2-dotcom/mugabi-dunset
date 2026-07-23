// ═══════════════════════════════════════════════════════════════════════════
// SUPERPOWERS.JS — Ultra-smooth, performant effects for the portfolio
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ── 1. PARTICLE + SPIDER WEB CANVAS BACKGROUND ───────────────────────────
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let webs = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initWebs();
            initParticleSet();
        });

        // ── Spider Web ────────────────────────────────────────────────────────
        class SpiderWeb {
            constructor() {
                this.reset();
            }

            reset() {
                // Anchor point — scattered across the canvas
                this.cx = Math.random() * canvas.width;
                this.cy = Math.random() * canvas.height;

                // Web dimensions — varied sizes
                this.spokes = Math.floor(Math.random() * 4) + 6;   // 6–9 spokes
                this.rings  = Math.floor(Math.random() * 3) + 3;   // 3–5 rings
                this.maxRadius = Math.random() * 140 + 80;         // 80–220px

                // Slow drift
                this.vx = (Math.random() - 0.5) * 0.18;
                this.vy = (Math.random() - 0.5) * 0.18;

                // Breathing — each web slowly pulses in size
                this.breathPhase  = Math.random() * Math.PI * 2;
                this.breathSpeed  = 0.004 + Math.random() * 0.004;
                this.breathAmount = 0.08 + Math.random() * 0.1;    // ±8–18%

                // Slow rotation
                this.angle        = Math.random() * Math.PI * 2;
                this.rotSpeed     = (Math.random() - 0.5) * 0.0008;

                // Slight asymmetry — spoke length multipliers give organic feel
                this.spokeLengths = Array.from({ length: this.spokes },
                    () => 0.75 + Math.random() * 0.5);
            }

            update() {
                this.cx += this.vx;
                this.cy += this.vy;
                this.angle += this.rotSpeed;
                this.breathPhase += this.breathSpeed;

                // Wrap when fully off-screen
                const pad = this.maxRadius * 1.5;
                if (this.cx < -pad) this.cx = canvas.width + pad;
                if (this.cx > canvas.width + pad) this.cx = -pad;
                if (this.cy < -pad) this.cy = canvas.height + pad;
                if (this.cy > canvas.height + pad) this.cy = -pad;
            }

            draw() {
                const breathScale = 1 + Math.sin(this.breathPhase) * this.breathAmount;
                const r = this.maxRadius * breathScale;

                ctx.save();
                ctx.translate(this.cx, this.cy);
                ctx.rotate(this.angle);
                ctx.globalAlpha = 0.32;
                ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
                ctx.lineWidth = 0.6;

                // ── Draw spokes ──────────────────────────────────────────────
                const spokeAngle = (Math.PI * 2) / this.spokes;
                const spokeEndPoints = [];

                for (let i = 0; i < this.spokes; i++) {
                    const a = spokeAngle * i;
                    const len = r * this.spokeLengths[i];
                    const ex = Math.cos(a) * len;
                    const ey = Math.sin(a) * len;

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();

                    spokeEndPoints.push({ x: ex, y: ey, len });
                }

                // ── Draw concentric rings (connected between spokes) ─────────
                for (let ring = 1; ring <= this.rings; ring++) {
                    const t = ring / this.rings;
                    ctx.beginPath();

                    for (let i = 0; i <= this.spokes; i++) {
                        const idx = i % this.spokes;
                        const a = spokeAngle * idx;
                        const len = r * this.spokeLengths[idx] * t;
                        const x = Math.cos(a) * len;
                        const y = Math.sin(a) * len;

                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            // Slight curve between points for organic feel
                            const prevIdx = (i - 1) % this.spokes;
                            const pA = spokeAngle * prevIdx;
                            const pLen = r * this.spokeLengths[prevIdx] * t;
                            const cpx = Math.cos((a + pA) / 2) * len * 1.08;
                            const cpy = Math.sin((a + pA) / 2) * len * 1.08;
                            ctx.quadraticCurveTo(cpx, cpy, x, y);
                        }
                    }
                    ctx.stroke();
                }

                ctx.globalAlpha = 1;
                ctx.restore();
            }
        }

        // ── Particles ─────────────────────────────────────────────────────────
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.35 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius && mouse.x !== null) {
                    const forceX = dx / distance;
                    const forceY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= forceX * force * 3;
                    this.y -= forceY * force * 3;
                }

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initWebs() {
            webs = [];
            // One web per ~120k px of screen area, capped at 8
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 120000) + 3, 8);
            for (let i = 0; i < count; i++) {
                webs.push(new SpiderWeb());
            }
        }

        function initParticleSet() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            // Batch into opacity buckets to minimise ctx state changes
            const lines = [];
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = dx * dx + dy * dy; // skip sqrt for comparison
                    if (dist < 8100) { // 90^2
                        const opacity = (1 - Math.sqrt(dist) / 90) * 0.15;
                        lines.push({ ax: particles[a].x, ay: particles[a].y,
                                     bx: particles[b].x, by: particles[b].y, opacity });
                    }
                }
            }
            // Sort by opacity so we can batch same-opacity lines
            lines.sort((a, b) => a.opacity - b.opacity);
            let lastOp = -1;
            ctx.lineWidth = 0.5;
            lines.forEach(l => {
                if (Math.abs(l.opacity - lastOp) > 0.01) {
                    if (lastOp >= 0) ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,${l.opacity.toFixed(2)})`;
                    lastOp = l.opacity;
                }
                ctx.moveTo(l.ax, l.ay);
                ctx.lineTo(l.bx, l.by);
            });
            if (lastOp >= 0) ctx.stroke();
        }

        // ── Pause when tab is hidden to save CPU ──────────────────────────
        let paused = false;
        document.addEventListener('visibilitychange', () => {
            paused = document.hidden;
            if (!paused) requestAnimationFrame(animate);
        });

        function animate() {
            if (paused) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            webs.forEach(w => { w.update(); w.draw(); });
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        initWebs();
        initParticleSet();
        animate();
    }

    // ── 2. GLOWING CURSOR TRAIL ───────────────────────────────────────────────
    function initCursorGlow() {
        const cursor = document.getElementById('cursor-glow');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ── 3. MAGNETIC BUTTONS ───────────────────────────────────────────────────
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn, .link-btn, .work-card, .project-card');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });

            btn.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.15;
                const moveY = y * 0.15;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    // ── 4. 3D TILT EFFECT ON CARDS ────────────────────────────────────────────
    function init3DTilt() {
        const cards = document.querySelectorAll('.work-card, .project-card, .skill-item, .about-section-card, .contact-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // ── 5. SCROLL PROGRESS BAR ────────────────────────────────────────────────
    function initScrollProgress() {
        const progress = document.getElementById('scroll-progress');
        if (!progress) return;

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progress.style.width = scrolled + '%';
        });
    }

    // ── 6. BACK TO TOP BUTTON ─────────────────────────────────────────────────
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── 7. TEXT SCRAMBLE EFFECT ───────────────────────────────────────────────
    function scrambleText(element) {
        const originalText = element.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let iteration = 0;

        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            iteration += 1 / 3;

            if (iteration >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 30);
    }

    function initTextScramble() {
        const targets = document.querySelectorAll('[data-scramble]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrambleText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        targets.forEach(el => observer.observe(el));
    }

    // ── 8. PARALLAX SCROLL EFFECT ─────────────────────────────────────────────
    function initParallax() {
        const elements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            elements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const offset = scrolled * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        });
    }

    // ── 9. LOADING SCREEN ─────────────────────────────────────────────────────
    function initLoadingScreen() {
        const loader = document.getElementById('loading-screen');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800);
        });
    }

    // ── 10. NEON GLOW ON HEADINGS ─────────────────────────────────────────────
    function initNeonGlow() {
        const style = document.createElement('style');
        style.textContent = `
            h1, h2, h3, .hero-content h2 {
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.4),
                             0 0 20px rgba(255, 255, 255, 0.15),
                             0 0 40px rgba(255, 255, 255, 0.08);
            }
            .btn, .link-btn {
                box-shadow: 0 0 12px rgba(255, 255, 255, 0.3),
                           0 4px 12px rgba(255, 255, 255, 0.1);
                transition: box-shadow 0.3s ease, transform 0.3s ease;
            }
            .btn:hover, .link-btn:hover {
                box-shadow: 0 0 22px rgba(255, 255, 255, 0.55),
                           0 8px 20px rgba(255, 255, 255, 0.25);
            }
        `;
        document.head.appendChild(style);
    }
    // ── 11. PAGE TRANSITION — Range Rover loader ──────────────────────────────
    function initPageTransitions() {
        const overlay = document.getElementById('rr-transition');
        if (!overlay) return;

        const car      = overlay.querySelector('.rr-car');
        const road     = overlay.querySelector('.rr-road-line');
        const label    = overlay.querySelector('.rr-label');

        // ── Fade overlay out on arrival ───────────────────────────────────────
        function hideOverlay() {
            // Drive off to the right then fade
            car.style.transition  = 'transform 0.55s cubic-bezier(0.55, 0, 1, 0.45)';
            car.style.transform   = 'translateX(120vw)';
            setTimeout(() => {
                overlay.classList.remove('rr-active');
                car.style.transition = '';
                car.style.transform  = 'translateX(-120vw)'; // reset for next use
            }, 560);
        }

        // ── Drive in, pause, then navigate ───────────────────────────────────
        function driveAndGo(href) {
            // Show overlay
            overlay.classList.add('rr-active');
            car.style.transition = '';
            car.style.transform  = 'translateX(-120vw)';

            // Small tick so browser paints the reset position first
            requestAnimationFrame(() => requestAnimationFrame(() => {
                // Drive to centre
                car.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                car.style.transform  = 'translateX(-10vw)';

                setTimeout(() => {
                    // Brief idle at centre — wheels still spinning via CSS
                    setTimeout(() => {
                        // Floor it — speed off to destination
                        car.style.transition = 'transform 0.45s cubic-bezier(0.55, 0, 1, 0.45)';
                        car.style.transform  = 'translateX(120vw)';
                        setTimeout(() => {
                            window.location.href = href;
                        }, 440);
                    }, 350);
                }, 720);
            }));
        }

        // ── Intercept internal nav links ──────────────────────────────────────
        document.querySelectorAll(
            'a[href^="index.html"], a[href^="about.html"], a[href^="projects.html"], a[href^="contact.html"]'
        ).forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                driveAndGo(link.getAttribute('href'));
            });
        });

        // ── Hide on arrival (new page load) ──────────────────────────────────
        window.addEventListener('load', () => {
            overlay.classList.add('rr-active');
            car.style.transform = 'translateX(-10vw)';
            setTimeout(hideOverlay, 200);
        });
    }    }

    // ── INIT ALL SUPERPOWERS ──────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initParticles();
        initCursorGlow();
        initMagneticButtons();
        init3DTilt();
        initScrollProgress();
        initBackToTop();
        initTextScramble();
        initParallax();
        initLoadingScreen();
        initNeonGlow();
        initPageTransitions();
    });

})();
