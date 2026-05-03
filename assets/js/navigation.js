function switchView(viewName) {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('view-active'));
    document.getElementById(viewName + 'View').classList.add('view-active');
    
    // Update Sidebar Active State
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active-tab'));
    event.currentTarget.classList.add('active-tab');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function saveSettings() {
    localStorage.setItem('khittara_api_key', document.getElementById('apiKeyInput').value);
    localStorage.setItem('language', document.getElementById('langSelect').value);
    alert('Settings Saved!');
    toggleSettings();
}

// Load theme on startup
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
