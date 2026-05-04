/**
 * Navigation, Theme, Settings & History Management
 */

// --- Sidebar & Modal Controls ---
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.add('block');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.remove('block');
        overlay.classList.add('hidden');
    }
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
        home.classList.add('view-active'); home.classList.remove('hidden');
        chat.classList.remove('view-active'); chat.classList.add('hidden');
    } else {
        home.classList.remove('view-active'); home.classList.add('hidden');
        chat.classList.add('view-active'); chat.classList.remove('hidden');
    }
    window.toggleSidebar();
};

// --- Theme Management (Dark Mode) ---
window.toggleTheme = function() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-toggle-off', 'fa-toggle-on');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-toggle-on', 'fa-toggle-off');
        localStorage.setItem('theme', 'light');
    }
};

// --- Settings & Scaling ---
function applyStyles(fontSize, iconSize, logoSize) {
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

    applyStyles(fontSize, iconSize, logoSize);
    localStorage.setItem('khittara_settings', JSON.stringify({fontSize, iconSize, logoSize}));
    if (apiKey) localStorage.setItem('gemini_api_key', apiKey);
    
    window.toggleSettings();
};

// --- Chat History UI & Delete ---
window.renderHistory = function() {
    const historyList = document.getElementById('chatHistoryList');
    const chats = JSON.parse(localStorage.getItem('chat_history') || '[]');
    
    if (chats.length === 0) {
        historyList.innerHTML = '<p class="text-xs text-gray-400 px-2 mt-4">No history yet.</p>';
        return;
    }

    historyList.innerHTML = chats.map((chat, index) => `
        <div class="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all cursor-pointer">
            <div class="flex items-center flex-1 overflow-hidden" onclick="loadChat(${index})">
                <i class="fas fa-comment-alt text-xs mr-3 text-gray-400"></i>
                <span class="truncate text-sm">${chat.title || 'Conversation ' + (index + 1)}</span>
            </div>
            <button onclick="deleteChat(${index})" class="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity">
                <i class="fas fa-trash-alt text-xs"></i>
            </button>
        </div>
    `).join('');
};

window.deleteChat = function(index) {
    if (confirm('Delete this conversation?')) {
        let chats = JSON.parse(localStorage.getItem('chat_history') || '[]');
        chats.splice(index, 1);
        localStorage.setItem('chat_history', JSON.stringify(chats));
        window.renderHistory();
    }
};

// --- Initialization on Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Load Theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').classList.replace('fa-toggle-off', 'fa-toggle-on');
    }

    // Load Settings
    const saved = JSON.parse(localStorage.getItem('khittara_settings'));
    if (saved) {
        document.getElementById('fontSizeSlider').value = saved.fontSize;
        document.getElementById('iconSizeSlider').value = saved.iconSize;
        document.getElementById('logoSizeSlider').value = saved.logoSize;
        applyStyles(saved.fontSize, saved.iconSize, saved.logoSize);
    }

    // Load API Key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) document.getElementById('apiKeyInput').value = savedKey;

    window.renderHistory();
});
