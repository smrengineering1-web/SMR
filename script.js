// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Setup GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
// Enlarge cursor on links/buttons
document.querySelectorAll('a, button, .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.background = 'rgba(200, 155, 60, 0.2)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'transparent';
    });
});

// Scroll Progress Bar
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${totalScroll / windowHeight * 100}%`;
    progressBar.style.width = scroll;
});

// Glassmorphism Navbar on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- MOBILE NAVIGATION LOGIC ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
const mobileCloseBtn = document.querySelector('.mobile-close');
const desktopNavLinks = document.querySelector('.nav-links');
const mobileNavLinksContainer = document.querySelector('.mobile-nav-links');

// Task 3: Re-use links dynamically
mobileNavLinksContainer.innerHTML = desktopNavLinks.innerHTML;

let isMenuOpen = false;
let focusableElements = [];
let firstFocusableElement;
let lastFocusableElement;

// Helper function to lock/unlock body scroll
function toggleBodyScroll(lock) {
    if (lock) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function openMenu() {
    isMenuOpen = true;
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    
    toggleBodyScroll(true);
    
    // Accessibility: Focus trap setup
    focusableElements = mobileMenu.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        setTimeout(() => firstFocusableElement.focus(), 100); // slight delay to allow display
    }
}

function closeMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    
    toggleBodyScroll(false);
    hamburger.focus();
}

// Event Listeners for menu toggling
hamburger.addEventListener('click', () => {
    if (isMenuOpen) closeMenu();
    else openMenu();
});

mobileCloseBtn.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);

// Close menu when clicking any link inside the mobile drawer
mobileNavLinksContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        closeMenu();
    }
});

// ESC Key & Focus Trap Support
document.addEventListener('keydown', (e) => {
    if (!isMenuOpen) return;
    
    if (e.key === 'Escape') {
        closeMenu();
    }
    
    if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});


// GSAP Animations

// Hero Load Sequence
const tlHero = gsap.timeline();
tlHero.from(".gs-reveal", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});

// Fade Up Elements on Scroll
gsap.utils.toArray('.gs-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// Horizontal Reveals (Why Us Section)
gsap.from(".gs-fade-right", {
    scrollTrigger: { trigger: ".why-us", start: "top 75%" },
    x: -80, opacity: 0, duration: 1, ease: "power3.out"
});
gsap.from(".gs-fade-left", {
    scrollTrigger: { trigger: ".why-us", start: "top 75%" },
    x: 80, opacity: 0, duration: 1, ease: "power3.out", delay: 0.3
});

// Parallax background on Hero
gsap.to(".hero-bg", {
    y: "30%",
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Animated Counters
const counters = document.querySelectorAll('.stat-num');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => {
            gsap.to(counter, {
                innerHTML: target,
                duration: 2.5,
                snap: { innerHTML: 1 },
                ease: "power1.inOut"
            });
        },
        once: true
    });
});
