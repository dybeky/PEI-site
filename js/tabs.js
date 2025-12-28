// Tab switching functionality
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => {
        p.style.animation = 'none';
        p.classList.remove('active');
    });

    const tabIndex = {
        'github': 0,
        'ideas': 1,
        'complaints': 2
    }[tab];

    if (tabIndex !== undefined) {
        tabs[tabIndex].classList.add('active');
        const panelIds = ['github-panel', 'ideas-panel', 'complaints-panel'];
        const panel = document.getElementById(panelIds[tabIndex]);

        setTimeout(() => {
            panel.style.animation = 'fadeInUp 0.4s ease-out';
            panel.classList.add('active');
        }, 10);
    }
}
