/**
 * Navigation & History Logic
 */

// ၁။ Sidebar Toggle
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
};

// ၂။ Settings Modal Toggle
window.toggleSettings = function() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
};

// ၃။ View Switcher
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

// ၄။ Dark Mode
window.toggleTheme = function() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.classList.toggle('fa-toggle-on', isDark);
    icon.classList.toggle('fa-toggle-off', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// ၅။ Chat History & Delete
window.renderHistory = function() {
    const historyList = document.getElementById('chatHistoryList');
    const chats = JSON.parse(localStorage.getItem('chat_history') || '[]');
    
    historyList.innerHTML = chats.map((chat, index) => `
        <div class="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-all">
            <div class="flex items-center flex-1 overflow-hidden" onclick="loadChat(${index})">
                <i class="fas fa-comment-alt text-xs mr-3 text-gray-400"></i>
                <span class="truncate text-sm">${chat.title || 'New Chat'}</span>
            </div>
            <button onclick="deleteChat(event, ${index})" class="p-2 text-gray-400 hover:text-red-500">
                <i class="fas fa-trash-alt text-xs"></i>
            </button>
        </div>
    `).join('');
};

window.deleteChat = function(event, index) {
    event.stopPropagation(); // Chat load မဖြစ်အောင် တားခြင်း
    if (confirm('Delete this chat history?')) {
        let chats = JSON.parse(localStorage.getItem('chat_history') || '[]');
        chats.splice(index, 1);
        localStorage.setItem('chat_history', JSON.stringify(chats));
        window.renderHistory();
    }
};

// ၆။ Mobile Keyboard View Adjustment
if ('visualViewport' in window) {
    window.visualViewport.addEventListener('resize', () => {
        const height = window.visualViewport.height;
        document.body.style.height = `${height}px`;
        // Keyboard တက်လာရင် အောက်ဆုံးကို scroll ဆွဲပေးခြင်း
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') window.toggleTheme();
    window.renderHistory();
});
