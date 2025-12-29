// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme on page load
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        // Save theme preference
        const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);

        // Add ripple effect on button
        createRipple(themeToggle);
    });

    // Create ripple effect
    function createRipple(button) {
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                from {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
