// ═══════════════════════════════════════════════════════════════════════════
// SUPERPOWERS.JS — Ultra-smooth, performant effects for the portfolio
// ═══════════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ── 1. PARTICLE CANVAS BACKGROUND ─────────────────────────────────────────
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = `rgba(56, 189, 248, ${Math.random() * 0.5 + 0.2})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
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

                // Wrap around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 120);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.3;
                        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY + window.scrollY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        init();
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
    // ── 11. PAGE TRANSITION ───────────────────────────────────────────────────
    function initPageTransitions() {
        const overlay = document.getElementById('page-transition');
        if (!overlay) return;

        // Fade out on page load
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 500);
        }, 300);

        // Intercept internal links
        document.querySelectorAll('a[href^="index.html"], a[href^="about.html"], a[href^="projects.html"], a[href^="contact.html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                overlay.style.display = 'block';
                overlay.style.opacity = '1';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        });
    }

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
