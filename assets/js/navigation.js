function switchView(viewName) {
    const home = document.getElementById('homeView');
    const chat = document.getElementById('chatView');
    
    // UI states handling
    if (viewName === 'home') {
        home.classList.add('view-active');
        chat.classList.remove('view-active');
    } else {
        home.classList.remove('view-active');
        chat.classList.add('view-active');
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function saveSettings() {
    localStorage.setItem('khittara_api_key', document.getElementById('apiKeyInput').value.trim());
    localStorage.setItem('khittara_model', document.getElementById('modelInput').value.trim());
    toggleSettings();
}
