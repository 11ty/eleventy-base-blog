// Minimal JS for handling user preference
(function () {
    const toggle = document.getElementById('dark-mode-toggle');
    const root = document.documentElement;

    function setTheme(isDark) {
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        toggle.checked = isDark;
        localStorage.setItem('color-scheme', isDark ? 'dark' : 'light');
    }

    toggle.addEventListener('change', () => setTheme(toggle.checked));

    // Set initial state
    setTheme(root.getAttribute('data-theme') === 'dark');

    // const form = document.getElementById('theme-form');
    // Handle form submission (for no-JS fallback)
    // form.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const formData = new FormData(form);
    //     fetch('/set-theme', {
    //         method: 'POST',
    //         body: formData
    //     }).then(() => {
    //         location.reload();
    //     });
    // });
})();
