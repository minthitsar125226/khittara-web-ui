/**
 * Navigation & Global Settings
 */

window.toggleSidebar = function() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
    overlay.classList.toggle('block');
};

window.toggleSettings = function() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
};

window.switchView = function(viewName) {
    const home = document.getElementById('homeView');
    const chat = document.getElementById('chatView');
    if (viewName === 'home') {
        home.classList.remove('hidden'); home.classList.add('flex');
        chat.classList.add('hidden'); chat.classList.remove('flex');
    } else {
        home.classList.add('hidden'); home.classList.remove('flex');
        chat.classList.remove('hidden'); chat.classList.add('flex');
    }
    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar.classList.contains('-translate-x-full')) window.toggleSidebar();
};

function applyGlobalStyles(fontSize, iconSize, logoSize) {
    const root = document.documentElement;
    const fonts = ["14px", "16px", "20px"];
    const icons = ["18px", "24px", "32px"];
    const logos = ["0.8", "1.0", "1.3"];
    root.style.setProperty('--base-font-size', fonts[fontSize]);
    root.style.setProperty('--base-icon-size', icons[iconSize]);
    root.style.setProperty('--base-logo-scale', logos[logoSize]);
}

window.saveSettings = function() {
    const fontSize = document.getElementById('fontSizeSlider').value;
    const iconSize = document.getElementById('iconSizeSlider').value;
    const logoSize = document.getElementById('logoSizeSlider').value;
    const apiKey = document.getElementById('apiKeyInput').value;

    applyGlobalStyles(fontSize, iconSize, logoSize);
    localStorage.setItem('khittara_settings', JSON.stringify({fontSize, iconSize, logoSize}));
    if (apiKey) localStorage.setItem('gemini_api_key', apiKey);
    window.toggleSettings();
};

window.toggleTheme = function() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.classList.toggle('fa-toggle-on', isDark);
    icon.classList.toggle('fa-toggle-off', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Keyboard တက်လာရင် Layout ကို တိုက်ရိုက်ညှိပေးတဲ့ အပိုင်း
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        const height = window.visualViewport.height;
        document.body.style.height = height + 'px';
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').classList.replace('fa-toggle-off', 'fa-toggle-on');
    }
    const saved = JSON.parse(localStorage.getItem('khittara_settings'));
    if (saved) {
        document.getElementById('fontSizeSlider').value = saved.fontSize;
        document.getElementById('iconSizeSlider').value = saved.iconSize;
        document.getElementById('logoSizeSlider').value = saved.logoSize;
        applyGlobalStyles(saved.fontSize, saved.iconSize, saved.logoSize);
    }
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) document.getElementById('apiKeyInput').value = savedKey;
});
