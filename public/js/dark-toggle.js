// Toggle dark/light mode and save
const toggle = document.getElementById('dark-mode-toggle');
const root = document.documentElement;

const setTheme = isDark => {
    root.classList.toggle('dark-mode', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
    toggle.textContent = isDark ? '🌞' : '🌚';
    localStorage.setItem('color-scheme', isDark ? 'dark' : 'light');
};

const storedTheme = localStorage.getItem('color-scheme');
setTheme(storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);

toggle.style.display = 'block';
toggle.onclick = () => setTheme(root.style.colorScheme !== 'dark');
