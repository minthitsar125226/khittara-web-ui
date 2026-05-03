function switchView(viewName) {
    const home = document.getElementById('homeView');
    const chat = document.getElementById('chatView');
    const tabs = document.querySelectorAll('.sidebar-icon');

    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    if (viewName === 'home') {
        home.classList.add('view-active');
        chat.classList.remove('view-active');
        document.querySelector('[onclick="switchView(\'home\')"]').classList.add('active-tab');
    } else {
        home.classList.remove('view-active');
        chat.classList.add('view-active');
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
    modal.style.display = modal.classList.contains('hidden') ? 'none' : 'flex';
}

function saveSettings() {
    localStorage.setItem('khittara_api_key', document.getElementById('apiKeyInput').value.trim());
    localStorage.setItem('khittara_model', document.getElementById('modelInput').value.trim());
    toggleSettings();
}
