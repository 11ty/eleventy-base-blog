const [toggleButton, root] = [document.getElementById('dark-mode-toggle'), document.documentElement];

root.style.colorScheme = localStorage.getItem('color-scheme') ?? 'light';

toggleButton.addEventListener('click', () => {
    root.style.colorScheme = root.style.colorScheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('color-scheme', root.style.colorScheme);
});