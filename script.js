document.addEventListener("DOMContentLoaded", () => {
    // 1. Remove loading class to allow transitions
    document.body.classList.remove('loading');
    
    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactables = document.querySelectorAll('a, button, input, textarea, .interactable');

    // Check if device supports hover
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hovered');
            });
        });
    }

    // 3. Sticky Navbar & Background Blur on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('ri-menu-4-line');
                icon.classList.add('ri-close-line');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-4-line');
                document.body.style.overflow = '';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-4-line');
                document.body.style.overflow = '';
            });
        });
    }

    // 5. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If it's a stats counter, trigger counter animation
                const counter = entry.target.querySelector('.count-up') || (entry.target.classList.contains('count-up') ? entry.target : null);
                if (counter && !counter.classList.contains('counted')) {
                    startCounter(counter);
                    counter.classList.add('counted');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');
    revealElements.forEach(el => observer.observe(el));

    // 6. Number Counter Animation
    function startCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (target === 0) { el.innerText = "0"; return; }
        
        const duration = 2000;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        let frame = 0;
        
        // Easing function for smooth deceleration
        function easeOutExpo(x) {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        }

        const timer = setInterval(() => {
            frame++;
            const progress = easeOutExpo(frame / totalFrames);
            const current = Math.round(target * progress);
            
            el.innerText = current;
            
            if (frame >= totalFrames) {
                el.innerText = target;
                clearInterval(timer);
            }
        }, 1000 / fps);
    }
});
