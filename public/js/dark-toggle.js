// Minimal JS for handling user preference
(function () {
    const toggle = document.getElementById('dark-mode-toggle');

    // Set initial state based on localStorage or system preference
    const storedTheme = localStorage.getItem('color-scheme');
    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        toggle.checked = storedTheme === 'dark';
    }

    // Handle toggle changes
    toggle.addEventListener('change', () => {
        const newTheme = toggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('color-scheme', newTheme);
    });

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
