(function () {
    'use strict';

    var statusEl = document.getElementById('status-section');
    var sections = document.querySelectorAll('.section');
    var panelNavLinks = document.querySelectorAll('.panel-nav a[data-section]');
    var mobileNavLinks = document.querySelectorAll('.nav-links a[data-section]');
    var sectionIds = ['about', 'experience', 'research', 'projects', 'blog', 'contact'];
    var currentIndex = 0;

    // ─── Typewriter Effect on Hero Name ──────────────────────────
    var heroName = document.getElementById('hero-name');
    if (heroName) {
        var fullName = 'Arjun Nargolwala';
        var i = 0;
        function typeName() {
            if (i <= fullName.length) {
                heroName.textContent = fullName.substring(0, i);
                i++;
                setTimeout(typeName, 70);
            }
        }
        setTimeout(typeName, 400);
    }

    // ─── Navigate to Section ─────────────────────────────────────
    function navigateTo(sectionId) {
        var newIndex = sectionIds.indexOf(sectionId);
        if (newIndex === -1 || newIndex === currentIndex) return;

        // Command echo in status bar
        if (statusEl) {
            statusEl.textContent = '> cd ' + sectionId;
            statusEl.classList.add('typing');

            setTimeout(function () {
                statusEl.textContent = '~/arjun/' + sectionId;
                statusEl.classList.remove('typing');
            }, 400);
        }

        // Fade out current section
        var currentSection = document.getElementById(sectionIds[currentIndex]);
        if (currentSection) {
            currentSection.classList.remove('visible');
            setTimeout(function () {
                currentSection.classList.remove('active');

                // Show + fade in new section
                var newSection = document.getElementById(sectionId);
                if (newSection) {
                    // Scroll panel-right to top
                    var panelRight = document.querySelector('.panel-right');
                    if (panelRight) panelRight.scrollTop = 0;

                    newSection.classList.add('active');
                    // Force reflow so transition fires
                    void newSection.offsetHeight;
                    newSection.classList.add('visible');
                }
            }, 200);
        }

        // Update nav active state
        panelNavLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
        });

        currentIndex = newIndex;
    }

    // ─── Initialize First Section ────────────────────────────────
    var firstSection = document.getElementById(sectionIds[0]);
    if (firstSection) {
        firstSection.classList.add('active');
        // Small delay so initial load animates in
        setTimeout(function () {
            firstSection.classList.add('visible');
        }, 100);
    }

    if (statusEl) {
        statusEl.textContent = '~/arjun/' + sectionIds[0];
    }

    // ─── Panel Nav Click Handlers ────────────────────────────────
    panelNavLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    // ─── Mobile Nav Click Handlers ───────────────────────────────
    var navToggle = document.querySelector('.nav-toggle');
    var mobileLinksContainer = document.querySelector('.nav-links');

    mobileNavLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);

            // Close mobile menu
            if (navToggle && mobileLinksContainer) {
                navToggle.classList.remove('active');
                mobileLinksContainer.classList.remove('open');
            }
        });
    });

    if (navToggle && mobileLinksContainer) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            mobileLinksContainer.classList.toggle('open');
        });
    }

    // ─── Keyboard Navigation ─────────────────────────────────────
    document.addEventListener('keydown', function (e) {
        // Don't capture if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Number keys 1-5
        var num = parseInt(e.key);
        if (num >= 1 && num <= sectionIds.length) {
            navigateTo(sectionIds[num - 1]);
            return;
        }

        // j = next, k = prev
        if (e.key === 'j' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < sectionIds.length - 1) {
                navigateTo(sectionIds[currentIndex + 1]);
            }
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                navigateTo(sectionIds[currentIndex - 1]);
            }
        }
    });
})();
