/**
 * assets/js/main.js
 * Handles dynamic component loading and basic interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dynamically inject components using absolute paths to support subdirectories
    loadComponent('/components/head.html', 'head', true);
    loadComponent('/components/navbar.html', 'header-placeholder');
    loadComponent('/components/footer.html', 'footer-placeholder');

    // Intersection Observer for scroll-reveal animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('reveal-hidden');
        revealObserver.observe(section);
    });
});

/**
 * Loads a component from a given url and injects it into a target container.
 * @param {string} url - Path to HTML fragment.
 * @param {string} targetId - ID of element to inject into. For head, use 'head'.
 * @param {boolean} isHead - Special condition to prepend inside <head>.
 */
async function loadComponent(url, targetId, isHead = false) {
    const targetElement = isHead ? document.head : document.getElementById(targetId);
    if (!targetElement) return;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            if (isHead) {
                targetElement.insertAdjacentHTML('beforeend', html);
            } else {
                targetElement.innerHTML = html;
            }
        } else {
            console.error(`Failed to load ${url}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}
