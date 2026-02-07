/* ============================================
   ARJUN NARGOLWALA — PORTFOLIO JS
   Particle system, typing effect, scroll reveals
   ============================================ */

(function () {
    'use strict';

    // ─── Particle Canvas Background ─────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        let animationId;

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        canvas.addEventListener('mousemove', function (e) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction — gentle repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        this.x += (dx / dist) * force * 1.5;
                        this.y += (dy / dist) * force * 1.5;
                    }
                }

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(129, 140, 248, ' + this.opacity + ')';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Scale particle count based on screen size
            const area = canvas.width * canvas.height;
            const count = Math.min(Math.floor(area / 8000), 150);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        const opacity = (1 - dist / 140) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(129, 140, 248, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function (p) {
                p.update();
                p.draw();
            });

            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        initParticles();
        animate();

        // Reinitialize on resize
        window.addEventListener('resize', function () {
            cancelAnimationFrame(animationId);
            initParticles();
            animate();
        });
    }

    // ─── Typing Effect ──────────────────────────────────────────
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const phrases = [
            'Building AI-native enterprise software.',
            'Designing quantitative trading systems.',
            'Researching large-scale ML architectures.',
            'Exploring quantum computing paradigms.',
            'Penn M&T — Engineering + Wharton.'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
            const current = phrases[phraseIndex];

            if (isPaused) {
                isPaused = false;
                isDeleting = true;
                setTimeout(type, 50);
                return;
            }

            if (!isDeleting) {
                typingElement.textContent = current.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    isPaused = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 55 + Math.random() * 30);
            } else {
                typingElement.textContent = current.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 25);
            }
        }

        // Start typing after hero animation completes
        setTimeout(type, 1200);
    }

    // ─── Scroll Reveal (Intersection Observer) ──────────────────
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry, index) {
                    if (entry.isIntersecting) {
                        // Stagger the reveal for sibling elements
                        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                        let delay = 0;
                        siblings.forEach(function (sibling) {
                            if (sibling === entry.target) return;
                            if (sibling.classList.contains('visible')) return;
                        });

                        // Find index among siblings for stagger
                        const allSiblings = Array.from(
                            entry.target.parentElement.querySelectorAll('.reveal')
                        );
                        const siblingIndex = allSiblings.indexOf(entry.target);
                        delay = siblingIndex * 100;

                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, delay);

                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    // ─── Navbar: Hide on Scroll Down, Show on Scroll Up ─────────
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ─── Mobile Nav Toggle ──────────────────────────────────────
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ─── Smooth Scroll for Anchor Links ─────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Scroll indicator fade out ──────────────────────────────
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.4s ease';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
})();
