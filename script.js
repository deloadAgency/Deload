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

    // 7. Magnetic Buttons
    const magnetically = document.querySelectorAll('.magnetic');
    
    // Only apply magnetic effect on desktop (pointer: fine)
    if (window.matchMedia("(pointer: fine)").matches) {
        magnetically.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                btn.style.transition = 'none'; // removing CSS transition avoids lag
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Scale factor for how much it pulls
                const pullX = x * 0.3;
                const pullY = y * 0.3;
                
                btn.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.02)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                btn.style.transform = `translate(0px, 0px) scale(1)`;
            });
        });
    }

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 9. Interactive 3D Globe Tilt
    const globe = document.querySelector('.globe');
    const globeContainer = document.querySelector('.globe-container');
    
    if (globe && globeContainer && window.matchMedia("(pointer: fine)").matches) {
        globeContainer.addEventListener('mousemove', (e) => {
            const rect = globeContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate rotation (invert X&Y axis for natural tilt away from cursor)
            const rotateY = (x / rect.width) * 40; // max 20deg
            const rotateX = -(y / rect.height) * 40; // max 20deg
            
            globe.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        globeContainer.addEventListener('mouseleave', () => {
            globe.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }
});
